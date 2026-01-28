import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUI } from '../../context/UIContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataEntryTabs } from '../../components/admin/DataEntryTabs';
import { renderTabContent } from '../../components/admin/DataEntryFormFields';
import { DATA_ENTRY_TABS } from '../../constants/dataEntry';
import { useDataEntryForm } from '../../hooks/useDataEntryForm';
import { validateStep } from '../../utils/stepValidation';
import {
  prepareStepData,
  prepareCompleteSubmissionData,
} from '../../utils/submissionData';
import {
  saveStepData,
  saveSubmissionStatus,
  loadStepData,
  areAllStepsCompleted,
  submitCompleteEntry,
} from '../../services/dataEntryService';

export default function DataEntry() {
  const { addToast } = useUI();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState('basic');

  const editYear = searchParams.get('year');
  const editMonth = searchParams.get('month');
  const isEditMode = searchParams.get('edit') === 'true';

  const handleEditRestriction = () => {
        addToast('Cannot edit entries older than one month', 'error');
        navigate('/admin/history');
  };

  const {
    formData,
    submittedTabs,
    updateField,
    updateSubmittedTabs,
  } = useDataEntryForm(handleEditRestriction, editYear, editMonth, isEditMode);

  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const allStepsCompleted = areAllStepsCompleted(
    formData.year,
    formData.month,
    DATA_ENTRY_TABS.length
  );

  const handleTabClick = (tabId) => {
    if (tabId !== 'basic' && currentTab === 'basic') {
      const isValid = validateStep(1, formData, {
        showToast: true,
        addToast,
      });
      if (!isValid) {
      return;
      }
    }
    setCurrentTab(tabId);
  };

  const handlePeriodChangeError = (message) => {
    addToast(message, 'error');
  };

  const handleTabSubmit = async (tabId) => {
    const tab = DATA_ENTRY_TABS.find((t) => t.id === tabId);
    const stepId = tab?.stepId;

    if (!stepId) {
      return;
    }

    if (!formData.month || !formData.year) {
      addToast('Please select month and year first', 'error');
      return;
    }

    const isValid = validateStep(stepId, formData, {
      showToast: true,
      addToast,
    });

    if (!isValid) {
      return;
    }

    const stepData = prepareStepData(stepId, formData);

    saveStepData(formData.year, formData.month, stepData, stepId);
    saveSubmissionStatus(formData.year, formData.month, stepId, true);
    updateSubmittedTabs(stepId, true);

    addToast(`${tab.title} data submitted successfully!`, 'success');
  };

  const handleFinalSubmit = async () => {
    if (!formData.month || !formData.year) {
      addToast('Please select month and year first', 'error');
      return;
    }

    if (!allStepsCompleted) {
      addToast('Please complete all tabs before final submission', 'error');
      return;
    }

    if (!submittedTabs[7]) {
      const isValid = validateStep(7, formData, {
        showToast: true,
        addToast,
      });
      if (!isValid) {
        return;
      }
      await handleTabSubmit('travel');
    }

    const savedData = loadStepData(formData.year, formData.month);
    if (!savedData) {
      addToast('No data found to submit', 'error');
      return;
    }

    const completeData = prepareCompleteSubmissionData(formData, savedData);

    try {
      await submitCompleteEntry(formData.year, formData.month, completeData);
      addToast('All data submitted successfully!', 'success');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Final submission error:', error);
      addToast('Failed to submit data. Please try again.', 'error');
    }
  };

  const currentTabIndex = DATA_ENTRY_TABS.findIndex((t) => t.id === currentTab);
  const currentStepId = DATA_ENTRY_TABS.find((t) => t.id === currentTab)?.stepId || 0;
  const isCurrentTabSubmitted = submittedTabs[currentStepId] || false;

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-emerald-800/20 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-white">
              <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">
                Admin
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Monthly Data Entry</h1>
              <p className="text-sm text-emerald-50">
                Enter environmental data for the selected period
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/admin/dashboard')}
              className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>

        <Card className="bg-white border-2 border-emerald-100 shadow-lg mb-6">
          <div className="p-4">
            <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200">
              <DataEntryTabs
                tabs={DATA_ENTRY_TABS}
                currentTab={currentTab}
                submittedTabs={submittedTabs}
                onTabClick={handleTabClick}
              />
              <div className="ml-auto flex items-center">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleFinalSubmit}
                  className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap"
                  disabled={!allStepsCompleted}
                >
                  ✓ Final Submit
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200">
            <div className="p-6">
              {renderTabContent(
                currentTab,
                formData,
                updateField,
                handlePeriodChangeError,
                allStepsCompleted
              )}
            </div>

            <div className="flex justify-between items-center p-6 border-t border-slate-200 bg-slate-50">
              <div className="flex gap-2 items-center">
                {isCurrentTabSubmitted && (
                  <span className="text-sm text-emerald-600 font-semibold">✓ Submitted</span>
                )}
                {currentTabIndex > 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      if (currentTabIndex > 0) {
                        handleTabClick(DATA_ENTRY_TABS[currentTabIndex - 1].id);
                      }
                    }}
                  >
                    ← Back
                  </Button>
                )}
              </div>

              <div className="flex gap-2 items-center">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => handleTabSubmit(currentTab)}
                  className={
                    isCurrentTabSubmitted ? 'bg-blue-600 hover:bg-blue-700' : ''
                  }
                >
                  Submit {DATA_ENTRY_TABS.find((t) => t.id === currentTab)?.title || 'Tab'}
                </Button>
                {currentTabIndex < DATA_ENTRY_TABS.length - 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      if (currentTabIndex < DATA_ENTRY_TABS.length - 1) {
                        handleTabClick(DATA_ENTRY_TABS[currentTabIndex + 1].id);
                      }
                    }}
                  >
                    Next →
                  </Button>
                )}
              </div>
            </div>
          </div>

          {formData.month && formData.year && !allStepsCompleted && (
            <div className="bg-yellow-50 border-t-2 border-yellow-200 p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Warning:</strong> Please complete all tabs before changing to a
                different month/year.
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Completed: {Object.keys(submittedTabs).filter((key) => submittedTabs[key]).length}{' '}
                of {DATA_ENTRY_TABS.length} tabs
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
