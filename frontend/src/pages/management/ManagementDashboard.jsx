import { useState, useMemo, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { useData } from '../../context/DataContext';
import { Select } from '../../components/ui/Select';
import { getDefaultYear } from '../../utils/formatters';
import { useYearlyDataAggregation } from '../../hooks/useYearlyDataAggregation';
import { useAvailableYears } from '../../hooks/useAvailableYears';
import { transformMonthlyDataForChart } from '../../utils/dataTransformers';
import { DataViewHeader } from '../../components/management/DataViewHeader';
import { DetailedMetricsGrid } from '../../components/management/DetailedMetricsGrid';
import { WasteSegregationSection } from '../../components/management/WasteSegregationSection';
import { YearlyChartsSection } from '../../components/management/YearlyChartsSection';
import { loadAdminDataFromStorage } from '../../utils/adminDataLoader';

const VIEW_TYPES = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

const DEFAULT_MONTH = 'December';

/**
 * Management Dashboard Component
 * Main dashboard for management role displaying environmental data analysis
 */
export default function ManagementDashboard() {
  const { monthlyAdminData: dummyData } = useData();
  const [viewType, setViewType] = useState(VIEW_TYPES.MONTHLY);
  const [selectedMonth, setSelectedMonth] = useState(DEFAULT_MONTH);
  const [selectedYear, setSelectedYear] = useState(getDefaultYear());
  const [monthlyAdminData, setMonthlyAdminData] = useState(dummyData);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage, fallback to dummy data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const storageData = await loadAdminDataFromStorage();
        
        // If we have data from storage, use it; otherwise use dummy data
        if (storageData.length > 0) {
          setMonthlyAdminData(storageData);
        } else {
          // Use dummy data as fallback
          setMonthlyAdminData(dummyData);
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
        // Fallback to dummy data on error
        setMonthlyAdminData(dummyData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dummyData]);

  const availableYears = useAvailableYears(monthlyAdminData);
  const yearlyData = useYearlyDataAggregation(monthlyAdminData, selectedYear);

  // Filter data by selected year for monthly view
  const filteredYearlyData = useMemo(() => {
    return monthlyAdminData.filter((entry) => entry.period.year === selectedYear);
  }, [monthlyAdminData, selectedYear]);

  // Get month options for selector
  const monthOptions = useMemo(() => {
    return [
      { label: 'Select Month', value: '' },
      ...filteredYearlyData.map((entry) => ({
        label: entry.period.month,
        value: entry.period.month,
      })),
    ];
  }, [filteredYearlyData]);

  // Get year options for selector
  const yearOptions = useMemo(() => {
    return [
      { label: 'Select Year', value: '' },
      ...availableYears.map((year) => ({
        label: year,
        value: year,
      })),
    ];
  }, [availableYears]);

  // Get selected data based on view type
  const selectedData = useMemo(() => {
    if (viewType === VIEW_TYPES.YEARLY) {
      return yearlyData;
    }
    return monthlyAdminData.find(
      (entry) =>
        entry.period.month === selectedMonth &&
        entry.period.year === selectedYear
    );
  }, [monthlyAdminData, selectedMonth, selectedYear, viewType, yearlyData]);

  // Prepare yearly chart data
  const yearlyChartData = useMemo(() => {
    return transformMonthlyDataForChart(filteredYearlyData);
  }, [filteredYearlyData]);

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <DataViewHeader
          viewType={viewType}
          onViewTypeChange={setViewType}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          monthOptions={monthOptions}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          yearOptions={yearOptions}
          showMonthSelector={viewType === VIEW_TYPES.MONTHLY}
          showYearSelector={viewType === VIEW_TYPES.YEARLY}
        />

        {loading ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">Loading data...</p>
            </div>
          </Card>
        ) : selectedData ? (
          <>
            <Card>
              <DetailedMetricsGrid data={selectedData} viewType={viewType} />
            </Card>

            {viewType === VIEW_TYPES.YEARLY && (
              <>
                <WasteSegregationSection
                  year={selectedData.period.year}
                  wasteData={selectedData.waste}
                />
                <YearlyChartsSection
                  year={selectedData.period.year}
                  chartData={yearlyChartData}
                />
              </>
            )}
          </>
        ) : (
          <Card>
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">
                No data available for the selected{' '}
                {viewType === VIEW_TYPES.YEARLY ? 'year' : 'month'}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
