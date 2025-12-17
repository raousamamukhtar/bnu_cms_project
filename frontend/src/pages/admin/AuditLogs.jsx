import { Table } from '../../components/ui/Table';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/formatters';

export default function AuditLogs() {
  const { audits } = useData();

  const columns = [
    { header: 'User', accessor: 'user' },
    { header: 'Role', accessor: 'role' },
    { header: 'Action', accessor: 'action' },
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      cell: (row) => formatDate(row.timestamp),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-500">
          Admin
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">Audit Logs</h2>
        <p className="text-sm text-slate-500">
          Immutable feed of critical administrative events.
        </p>
      </div>

      <Table columns={columns} data={audits} />
    </div>
  );
}


