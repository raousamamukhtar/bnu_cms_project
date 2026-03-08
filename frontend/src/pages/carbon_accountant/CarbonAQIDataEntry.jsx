import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useUI } from '../../context/UIContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getYearOptions, getDefaultYear } from '../../utils/formatters';
import { carbonService } from '../../services/carbonService';

export default function CarbonAQIDataEntry() {
  const { addToast } = useUI();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    month: '',
    year: getDefaultYear(),
    aqi: '',
    carbonFootprint: '',
  });

  const [locked, setLocked] = useState(false);
  const [isDateFixed, setIsDateFixed] = useState(false);

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const getNextMonth = (lastMonth, lastYear) => {
    const currentIndex = monthsList.findIndex(m => m.toLowerCase() === lastMonth.toLowerCase());
    if (currentIndex === -1) return { month: '', year: lastYear };

    if (currentIndex === 11) {
      return { month: 'January', year: (parseInt(lastYear) + 1).toString() };
    }
    return { month: monthsList[currentIndex + 1], year: lastYear };
  };

  // Auto-select next month logic
  useEffect(() => {
    const isEdit = searchParams.get('edit') === 'true';
    if (!isEdit && !searchParams.get('month') && !formData.month) {
      // Fetch latest entry from API
      carbonService.getCarbonData()
        .then(data => {
          if (data.length > 0) {
            const latest = data[0]; // API returns sorted data
            const next = getNextMonth(latest.month, latest.year);

            setFormData(prev => ({
              ...prev,
              month: next.month,
              year: next.year
            }));
            setIsDateFixed(true);
          }
        })
        .catch(err => console.error('Error fetching carbon data:', err));
    }
  }, [searchParams]);

  // Load existing data if editing OR check for duplicate
  useEffect(() => {
    const editYear = searchParams.get('year');
    const editMonth = searchParams.get('month');
    const isEdit = searchParams.get('edit') === 'true';

    // Priority 1: Edit Mode (from History) - Not used anymore, handled by History page
    if (isEdit && editYear && editMonth) {
      // This path is deprecated - editing happens in History page modal
      return;
    }

    // Priority 2: Check Duplicate on Selection Change
    if (formData.year && formData.month) {
      carbonService.getCarbonData()
        .then(data => {
          const existing = data.find(entry =>
            entry.year === formData.year && entry.month === formData.month
          );

          if (existing) {
            setLocked(true);
            setFormData(prev => ({
              ...prev,
              aqi: existing.aqi || '',
              carbonFootprint: existing.carbonFootprint || '',
            }));
          } else {
            setLocked(false);
            setFormData(prev => ({ ...prev, aqi: '', carbonFootprint: '' }));
          }
        })
        .catch(err => {
          console.error('Error checking for duplicates:', err);
          setLocked(false);
        });
    }

  }, [searchParams, formData.year, formData.month]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (locked) {
      addToast('Entry for this period already exists. Please edit via History.', 'error');
      return;
    }
    const requiredFields = ['month', 'aqi', 'carbonFootprint'];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      addToast(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
      return;
    }

    try {
      await carbonService.createCarbonEntry({
        month: formData.month,
        year: parseInt(formData.year),
        aqi: parseFloat(formData.aqi),
        carbonFootprint: parseFloat(formData.carbonFootprint),
      });

      addToast('Carbon and AQI data saved successfully!', 'success');

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/carbon-accountant/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Save failed:', error);
      addToast('Failed to save data. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-emerald-800/20 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-white">
              <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">
                Carbon Accountant
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Data Entry</h1>
              <p className="text-sm text-emerald-50">Enter monthly environmental data</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/carbon-accountant/dashboard')}
              className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-white border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-5">
              <h2 className="text-lg font-bold text-white">Environmental Data Entry</h2>
              <p className="text-sm text-emerald-100 mt-0.5">Enter monthly AQI and carbon footprint data</p>
            </div>

            {/* Locked Warning */}
            {locked && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 m-6 mb-0">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700">
                      Data for <strong>{formData.month} {formData.year}</strong> has already been submitted.
                      <br />
                      To update this entry, please go to the <button type="button" onClick={() => navigate('/carbon-accountant/history')} className="font-bold underline cursor-pointer hover:text-amber-900">History Page</button>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Card Body */}
            <div className="p-6 space-y-6">
              {/* Period Section */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Period</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Month <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.month}
                      onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                      options={[
                        { label: 'Select Month', value: '' },
                        ...months.map((month) => ({ label: month, value: month })),
                      ]}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      options={[
                        ...getYearOptions()
                      ]}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Data Section */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Measurements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      AQI <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      value={formData.aqi}
                      onChange={(e) => setFormData({ ...formData, aqi: e.target.value })}
                      placeholder="Enter AQI value"
                      required
                      min="0"
                      step="0.01"
                      disabled={locked}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Carbon Footprint (tCO₂e) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      value={formData.carbonFootprint}
                      onChange={(e) => setFormData({ ...formData, carbonFootprint: e.target.value })}
                      placeholder="Enter carbon footprint"
                      required
                      min="0"
                      step="0.01"
                      disabled={locked}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-200">
                <Button
                  type="submit"
                  disabled={locked}
                  className={`flex-1 font-semibold py-2.5 shadow-sm ${locked ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                >
                  {locked ? 'Data Locked' : 'Submit Data'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/carbon-accountant/dashboard')}
                  className="px-6 py-2.5 border border-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}


