import { STEP_FIELD_MAPPINGS, FIELD_LABELS } from '../constants/dataEntry';

const hasAnyValue = (fields, formData) => {
  return fields.some((field) => {
    const value = formData[field];
    return value !== '' && value !== null && value !== undefined;
  });
};

const hasAllValues = (fields, formData) => {
  return fields.every((field) => {
    const value = formData[field];
    return value !== '' && value !== null && value !== undefined;
  });
};

const getMissingFields = (fields, formData) => {
  return fields
    .filter((field) => {
      const value = formData[field];
      return value === '' || value === null || value === undefined;
    })
    .map((field) => FIELD_LABELS[field] || field);
};

export const validateStep = (stepId, formData, options = {}) => {
  const { showToast = false, addToast } = options;
  const stepConfig = STEP_FIELD_MAPPINGS[stepId];

  if (!stepConfig) {
    return true;
  }

  const { fields, required } = stepConfig;

  if (required) {
    if (!hasAllValues(fields, formData)) {
      if (showToast && addToast) {
        const missing = getMissingFields(fields, formData);
        const stepName = getStepName(stepId);
        addToast(`Incomplete ${stepName}: Please fill in ${missing.join(', ')}`, 'error');
      }
      return false;
    }
    return true;
  }

  const hasValues = hasAnyValue(fields, formData);
  if (!hasValues) {
    return true;
  }

  if (!hasAllValues(fields, formData)) {
    if (showToast && addToast) {
      const missing = getMissingFields(fields, formData);
      const stepName = getStepName(stepId);
      addToast(`Incomplete ${stepName}: Please fill in ${missing.join(' and ')}`, 'error');
    }
    return false;
  }

  return true;
};

const getStepName = (stepId) => {
  const names = {
    1: 'Basic Information',
    2: 'Paper Data',
    3: 'Electricity Data',
    4: 'Water Data',
    5: 'Waste Data',
    6: 'Generator Data',
    7: 'Travel Data',
  };
  return names[stepId] || 'Data';
};

export const canEditEntry = (year, month) => {
  // Admin can edit any entry
  return true;
};

