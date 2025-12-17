import { Card, StatCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

// Mock marketing data
const mockMarketingData = [
  {
    id: 'mkt-001',
    type: 'Environment Day Event',
    eventName: 'World Environment Day 2025',
    link: 'https://example.com/environment-day-2025',
    date: '2025-06-05',
    month: 'June',
    year: '2025',
  },
  {
    id: 'mkt-002',
    type: 'Awareness Campaign',
    campaignName: 'Green Campus Initiative',
    link: 'https://example.com/green-campus',
    date: '2025-10-10',
    month: 'October',
    year: '2025',
  },
];

export default function MarketingDashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      label: 'Total Marketing Events',
      value: mockMarketingData.length,
      trend: 2,
      trendLabel: 'this month',
    },
    {
      label: 'Environment Day Events',
      value: mockMarketingData.filter((m) => m.type === 'Environment Day Event').length,
      trend: 1,
      trendLabel: 'this year',
    },
    {
      label: 'Awareness Campaigns',
      value: mockMarketingData.filter((m) => m.type === 'Awareness Campaign').length,
      trend: 1,
      trendLabel: 'this year',
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-emerald-800/20 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-white">
            <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">
              Marketing Head
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Marketing Dashboard
            </h2>
            <p className="text-sm text-emerald-50">
              Manage environment day events and awareness campaigns
            </p>
          </div>
          <Button 
            variant="secondary"
            onClick={() => navigate('/marketing/data-entry')}
            className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
          >
            New Marketing Entry
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5 w-full">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Recent Marketing Events */}
      <Card className="overflow-hidden w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 p-3 sm:p-4 md:p-5 pb-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-slate-900">
              Recent Marketing Events
            </h3>
            <p className="text-[10px] xs:text-xs text-slate-500 mt-1 break-words">
              Latest environment day events and awareness campaigns
            </p>
          </div>
        </div>
        <div className="p-3 sm:p-4 md:p-5 pt-0">
          <div className="space-y-3">
            {mockMarketingData.map((item) => (
              <div
                key={item.id}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-600 font-medium">
                        {item.type}
                      </span>
                      <span className="text-xs text-slate-500">
                        {item.month} {item.year}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">
                      {item.eventName || item.campaignName}
                    </h4>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-600 hover:text-emerald-700 underline"
                    >
                      {item.link}
                    </a>
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

