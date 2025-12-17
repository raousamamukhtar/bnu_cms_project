import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useUI } from '../../context/UIContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function DataEntry() {
  const { addToast } = useUI();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trainingData, setTrainingData] = useState([
    { topic: '', date: '', participants: '', attachment: null, attachmentName: '' },
  ]);


  const handleTrainingChange = (index, field, value) => {
    const updated = [...trainingData];
    updated[index][field] = value;
    setTrainingData(updated);
  };

  const handleAttachmentChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...trainingData];
      updated[index].attachment = file;
      updated[index].attachmentName = file.name;
      setTrainingData(updated);
    }
  };

  const handleRemoveAttachment = (index) => {
    const updated = [...trainingData];
    updated[index].attachment = null;
    updated[index].attachmentName = '';
    setTrainingData(updated);
  };

  const handleSubmitTraining = (e) => {
    e.preventDefault();

    const validTraining = trainingData.filter(
      (item) => item.topic && item.date
    );

    if (validTraining.length === 0) {
      addToast('Please add at least one complete training entry', 'error');
      return;
    }

    // Prepare submission data
    const submissionData = {
      training: validTraining.map((item) => ({
        topic: item.topic,
        date: item.date,
        participants: item.participants || null,
        attachment: item.attachmentName || null,
      })),
      submittedAt: new Date().toISOString(),
      submittedBy: user?.username || 'hr',
    };

    // Console log for testing
    console.log('=====================================');
    console.log('📊 FACULTY TRAINING DATA ENTRY');
    console.log('=====================================');
    console.log('Complete Submission Data:', submissionData);
    console.log('=====================================');
    console.log('Formatted JSON:', JSON.stringify(submissionData, null, 2));
    console.log('=====================================');

    addToast(`Successfully saved ${validTraining.length} training entry/entries! Check console for data.`, 'success');
    setTrainingData([{ topic: '', date: '', participants: '', attachment: null, attachmentName: '' }]);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-emerald-800/20 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-white">
              <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">
                HR Department
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Data Entry</h1>
              <p className="text-sm text-emerald-50">Enter monthly faculty training data</p>
            </div>
            <Button 
              variant="secondary"
              onClick={() => navigate('/hr/dashboard')} 
              className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Faculty Training Card */}
        <Card className="bg-white border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
          <form onSubmit={handleSubmitTraining}>
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-5">
              <div>
                <h2 className="text-lg font-bold text-white">Faculty Training</h2>
                <p className="text-sm text-emerald-100 mt-0.5">Enter faculty training sessions on environment</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {trainingData.map((item, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg p-4 bg-slate-50"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Training Topic <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={item.topic}
                        onChange={(e) => handleTrainingChange(index, 'topic', e.target.value)}
                        placeholder="e.g., Sustainable Practices in Education"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Training Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={item.date}
                        onChange={(e) => handleTrainingChange(index, 'date', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Number of Participants (Optional)
                      </label>
                      <Input
                        type="number"
                        value={item.participants}
                        onChange={(e) => handleTrainingChange(index, 'participants', e.target.value)}
                        placeholder="e.g., 25"
                        min="0"
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
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 shadow-sm"
                >
                  Submit Training Data
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

