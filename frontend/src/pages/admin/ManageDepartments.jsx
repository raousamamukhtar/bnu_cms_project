import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { useData } from '../../context/DataContext';

export default function ManageDepartments() {
  const { departments, addDepartment, departmentRanking } = useData();
  const [name, setName] = useState('');

  const columns = [
    { header: 'Department', accessor: 'department' },
    { header: 'Consumption Score', accessor: 'consumptionScore' },
    { header: 'YoY Improvement %', accessor: 'yoyImprovement' },
    { header: 'Renewable Share %', accessor: 'renewableShare' },
  ];

  const handleAdd = (e) => {
    e.preventDefault();
    addDepartment(name);
    setName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-500">
            Admin
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            Department Directory
          </h2>
        </div>
        <form onSubmit={handleAdd} className="flex gap-3 w-full sm:w-auto">
          <Input
            placeholder="New department name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Add</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-xs text-slate-500">Total Departments</p>
          <p className="text-3xl font-semibold text-slate-900">
            {departments.length}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500">Top Ranking</p>
          <p className="text-sm font-semibold text-slate-900">
            {departmentRanking[0]?.department}
          </p>
          <p className="text-xs text-slate-500">
            {departmentRanking[0]?.consumptionScore} efficiency score
          </p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500">Needs Support</p>
          <p className="text-sm font-semibold text-slate-900">
            {departmentRanking.at(-1)?.department}
          </p>
          <p className="text-xs text-slate-500">
            {departmentRanking.at(-1)?.yoyImprovement}% YoY improvement
          </p>
        </Card>
      </div>

      <Table columns={columns} data={departmentRanking} />
    </div>
  );
}


