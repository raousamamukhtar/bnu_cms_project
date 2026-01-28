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

  const [events, setEvents] = useState([
    { name: '', type: '', date: '', description: '', attachment: null, attachmentName: '' },
  ]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const eventTypes = [
    'Assessment', 'Data Collection', 'Review', 'Setup', 'Training', 'Meeting', 'Other',
  ];


  const handleEventChange = (index, field, value) => {
    const updatedEvents = [...events];
    updatedEvents[index][field] = value;
    setEvents(updatedEvents);
  };

  const handleAttachmentChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedEvents = [...events];
      updatedEvents[index].attachment = file;
      updatedEvents[index].attachmentName = file.name;
      setEvents(updatedEvents);
    }
  };

  const handleRemoveAttachment = (index) => {
    const updatedEvents = [...events];
    updatedEvents[index].attachment = null;
    updatedEvents[index].attachmentName = '';
    setEvents(updatedEvents);
  };

  const handleAddEvent = () => {
    setEvents([...events, { name: '', type: '', date: '', description: '', attachment: null, attachmentName: '' }]);
  };

  const handleRemoveEvent = (index) => {
    if (events.length > 1) {
      const updatedEvents = events.filter((_, i) => i !== index);
      setEvents(updatedEvents);
    }
  };

  // Removed handleSubmit for carbon/AQI data as coordinators only add events

  const handleSubmitEvents = (e) => {
    e.preventDefault();
    
    // Check if month/year is selected (needed for events)
    if (!formData.month || !formData.year) {
      addToast('Please select month and year first', 'error');
      return;
    }

    // Filter out empty events
    const validEvents = events.filter(
      (event) => event.name || event.type || event.date || event.description || event.attachment
    );

    if (validEvents.length === 0) {
      addToast('Please add at least one event', 'error');
      return;
    }

    // Save events to localStorage
    const key = `coordinator_events_${formData.year}_${formData.month}`;
    const eventsData = {
      events: validEvents.map(event => ({
        name: event.name,
        type: event.type,
        date: event.date,
        description: event.description,
        status: event.status || 'Pending',
        // Note: File attachments would need to be handled differently in a real app
        attachmentName: event.attachmentName,
      })),
      submittedAt: new Date().toISOString(),
      department: user?.department || 'Unknown',
    };
    
    localStorage.setItem(key, JSON.stringify(eventsData));

    addToast(`Successfully saved ${validEvents.length} event(s)!`, 'success');
    
    // Reset form
    setEvents([{ name: '', type: '', date: '', description: '', attachment: null, attachmentName: '' }]);
    setFormData({
      month: '',
      year: getDefaultYear(),
    });
    
    // Navigate to dashboard after a short delay
    setTimeout(() => {
      navigate('/coordinator/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-emerald-800/20 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-white">
              <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">
                Coordinator - {user?.department || 'Department'}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Event Entry</h1>
              <p className="text-sm text-emerald-50">Add events and activities for your department</p>
            </div>
            <Button 
              variant="secondary"
              onClick={() => navigate('/coordinator/dashboard')} 
              className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Events Card */}
        <Card className="bg-white border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
          <form onSubmit={handleSubmitEvents}>
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-5">
              <div>
                <h3 className="text-lg font-bold text-white">Monthly Events</h3>
                <p className="text-sm text-emerald-100 mt-0.5">Add events and activities for your department</p>
              </div>
            </div>

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
              {events.map((event, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg p-5 bg-white"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-semibold text-slate-700">Event {index + 1}</h4>
                    {events.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEvent(index)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Event Name
                        </label>
                        <Input
                          type="text"
                          value={event.name}
                          onChange={(e) => handleEventChange(index, 'name', e.target.value)}
                          placeholder="Event name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Event Type
                        </label>
                        <Select
                          value={event.type}
                          onChange={(e) => handleEventChange(index, 'type', e.target.value)}
                          options={[
                            { label: 'Select Type', value: '' },
                            ...eventTypes.map((type) => ({ label: type, value: type })),
                          ]}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Event Date
                        </label>
                        <Input
                          type="date"
                          value={event.date}
                          onChange={(e) => handleEventChange(index, 'date', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={event.description}
                        onChange={(e) => handleEventChange(index, 'description', e.target.value)}
                        placeholder="Event description"
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
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
                        {event.attachmentName && (
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm text-slate-600 truncate">{event.attachmentName}</span>
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
              
              {/* Add Event Button */}
              <div className="pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddEvent}
                  className="w-full border-2 border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  + Add Another Event
                </Button>
              </div>
              
              {/* Events Submit Button */}
              <div className="flex gap-4 pt-4 border-t border-slate-200">
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 shadow-sm"
                >
                  Submit Events
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/coordinator/dashboard')}
                  className="px-6 py-2.5 border border-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
