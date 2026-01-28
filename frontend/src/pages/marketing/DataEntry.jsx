import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useUI } from '../../context/UIContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getYearOptions, getDefaultYear } from '../../utils/formatters';

export default function DataEntry() {
  const { addToast } = useUI();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    month: '',
    year: getDefaultYear(),
  });

  const [marketingData, setMarketingData] = useState([
    { type: '', eventName: '', campaignName: '', link: '', date: '', attachment: null, attachmentName: '' },
  ]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const marketingTypes = [
    'Environment Day Event',
    'Awareness Campaign',
  ];

  const handleAddMarketing = () => {
    setMarketingData([...marketingData, { type: '', eventName: '', campaignName: '', link: '', date: '', attachment: null, attachmentName: '' }]);
  };

  const handleRemoveMarketing = (index) => {
    setMarketingData(marketingData.filter((_, i) => i !== index));
  };

  const handleMarketingChange = (index, field, value) => {
    const updated = [...marketingData];
    updated[index][field] = value;
    setMarketingData(updated);
  };

  const handleAttachmentChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...marketingData];
      updated[index].attachment = file;
      updated[index].attachmentName = file.name;
      setMarketingData(updated);
    }
  };

  const handleRemoveAttachment = (index) => {
    const updated = [...marketingData];
    updated[index].attachment = null;
    updated[index].attachmentName = '';
    setMarketingData(updated);
  };

  const handleSubmitMarketing = (e) => {
    e.preventDefault();

    // Check if month/year is selected
    if (!formData.month || !formData.year) {
      addToast('Please select month and year first', 'error');
      return;
    }

    const validMarketing = marketingData.filter(
      (item) => item.type && item.link && item.date && (item.eventName || item.campaignName)
    );

    if (validMarketing.length === 0) {
      addToast('Please add at least one complete marketing entry', 'error');
      return;
    }

    // Prepare submission data
    const submissionData = {
      marketing: validMarketing.map((item) => ({
        type: item.type,
        eventName: item.eventName || null,
        campaignName: item.campaignName || null,
        link: item.link,
        date: item.date,
        attachment: item.attachmentName || null,
      })),
      submittedAt: new Date().toISOString(),
      submittedBy: user?.username || 'marketing',
      month: formData.month,
      year: formData.year,
    };

    // Save to localStorage
    const key = `marketing_data_${formData.year}_${formData.month}`;
    localStorage.setItem(key, JSON.stringify(submissionData));

    addToast(`Successfully saved ${validMarketing.length} marketing entry/entries!`, 'success');
    setMarketingData([{ type: '', eventName: '', campaignName: '', link: '', date: '', attachment: null, attachmentName: '' }]);
    setFormData({ month: '', year: getDefaultYear() });
    
    // Navigate to dashboard after a short delay
    setTimeout(() => {
      navigate('/marketing/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-emerald-800/20 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-white">
              <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">
                Marketing Head
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Marketing Data Entry</h1>
              <p className="text-sm text-emerald-50">Enter environment day events and awareness campaigns</p>
            </div>
            <Button 
              variant="secondary"
              onClick={() => navigate('/marketing/dashboard')} 
              className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Marketing Data Card */}
        <Card className="bg-white border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
          <form onSubmit={handleSubmitMarketing}>
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-5">
              <div>
                <h2 className="text-lg font-bold text-white">Marketing Data</h2>
                <p className="text-sm text-emerald-100 mt-0.5">Enter environment day events and awareness campaigns</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
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

              {marketingData.map((item, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg p-4 bg-slate-50"
                >
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-700">Event Details</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Type <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={item.type}
                        onChange={(e) => handleMarketingChange(index, 'type', e.target.value)}
                        options={[
                          { label: 'Select Type', value: '' },
                          ...marketingTypes.map((type) => ({ label: type, value: type })),
                        ]}
                      />
                    </div>
                    {item.type === 'Environment Day Event' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Event Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={item.eventName}
                          onChange={(e) => handleMarketingChange(index, 'eventName', e.target.value)}
                          placeholder="e.g., World Environment Day 2025"
                        />
                      </div>
                    )}
                    {item.type === 'Awareness Campaign' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Campaign Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={item.campaignName}
                          onChange={(e) => handleMarketingChange(index, 'campaignName', e.target.value)}
                          placeholder="e.g., Green Campus Initiative"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Link <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="url"
                        value={item.link}
                        onChange={(e) => handleMarketingChange(index, 'link', e.target.value)}
                        placeholder="https://example.com/event-link"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={item.date}
                        onChange={(e) => handleMarketingChange(index, 'date', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Attachment (Optional)
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            onChange={(e) => handleAttachmentChange(index, e)}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                          <span className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
                            📎 Choose File
                          </span>
                        </label>
                        {item.attachmentName && (
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm text-slate-600 truncate">{item.attachmentName}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(index)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-4 pt-4 border-t border-slate-200">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 shadow-sm"
                >
                  Submit Marketing Data
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

