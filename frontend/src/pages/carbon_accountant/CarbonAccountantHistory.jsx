import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useUI } from '../../context/UIContext';
import { carbonService } from '../../services/carbonService';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Get all carbon accountant submitted entries from API
 * @returns {Promise<Array>} Array of entry objects
 */
const getAllCarbonAccountantEntries = async () => {
  try {
    const data = await carbonService.getCarbonData();

    // Transform API response to match expected format
    return data.map(entry => ({
      id: entry.id,
      year: entry.year,
      month: entry.month,
      data: {
        aqi: entry.aqi,
        carbonFootprint: entry.carbonFootprint
      },
      submittedAt: entry.submittedAt
    }));
  } catch (error) {
    console.error('Error fetching carbon data:', error);
    return [];
  }
};



export default function CarbonAccountantHistory() {
  const { addToast } = useUI();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
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
      const allEntries = await getAllCarbonAccountantEntries();
      setEntries(allEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
      addToast('Failed to load history entries', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry) => {

    setEditingEntry(entry);
    setEditFormData({
      aqi: entry.data?.aqi || '',
      carbonFootprint: entry.data?.carbonFootprint || '',
    });
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      setUpdateLoading(true);
      if (!editingEntry) return;

      await carbonService.updateCarbonEntry(editingEntry.id, {
        aqi: editFormData.aqi,
        carbonFootprint: editFormData.carbonFootprint,
      });

      addToast(`Data for ${editingEntry.month} updated successfully!`, 'success');
      setModalOpen(false);
      loadEntries();

    } catch (error) {
      console.error("Update failed:", error);
      addToast("Failed to update entry", "error");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await carbonService.deleteCarbonEntry(id);
      addToast('Record deleted successfully!', 'success');
      await loadEntries();
    } catch (error) {
      console.error('Delete failed:', error);
      addToast('Failed to delete record', 'error');
    } finally {
      setLoading(false);
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

    if (data.aqi) {
      preview.push(`AQI: ${data.aqi}`);
    }
    if (data.carbonFootprint) {
      preview.push(`Carbon: ${data.carbonFootprint} tCO₂e`);
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
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleEdit(row)}
            className="text-xs"
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => handleDelete(row.id)}
            className="text-xs bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
          >
            Delete
          </Button>
        </div>
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
              <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">Carbon Accountant</p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Data Entry History</h1>
              <p className="text-sm text-emerald-50">View and edit your submitted carbon and AQI data entries</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => navigate('/carbon-accountant/dashboard')}
                className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
              >
                ← Back to Dashboard
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/carbon-accountant/data-entry')}
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
                  onClick={() => navigate('/carbon-accountant/data-entry')}
                >
                  Create New Entry
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-slate-900">
                    All Entries ({entries.length})
                  </h2>
                  <Button
                    variant="secondary"
                    onClick={loadEntries}
                    className="text-xs"
                  >
                    Refresh
                  </Button>
                </div>
                <Table columns={columns} data={entries} />
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
        <div className="space-y-4 px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">AQI</label>
              <Input
                type="number"
                step="0.01"
                value={editFormData.aqi}
                onChange={(e) => setEditFormData(prev => ({ ...prev, aqi: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Carbon Footprint (tCO₂e)</label>
              <Input
                type="number"
                step="0.01"
                value={editFormData.carbonFootprint}
                onChange={(e) => setEditFormData(prev => ({ ...prev, carbonFootprint: e.target.value }))}
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
            {updateLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

