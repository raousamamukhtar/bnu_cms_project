import { useState, useEffect, useRef } from 'react';
import { getDefaultYear } from '../utils/formatters';
import {
  loadStepData,
  loadSubmissionStatus,
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
  waterUnits: '',
  waterPricePerUnit: '',
  wasteOrganic: '',
  wasteRecyclables: '',
  wasteOthers: '',
  generatorAvgHours: '',
  generatorFuelLitres: '',
  businessTravelKms: '',
  businessTravelFuelLitres: '',
};

export const useDataEntryForm = (onEditRestriction, editYear, editMonth, isEditMode) => {
  const [formData, setFormData] = useState(() => {
    const month = editMonth || '';
    const year = editYear || getDefaultYear();
    return {
      ...INITIAL_FORM_DATA,
      month,
      year,
    };
  });

  const [submittedTabs, setSubmittedTabs] = useState({});
  const monthYearRef = useRef({ month: '', year: '' });

  useEffect(() => {
    if (isEditMode && editMonth && editYear) {
      if (!canEditEntry(editYear, editMonth)) {
        onEditRestriction?.();
        return;
      }

      setTimeout(() => {
        const status = loadSubmissionStatus(editYear, editMonth);
        setSubmittedTabs(status);

        const savedData = loadStepData(editYear, editMonth);
        if (savedData) {
          setFormData((prev) => ({
            ...prev,
            ...(savedData.step1 || {}),
            ...(savedData.step2 || {}),
            ...(savedData.step3 || {}),
            ...(savedData.step4 || {}),
            ...(savedData.step5 || {}),
            ...(savedData.step6 || {}),
            ...(savedData.step7 || {}),
            month: editMonth,
            year: editYear,
          }));
        }
      }, 0);
      return;
    }

    if (formData.month && formData.year) {
      const monthYearKey = `${formData.year}_${formData.month}`;
      const lastKey = `${monthYearRef.current.year}_${monthYearRef.current.month}`;

      if (monthYearKey !== lastKey) {
        monthYearRef.current = { month: formData.month, year: formData.year };

        setTimeout(() => {
          const status = loadSubmissionStatus(formData.year, formData.month);
          setSubmittedTabs(status);

          const savedData = loadStepData(formData.year, formData.month);
          if (savedData) {
            setFormData((prev) => ({
              ...prev,
              ...(savedData.step1 || {}),
              ...(savedData.step2 || {}),
              ...(savedData.step3 || {}),
              ...(savedData.step4 || {}),
              ...(savedData.step5 || {}),
              ...(savedData.step6 || {}),
              ...(savedData.step7 || {}),
              month: formData.month,
              year: formData.year,
            }));
          }
        }, 0);
      }
    }
  }, [formData.month, formData.year, isEditMode, editMonth, editYear, onEditRestriction]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSubmittedTabs = (stepId, submitted) => {
    setSubmittedTabs((prev) => ({ ...prev, [stepId]: submitted }));
  };

  return {
    formData,
    submittedTabs,
    updateField,
    updateSubmittedTabs,
    isEditMode,
  };
};

