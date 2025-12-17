import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';

export default function Reports() {
  const { reportsCatalog } = useData();
  const { addToast } = useUI();

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Format', accessor: 'format' },
    { header: 'Last Generated', accessor: 'lastGenerated' },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => addToast(`Exported ${row.title} as PDF`)}
          >
            PDF
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => addToast(`Exported ${row.title} as Excel`)}
          >
            Excel
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-500">
            Sustainability Cell
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">Reports</h2>
          <p className="text-sm text-slate-500">
            Generate and export PDF/Excel packets.
          </p>
        </div>
        <Button onClick={() => addToast('Batch export triggered')}>
          Export Everything
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={reportsCatalog} />
      </Card>
    </div>
  );
}


