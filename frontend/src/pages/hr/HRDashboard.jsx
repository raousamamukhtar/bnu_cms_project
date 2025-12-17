import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard, Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../utils/formatters';

// Mock data - in real app, this would come from API
const mockTrainingData = [
  {
    id: 'train-001',
    topic: 'Sustainable Practices in Education',
    date: '2025-10-15',
    participants: 25,
    status: 'completed',
  },
  {
    id: 'train-002',
    topic: 'Carbon Footprint Reduction',
    date: '2025-11-20',
    participants: 30,
    status: 'scheduled',
  },
  {
    id: 'train-003',
    topic: 'Environmental Awareness',
    date: '2025-09-10',
    participants: 28,
    status: 'completed',
  },
];


export default function HRDashboard() {
  const navigate = useNavigate();
  const [trainingData] = useState(mockTrainingData);

  const stats = [
    {
      label: 'Total Training Sessions',
      value: trainingData.length,
      trend: 3,
      trendLabel: 'this year',
    },
    {
      label: 'Upcoming Trainings',
      value: trainingData.filter((t) => t.status === 'scheduled').length,
      trend: 1,
      trendLabel: 'scheduled',
    },
    {
      label: 'Completed Trainings',
      value: trainingData.filter((t) => t.status === 'completed').length,
      trend: 2,
      trendLabel: 'completed',
    },
  ];

  const trainingColumns = [
    { header: 'Topic', accessor: 'topic' },
    {
      header: 'Date',
      accessor: 'date',
      cell: (row) => formatDate(row.date),
    },
    { header: 'Participants', accessor: 'participants' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs capitalize ${
            row.status === 'completed'
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-amber-50 text-amber-600'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];


  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-emerald-800/20 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-white">
            <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">
              HR Department
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              HR Dashboard
            </h2>
            <p className="text-sm text-emerald-50">
              View Monthly Faculty Trainings on Environment
            </p>
          </div>
          <Button 
            variant="secondary"
            onClick={() => navigate('/hr/data-entry')}
            className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
          >
            New Data Entry
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Training Data Table */}
      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 p-4 sm:p-5 pb-0">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              Monthly Faculty Training on Environment
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Track training sessions and topics
            </p>
          </div>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-5 pb-4 sm:pb-5">
          <div className="min-w-full inline-block">
            <Table columns={trainingColumns} data={trainingData} />
          </div>
        </div>
      </Card>

    </div>
  );
}

