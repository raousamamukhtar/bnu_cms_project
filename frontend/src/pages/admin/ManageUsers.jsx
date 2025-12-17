import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table } from '../../components/ui/Table';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Coordinator', value: 'coordinator' },
  { label: 'Management', value: 'management' },
];

export default function ManageUsers() {
  const { users, addUser, updateUserRole } = useData();
  const { addToast } = useUI();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'coordinator',
  });

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Role',
      accessor: 'role',
      cell: (row) => (
        <select
          value={row.role}
          onChange={(e) => {
            updateUserRole(row.id, e.target.value);
            addToast(`Updated ${row.name} to ${e.target.value}`);
          }}
          className="rounded-lg border border-slate-200 bg-white/80 px-2 py-1 text-xs"
        >
          {roleOptions.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      ),
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser(form);
    addToast('User created successfully');
    setForm({ name: '', email: '', role: 'coordinator' });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-500">
            Admin
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">Manage Users</h2>
        </div>
        <Button onClick={() => setOpen(true)}>Add User</Button>
      </div>

      <Table columns={columns} data={users} />

      <Modal open={open} onClose={() => setOpen(false)} title="Add new user">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
            options={roleOptions}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create User</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


