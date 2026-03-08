import { useState, useEffect, useMemo, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { getDefaultYear } from '../../utils/formatters';
import { useYearlyDataAggregation } from '../../hooks/useYearlyDataAggregation';
import { useAvailableYears } from '../../hooks/useAvailableYears';
import { transformMonthlyDataForChart } from '../../utils/dataTransformers';
import { DetailedMetricsGrid } from './DetailedMetricsGrid';
import { YearlyChartsSection } from './YearlyChartsSection';
import { generatePDF, generateExcel } from '../../utils/reportExporter';
import { CloudArrowDownIcon, DocumentArrowDownIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import { useUI } from '../../context/UIContext';

const REPORT_TYPES = {
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
};

export function ManagementReports({ monthlyData, loading }) {
    const [reportType, setReportType] = useState(REPORT_TYPES.MONTHLY);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState(getDefaultYear());
    const [isExporting, setIsExporting] = useState(false);
    const [isExcelExporting, setIsExcelExporting] = useState(false);
    const { addToast } = useUI();

    // Ref for chart capture
    const chartRef = useRef(null);

    // Derive available years
    const availableYears = useAvailableYears(monthlyData);

    // Auto-select the most recent year with data
    useEffect(() => {
        if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
            setSelectedYear(availableYears[0]); // First is newest (sorted desc)
        }
    }, [availableYears]);

    // Aggregate yearly data
    const yearlyData = useYearlyDataAggregation(monthlyData, selectedYear);

    // Filter data for monthly view
    const filteredMonthlyData = useMemo(() => {
        return monthlyData.filter((entry) => entry.period.year == selectedYear);
    }, [monthlyData, selectedYear]);

    // Prepare yearly chart data
    const yearlyChartData = useMemo(() => {
        return transformMonthlyDataForChart(filteredMonthlyData);
    }, [filteredMonthlyData]);

    // Options
    const monthOptions = useMemo(() => {
        return [
            { label: 'Select Month', value: '' },
            ...filteredMonthlyData.map((entry) => ({
                label: entry.period.month,
                value: entry.period.month,
            })),
        ];
    }, [filteredMonthlyData]);

    const yearOptions = useMemo(() => {
        return [
            { label: 'Select Year', value: '' },
            ...availableYears.map((year) => ({
                label: year,
                value: year,
            })),
        ];
    }, [availableYears]);

    // Get data to export based on selection
    const exportData = useMemo(() => {
        if (reportType === REPORT_TYPES.YEARLY) {
            return yearlyData;
        }
        return monthlyData.find(
            (entry) =>
                entry.period.month === selectedMonth &&
                entry.period.year == selectedYear
        );
    }, [monthlyData, selectedMonth, selectedYear, reportType, yearlyData]);

    const handleExportPDF = async () => {
        if (!exportData) return;

        setIsExporting(true);
        try {
            let chartImages = [];

            // Capture chart if it exists (only for yearly reports currently)
            if (reportType === REPORT_TYPES.YEARLY && chartRef.current) {
                const chartElements = chartRef.current.querySelectorAll('.report-chart-container');

                for (const element of chartElements) {
                    const dataUrl = await toPng(element, {
                        cacheBust: true,
                        backgroundColor: '#ffffff',
                        pixelRatio: 2
                    });
                    chartImages.push(dataUrl);
                }
            }

            const title = reportType === REPORT_TYPES.YEARLY
                ? `Yearly Report ${selectedYear}`
                : `Monthly Report ${selectedMonth} ${selectedYear}`;


            generatePDF(exportData, title, reportType, chartImages);
            addToast('PDF downloaded successfully!', 'success');
        } catch (error) {
            console.error("Export failed:", error);
            addToast(`Export failed: ${error.message}`, 'error');
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportExcel = async () => {
        if (!exportData) return;

        setIsExcelExporting(true);
        // Use timeout to allow UI to update with spinner
        setTimeout(() => {
            try {
                const title = reportType === REPORT_TYPES.YEARLY
                    ? `Yearly Report ${selectedYear}`
                    : `Monthly Report ${selectedMonth} ${selectedYear}`;

                generateExcel(exportData, title, reportType, filteredMonthlyData);
                addToast('Excel downloaded successfully!', 'success');
            } catch (error) {
                console.error("Export failed:", error);
                addToast('Failed to generate Excel.', 'error');
            } finally {
                setIsExcelExporting(false);
            }
        }, 100);
    };

    return (
        <div className="space-y-6">
            <Card>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <Select
                        label="Report Type"
                        value={reportType}
                        onChange={(e) => {
                            setReportType(e.target.value);
                            // Reset month if switching to yearly
                            if (e.target.value === REPORT_TYPES.YEARLY) setSelectedMonth('');
                        }}
                        options={[
                            { label: 'Monthly Report', value: REPORT_TYPES.MONTHLY },
                            { label: 'Yearly Summary', value: REPORT_TYPES.YEARLY },
                        ]}
                    />

                    <Select
                        label="Year"
                        value={selectedYear}
                        onChange={(e) => {
                            setSelectedYear(e.target.value);
                            setSelectedMonth(''); // Reset month on year change
                        }}
                        options={yearOptions}
                    />

                    {reportType === REPORT_TYPES.MONTHLY && (
                        <Select
                            label="Month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            options={monthOptions}
                            disabled={!selectedYear}
                        />
                    )}

                    <div className="flex gap-2 ml-auto">
                        <Button
                            onClick={handleExportPDF}
                            disabled={!exportData || isExporting}
                            variant="secondary"
                            className="flex items-center gap-2"
                        >
                            {isExporting ? (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <DocumentArrowDownIcon className="w-4 h-4" />
                            )}
                            {isExporting ? 'Generating...' : 'Export PDF'}
                        </Button>
                        <Button
                            onClick={handleExportExcel}
                            disabled={!exportData || isExcelExporting}
                            variant="secondary"
                            className="flex items-center gap-2"
                        >
                            {isExcelExporting ? (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <TableCellsIcon className="w-4 h-4" />
                            )}
                            {isExcelExporting ? 'Generating...' : 'Export Excel'}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Preview Section */}
            {exportData ? (
                <div className="space-y-6">
                    <Card>
                        <div className="border-b border-slate-100 pb-4 mb-4">
                            <h3 className="text-lg font-semibold text-slate-800">
                                Report Data Preview
                            </h3>
                            <p className="text-sm text-slate-500">
                                This is a preview of the data included in your {reportType} export.
                            </p>
                        </div>
                        <DetailedMetricsGrid data={exportData} viewType={reportType} />
                    </Card>

                    {/* Charts Section (Rendered for capture) */}
                    {reportType === REPORT_TYPES.YEARLY && (
                        <div ref={chartRef}>
                            <YearlyChartsSection
                                year={selectedYear}
                                chartData={yearlyChartData}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                    <CloudArrowDownIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-lg font-medium">No report data available</p>
                    <p className="text-slate-400 text-sm">Select a valid period to generate a report.</p>
                </div>
            )}
        </div>
    );
}
