import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { ManagementReports } from '../../components/management/ManagementReports';
import { reportsService } from '../../services/reportsService';

/**
 * Management Reports Page
 * Dedicated page for generating and exporting sustainability reports
 */
export default function ManagementReportsPage() {
    const [monthlyAdminData, setMonthlyAdminData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load data from API
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await reportsService.getDashboardData();
                setMonthlyAdminData(data);
            } catch (error) {
                console.error('Error loading reports data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <div className="w-full bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-slate-900">Reports & Export</h1>
                    <p className="text-slate-500">
                        Generate detailed monthly reports or yearly summaries for internal analysis.
                    </p>
                </div>

                {loading ? (
                    <Card>
                        <div className="text-center py-12">
                            <p className="text-slate-500 text-lg animate-pulse">Loading report data...</p>
                        </div>
                    </Card>
                ) : (
                    <ManagementReports monthlyData={monthlyAdminData} loading={loading} />
                )}
            </div>
        </div>
    );
}
