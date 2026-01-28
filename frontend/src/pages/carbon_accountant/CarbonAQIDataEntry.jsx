import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useUI } from '../../context/UIContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getYearOptions, getDefaultYear } from '../../utils/formatters';

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

  // Load existing data if editing
  useEffect(() => {
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const isEdit = searchParams.get('edit') === 'true';

    if (isEdit && year && month) {
      const key = `carbon_accountant_data_${year}_${month}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setFormData({
            month: month,
            year: year,
            aqi: data.aqi || '',
            carbonFootprint: data.carbonFootprint || '',
          });
        } catch (e) {
          console.error('Error loading existing data:', e);
        }
      }
    }
  }, [searchParams]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ['month', 'aqi', 'carbonFootprint'];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    
    if (missingFields.length > 0) {
      addToast(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
      return;
    }

    // Save to localStorage
    const key = `carbon_accountant_data_${formData.year}_${formData.month}`;
    const dataToSave = {
      aqi: formData.aqi,
      carbonFootprint: formData.carbonFootprint,
    };
    localStorage.setItem(key, JSON.stringify(dataToSave));
    
    // Save submission timestamp
    const timestampKey = `carbon_accountant_submittedAt_${formData.year}_${formData.month}`;
    localStorage.setItem(timestampKey, new Date().toISOString());

    addToast('Carbon and AQI data saved successfully!', 'success');
    
    // Navigate to dashboard after a short delay
    setTimeout(() => {
      navigate('/carbon-accountant/dashboard');
    }, 1500);
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
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-200">
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 shadow-sm"
                >
                  Submit Data
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


