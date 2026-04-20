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
import { SubmissionSuccessModal } from '../../components/admin/SubmissionSuccessModal';
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
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedMonthYear, setSubmittedMonthYear] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

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
    isExistingEntry,
    updateField,
    updateSubmittedTabs,
    resetFormForNextMonth,
  } = useDataEntryForm(handleEditRestriction, editYear, editMonth, isEditMode);

  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Reset unlocked state when period changes
  useEffect(() => {
    setIsUnlocked(false);
  }, [formData.month, formData.year]);

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

    // For steps 2-7, month and year are required to create/fetch period
    if (stepId !== 1 && (!formData.month || !formData.year)) {
      addToast('Please select month and year in the Basic Information tab first', 'error');
      return;
    }

    const isValid = validateStep(stepId, formData, {
      showToast: true,
      addToast,
    });

    if (!isValid) {
      return;
    }

    try {
      setSubmitting(true);
      const stepData = prepareStepData(stepId, formData);
      await saveStepData(formData.year, formData.month, stepData, stepId);
      saveSubmissionStatus(formData.year, formData.month, stepId, true);
      updateSubmittedTabs(stepId, true);

      addToast(`${tab.title} data submitted successfully!`, 'success');
    } catch (error) {
      console.error(`Error submitting ${tab.title} data:`, error);
      addToast(`Failed to submit ${tab.title} data. Please try again.`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    // TEMPORARILY DISABLED: Month/year validation
    // if (!formData.month || !formData.year) {
    //   addToast('Please select month and year first', 'error');
    //   return;
    // }

    if (!allStepsCompleted) {
      addToast('Please complete all tabs before final submission', 'error');
      return;
    }



    const savedData = await loadStepData(formData.year, formData.month);
    if (!savedData) {
      addToast('No data found to submit', 'error');
      return;
    }

    const completeData = prepareCompleteSubmissionData(formData, savedData);

    try {
      setSubmitting(true);
      await submitCompleteEntry(formData.year, formData.month, completeData);

      // Store the submitted month/year for modal display
      setSubmittedMonthYear(`${formData.month} ${formData.year}`);

      // Show success modal instead of immediate redirect
      setShowSuccessModal(true);

      addToast('All data submitted successfully!', 'success');
    } catch (error) {
      console.error('Final submission error:', error);
      addToast('Failed to submit data. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnterNextMonth = () => {
    // Reset form for next month
    const nextPeriod = resetFormForNextMonth(formData.month, formData.year);

    // Clear localStorage submission status for the current period
    localStorage.removeItem(`submission_status_${formData.year}_${formData.month}`);

    // Close modal
    setShowSuccessModal(false);

    // Reset to first tab
    setCurrentTab('basic');

    // Show success message
    addToast(`Ready to enter data for ${nextPeriod.month} ${nextPeriod.year}`, 'success');
  };

  const handleGoToDashboard = () => {
    setShowSuccessModal(false);
    navigate('/admin/dashboard');
  };

  const handleCloseModal = () => {
    // Just close modal, stay on current page
    setShowSuccessModal(false);
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

        <Card className="bg-white border-2 border-emerald-100 shadow-lg mb-6 overflow-hidden">
          {/* Locked Warning - Styled like Carbon Accountant */}
          {/* Existing Entry Warning */}
          {isExistingEntry && !isEditMode && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 m-6 mb-0 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-sm text-amber-700">
                    Data for <strong>{formData.month} {formData.year}</strong> already exists.
                    <br />
                    You are editing an existing submission or draft.
                  </p>
                  {!isUnlocked && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsUnlocked(true)}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-200 font-bold py-1 px-4 text-xs h-auto"
                    >
                      🔓 Unlock for Edit
                    </Button>
                  )}
                  {isUnlocked && (
                   <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">
                     ✓ Panel Unlocked
                   </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="p-4">
            <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200">
              <DataEntryTabs
                tabs={DATA_ENTRY_TABS}
                currentTab={currentTab}
                submittedTabs={submittedTabs}
                onTabClick={handleTabClick}
              />

            </div>
          </div>

          <div className="border-t border-slate-200">
            <div className="p-6">
              {renderTabContent(
                currentTab,
                formData,
                updateField,
                handlePeriodChangeError,
                allStepsCompleted,
                isEditMode,
                isExistingEntry && !isEditMode && !isUnlocked // Lock fields if existing entry and not unlocked
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
                  loading={submitting}
                  disabled={submitting || (isExistingEntry && !isEditMode && !isUnlocked)}
                >
                  {isExistingEntry ? `Update ${DATA_ENTRY_TABS.find((t) => t.id === currentTab)?.title || 'Tab'}` : `Submit ${DATA_ENTRY_TABS.find((t) => t.id === currentTab)?.title || 'Tab'}`}
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

          {formData.month && formData.year && !allStepsCompleted && !isExistingEntry && (
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

      {/* Success Modal */}
      <SubmissionSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        onEnterNextMonth={handleEnterNextMonth}
        onGoToDashboard={handleGoToDashboard}
        monthYear={submittedMonthYear}
      />
    </div>
  );
}
