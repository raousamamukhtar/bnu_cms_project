import { useState, useEffect, useRef } from 'react';
import { getDefaultYear } from '../utils/formatters';
import {
  loadStepData,
  loadSubmissionStatus,
  getAllSubmittedEntries,
  checkIfEntryExists,
} from '../services/dataEntryService';
import { canEditEntry } from '../utils/stepValidation';

const INITIAL_FORM_DATA = {
  department: '',
  month: '',
  year: '',
  students: '',
  employees: '',
  paperReams: '',
  paperSheetsPerReam: '500',
  electricityUnits: '',
  electricityTotalCost: '',
  electricitySolarOffset: '',
  waterUnits: '',
  waterPricePerUnit: '',
  wasteOrganic: '',
  wasteRecyclables: '',
  wasteOthers: '',
  generatorHours: '',
  generatorFuelLitres: '',

};

export const useDataEntryForm = (onEditRestriction, editYear, editMonth, isEditMode) => {
  const [formData, setFormData] = useState({
    ...INITIAL_FORM_DATA,
    year: editYear || getDefaultYear(),
    month: editMonth || '',
  });

  const [submittedTabs, setSubmittedTabs] = useState({});
  const [isExistingEntry, setIsExistingEntry] = useState(false);
  const monthYearRef = useRef({ month: '', year: '' });

  const getNextMonth = (lastMonth, lastYear) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentIndex = months.findIndex(m => m.toLowerCase() === lastMonth.toLowerCase());
    if (currentIndex === -1) return { month: '', year: lastYear };

    if (currentIndex === 11) {
      return { month: 'January', year: (parseInt(lastYear) + 1).toString() };
    }
    return { month: months[currentIndex + 1], year: lastYear };
  };

  useEffect(() => {
    let isMounted = true;
    const initializeForm = async () => {
      // Suggest next month only if:
      // 1. Not in edit mode (from URL)
      // 2. No month provided via query params (editMonth)
      // 3. Current month is not yet set (initial state)
      if (!isEditMode && !editMonth && !formData.month) {
        try {
          const entries = await getAllSubmittedEntries();
          if (entries && entries.length > 0 && isMounted) {
            const months = [
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ];

            // Sort by year desc, then month index desc to get the latest
            const sorted = [...entries].sort((a, b) => {
              if (parseInt(a.year) !== parseInt(b.year)) {
                return parseInt(b.year) - parseInt(a.year);
              }
              const indexA = months.findIndex(m => m.toLowerCase() === a.month.toLowerCase());
              const indexB = months.findIndex(m => m.toLowerCase() === b.month.toLowerCase());
              return indexB - indexA;
            });

            const latest = sorted[0];
            const nextPeriod = getNextMonth(latest.month, latest.year);

            if (nextPeriod.month && isMounted) {
              setFormData(prev => ({
                ...prev,
                month: nextPeriod.month,
                year: nextPeriod.year
              }));
            }
          }
        } catch (error) {
          console.error("Failed to suggest next month:", error);
        }
      }
    };

    initializeForm();
    return () => { isMounted = false; };
  }, [isEditMode, editMonth, formData.month]); // Keep dependencies to respond to state being cleared if needed

  useEffect(() => {
    let isMounted = true;
    const loadSessionData = async () => {
      if (isEditMode && editMonth && editYear) {
        if (!canEditEntry(editYear, editMonth)) {
          onEditRestriction?.();
          return;
        }

        const status = loadSubmissionStatus(editYear, editMonth);
        setSubmittedTabs(status);

        const savedData = await loadStepData(editYear, editMonth);
        if (savedData && isMounted) {
          setFormData((prev) => ({
            ...INITIAL_FORM_DATA,
            ...savedData,
            month: editMonth,
            year: editYear,
          }));
        }
        return;
      }

      if (formData.month && formData.year) {
        const monthYearKey = `${formData.year}_${formData.month}`;
        const lastKey = `${monthYearRef.current.year}_${monthYearRef.current.month}`;

        if (monthYearKey !== lastKey) {
          console.log(`[Form Hook] Selection changed to: ${monthYearKey}. Searching DB...`);
          monthYearRef.current = { month: formData.month, year: formData.year };

          const status = loadSubmissionStatus(formData.year, formData.month);
          setSubmittedTabs(status);

          // Combined check: Load data and set existence flag
          setIsExistingEntry(false);
          try {
            // Priority 1: Check existence independently
            console.log(`[Hook] Checking existence for ${formData.month} ${formData.year}...`);
            const exists = await checkIfEntryExists(formData.year, formData.month);

            if (isMounted) {
              console.log(`[Hook] SUCCESS: Marking ${formData.month} ${formData.year} as EXISTING = ${exists}`);
              setIsExistingEntry(exists);
            }

            // Priority 2: Load data for the form
            const savedData = await loadStepData(formData.year, formData.month);
            if (savedData && isMounted) {
              console.log("[Hook] Data found, populating form...");
              setFormData((prev) => ({
                ...INITIAL_FORM_DATA,
                ...savedData,
                month: formData.month, // CRITICAL: Preserve user selection
                year: formData.year,
              }));
            } else if (isMounted) {
              console.log("[Hook] No data found, clearing fields...");
              setFormData({
                ...INITIAL_FORM_DATA,
                month: formData.month,
                year: formData.year,
              });
            }
          } catch (err) {
            console.error("[Hook] Error during session data load:", err);
          }
        }
      }
    };

    loadSessionData();
    return () => { isMounted = false; };
  }, [formData.month, formData.year, isEditMode, editMonth, editYear]); // Removed onEditRestriction to prevent infinite triggers

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSubmittedTabs = (stepId, submitted) => {
    setSubmittedTabs((prev) => ({ ...prev, [stepId]: submitted }));
  };

  const resetFormForNextMonth = (currentMonth, currentYear) => {
    // Calculate next month
    const nextPeriod = getNextMonth(currentMonth, currentYear);

    // Reset form data to initial state with next month/year
    setFormData({
      ...INITIAL_FORM_DATA,
      month: nextPeriod.month,
      year: nextPeriod.year,
    });

    // Clear submitted tabs
    setSubmittedTabs({});
    setIsExistingEntry(false);

    // Update month/year ref
    monthYearRef.current = { month: nextPeriod.month, year: nextPeriod.year };

    return nextPeriod;
  };

  return {
    formData,
    submittedTabs,
    isExistingEntry,
    updateField,
    updateSubmittedTabs,
    resetFormForNextMonth,
    isEditMode,
  };
};

