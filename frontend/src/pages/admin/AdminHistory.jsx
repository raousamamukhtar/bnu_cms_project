import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Select } from '../../components/ui/Select';
import { useUI } from '../../context/UIContext';
import { getAllSubmittedEntries, saveStepData, saveSubmissionStatus, loadStepData, submitCompleteEntry } from '../../services/dataEntryService';
import { getYearOptions, getDefaultYear } from '../../utils/formatters';
import { canEditEntry } from '../../utils/stepValidation';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { prepareStepData, prepareCompleteSubmissionData } from '../../utils/submissionData';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];


export default function AdminHistory() {
  const { addToast } = useUI();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(getDefaultYear());

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const allEntries = await getAllSubmittedEntries();
      setEntries(allEntries);

      // If we have entries but no selection matches current year, 
      // maybe default to the latest entry's year
      if (allEntries.length > 0 && !allEntries.some(e => e.year === getDefaultYear())) {
        setSelectedYear(allEntries[0].year);
      }
    } catch (error) {
      console.error('Error loading entries:', error);
      addToast('Failed to load history entries', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = useMemo(() => {
    const filtered = entries.filter((entry) => entry.year === selectedYear);

    // Sort by month index (newest first)
    return filtered.sort((a, b) => {
      return months.indexOf(b.month) - months.indexOf(a.month);
    });
  }, [entries, selectedYear]);

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setEditFormData({
      month: entry.month,
      year: entry.year,
      students: entry.data?.step1?.students ?? 0,
      employees: entry.data?.step1?.employees ?? 0,
      paperReams: entry.data?.step2?.paperReams ?? 0,
      paperSheetsPerReam: entry.data?.step2?.paperSheetsPerReam || '500',
      electricityUnits: entry.data?.step3?.electricityUnits ?? 0,
      electricityTotalCost: entry.data?.step3?.electricityTotalCost ?? 0,
      electricitySolarOffset: entry.data?.step3?.electricitySolarOffset ?? 0,
      waterUnits: entry.data?.step4?.waterUnits ?? 0,
      waterPricePerUnit: entry.data?.step4?.waterPricePerUnit ?? 0,
      wasteOrganic: entry.data?.step5?.wasteOrganic ?? 0,
      wasteRecyclables: entry.data?.step5?.wasteRecyclables ?? 0,
      wasteOthers: entry.data?.step5?.wasteOthers ?? 0,
      generatorHours: entry.data?.step6?.generatorHours ?? 0,
      generatorFuelLitres: entry.data?.step6?.generatorFuelLitres ?? 0,
    });
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      setUpdateLoading(true);
      for (let stepId = 1; stepId <= 6; stepId++) {
        const stepData = prepareStepData(stepId, editFormData);
        await saveStepData(editFormData.year, editFormData.month, stepData, stepId);
        saveSubmissionStatus(editFormData.year, editFormData.month, stepId, true);
      }
      const savedData = await loadStepData(editFormData.year, editFormData.month);
      const completeData = prepareCompleteSubmissionData(editFormData, savedData);
      await submitCompleteEntry(editFormData.year, editFormData.month, completeData);
      addToast(`Data for ${editFormData.month} ${editFormData.year} updated successfully!`, 'success');
      setModalOpen(false);
      loadEntries();
    } catch (error) {
      console.error('Update failed:', error);
      addToast('Failed to update entry', 'error');
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getDataPreview = (entry) => {
    const { data } = entry;
    const preview = [];

    if (data.step1) {
      preview.push(`${data.step1.students || 0} students, ${data.step1.employees || 0} employees`);
    }
    if (data.step2 && data.step2.paperReams) {
      preview.push(`${data.step2.paperReams} reams paper`);
    }
    if (data.step3 && data.step3.electricityUnits) {
      preview.push(`${data.step3.electricityUnits} kWh`);
    }
    if (data.step4 && data.step4.waterUnits) {
      preview.push(`${data.step4.waterUnits} m³ water`);
    }

    return preview.length > 0 ? preview.join(', ') : 'No data';
  };

  const columns = [
    {
      header: 'Period',
      accessor: 'period',
      cell: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.month} {row.year}</div>
          <div className="text-xs text-slate-500">Submitted: {formatDate(row.submittedAt)}</div>
        </div>
      ),
    },
    {
      header: 'Data Preview',
      accessor: 'preview',
      cell: (row) => (
        <div className="text-sm text-slate-600 max-w-md">
          {getDataPreview(row)}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
          ✓ Completed
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <Button
          type="button"
          variant="secondary"
          onClick={() => handleEdit(row)}
          className="text-xs"
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-emerald-800/20 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-white">
              <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">Admin</p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Data Entry History</h1>
              <p className="text-sm text-emerald-50">View and edit your submitted monthly data entries</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => navigate('/admin/dashboard')}
                className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
              >
                ← Back to Dashboard
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/admin/data-entry')}
                className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
              >
                + New Entry
              </Button>
            </div>
          </div>
        </div>

        {/* History Table */}
        <Card className="bg-white border-2 border-emerald-100 shadow-lg">
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Loading entries...</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg mb-4">No submitted entries found</p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/admin/data-entry')}
                >
                  Create New Entry
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Entries ({filteredEntries.length})
                    </h2>
                    <div className="w-40">
                      <Select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        options={getYearOptions()}
                        className="h-9"
                      />
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={loadEntries}
                    className="text-xs"
                  >
                    Refresh
                  </Button>
                </div>
                <Table columns={columns} data={filteredEntries} />
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => !updateLoading && setModalOpen(false)}
        title={`Edit Data - ${editingEntry?.month} ${editingEntry?.year}`}
      >
        <div className="max-h-[70vh] overflow-y-auto px-1 space-y-6">
          {/* Step 1: Basic Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Basic Info</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Students"
                type="number"
                value={editFormData.students}
                onChange={(e) => setEditFormData(prev => ({ ...prev, students: e.target.value }))}
              />
              <Input
                label="Employees"
                type="number"
                value={editFormData.employees}
                onChange={(e) => setEditFormData(prev => ({ ...prev, employees: e.target.value }))}
              />
            </div>
          </div>

          {/* Step 2: Paper */}
          <div className="space-y-3 border-t pt-4">
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Paper</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Reams"
                type="number"
                value={editFormData.paperReams}
                onChange={(e) => setEditFormData(prev => ({ ...prev, paperReams: e.target.value }))}
              />
              <Input
                label="Sheets/Ream"
                type="number"
                value={editFormData.paperSheetsPerReam}
                onChange={(e) => setEditFormData(prev => ({ ...prev, paperSheetsPerReam: e.target.value }))}
              />
            </div>
          </div>

          {/* Step 3: Electricity */}
          <div className="space-y-3 border-t pt-4">
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Electricity</h4>
            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Units (kWh)"
                type="number"
                value={editFormData.electricityUnits}
                onChange={(e) => setEditFormData(prev => ({ ...prev, electricityUnits: e.target.value }))}
              />
              <Input
                label="Total Cost"
                type="number"
                value={editFormData.electricityTotalCost}
                onChange={(e) => setEditFormData(prev => ({ ...prev, electricityTotalCost: e.target.value }))}
              />
              <Input
                label="Solar Offset (kWh)"
                type="number"
                value={editFormData.electricitySolarOffset}
                onChange={(e) => setEditFormData(prev => ({ ...prev, electricitySolarOffset: e.target.value }))}
              />
            </div>
          </div>

          {/* Step 4: Water */}
          <div className="space-y-3 border-t pt-4">
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Water</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Units"
                type="number"
                value={editFormData.waterUnits}
                onChange={(e) => setEditFormData(prev => ({ ...prev, waterUnits: e.target.value }))}
              />
              <Input
                label="Price/Unit"
                type="number"
                value={editFormData.waterPricePerUnit}
                onChange={(e) => setEditFormData(prev => ({ ...prev, waterPricePerUnit: e.target.value }))}
              />
            </div>
          </div>

          {/* Step 5: Waste */}
          <div className="space-y-3 border-t pt-4">
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Waste (kg)</h4>
            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Organic"
                type="number"
                value={editFormData.wasteOrganic}
                onChange={(e) => setEditFormData(prev => ({ ...prev, wasteOrganic: e.target.value }))}
              />
              <Input
                label="Recyclable"
                type="number"
                value={editFormData.wasteRecyclables}
                onChange={(e) => setEditFormData(prev => ({ ...prev, wasteRecyclables: e.target.value }))}
              />
              <Input
                label="Others"
                type="number"
                value={editFormData.wasteOthers}
                onChange={(e) => setEditFormData(prev => ({ ...prev, wasteOthers: e.target.value }))}
              />
            </div>
          </div>

          {/* Step 6: Generator */}
          <div className="space-y-3 border-t pt-4">
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Generator</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Hours"
                type="number"
                value={editFormData.generatorHours}
                onChange={(e) => setEditFormData(prev => ({ ...prev, generatorHours: e.target.value }))}
              />
              <Input
                label="Fuel (Litres)"
                type="number"
                value={editFormData.generatorFuelLitres}
                onChange={(e) => setEditFormData(prev => ({ ...prev, generatorFuelLitres: e.target.value }))}
              />
            </div>
          </div>


        </div>

        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
          <Button
            variant="secondary"
            onClick={() => setModalOpen(false)}
            disabled={updateLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdate}
            loading={updateLoading}
            disabled={updateLoading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {updateLoading ? 'Updating...' : 'Update Data'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

