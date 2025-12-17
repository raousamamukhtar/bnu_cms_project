import { useState } from 'react';
import { Table } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';

export default function SubmissionHistory() {
  const { submissions, updateSubmission } = useData();
  const { user } = useAuth();
  const { addToast } = useUI();

  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    paper: '',
    electricity: '',
    water: '',
    travel: '',
    wasteFuel: '',
  });

  const mySubmissions =
    user?.role === 'coordinator'
      ? submissions.filter((s) => s.department === user.department)
      : submissions;

  const canEditSubmission = (submission) => {
    if (user?.role !== 'coordinator') return false;
    if (submission.department !== user.department) return false;

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const period = new Date(submission.month);

    return period >= previousMonthStart && period < currentMonthStart;
  };

  const startEdit = (submission) => {
    setEditing(submission);
    setEditForm({
      paper: String(submission.metrics.paper ?? ''),
      electricity: String(submission.metrics.electricity ?? ''),
      water: String(submission.metrics.water ?? ''),
      travel: String(submission.metrics.travel ?? ''),
      wasteFuel: String(submission.metrics.wasteFuel ?? ''),
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editing) return;

    const updatedMetrics = {
      paper: Number(editForm.paper || 0),
      electricity: Number(editForm.electricity || 0),
      water: Number(editForm.water || 0),
      travel: Number(editForm.travel || 0),
      wasteFuel: Number(editForm.wasteFuel || 0),
    };

    updateSubmission(editing.id, updatedMetrics);
    addToast('Submission updated for previous month');
    setEditing(null);
  };

  const columns = [
    { header: 'Department', accessor: 'department' },
    { header: 'Month', accessor: 'month' },
    { header: 'Coordinator', accessor: 'coordinator' },
    {
      header: 'Paper',
      accessor: 'paper',
      cell: (row) => `${row.metrics.paper} kg`,
    },
    {
      header: 'Electricity',
      accessor: 'electricity',
      cell: (row) => `${row.metrics.electricity} kWh`,
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs capitalize ${
            row.status === 'approved'
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-amber-50 text-amber-600'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) =>
        canEditSubmission(row) ? (
          <Button size="sm" variant="secondary" onClick={() => startEdit(row)}>
            Edit
          </Button>
        ) : (
          <span className="text-xs text-slate-400">Locked</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-500">
          Coordinator
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Submission History
        </h2>
      </div>

      <Card>
        <h3 className="text-base font-semibold text-slate-900 mb-4">
          Submission Log
        </h3>
        <Table columns={columns} data={mySubmissions} />
      </Card>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={
          editing
            ? `Edit ${editing.department} – ${editing.month} (previous month only)`
            : 'Edit submission'
        }
      >
        <form onSubmit={handleEditSave} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Paper"
              name="paper"
              value={editForm.paper}
              onChange={handleEditChange}
            />
            <Input
              label="Electricity"
              name="electricity"
              value={editForm.electricity}
              onChange={handleEditChange}
            />
            <Input
              label="Water"
              name="water"
              value={editForm.water}
              onChange={handleEditChange}
            />
            <Input
              label="Travel"
              name="travel"
              value={editForm.travel}
              onChange={handleEditChange}
            />
            <Input
              label="Waste fuel"
              name="wasteFuel"
              value={editForm.wasteFuel}
              onChange={handleEditChange}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditing(null)}
            >
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


