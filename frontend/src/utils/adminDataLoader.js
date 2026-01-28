import { getAllSubmittedEntries } from '../services/dataEntryService';
import { prepareCompleteSubmissionData } from './submissionData';

/**
 * Transform admin entry from localStorage format to management dashboard format
 * @param {Object} entry - Entry from getAllSubmittedEntries
 * @returns {Object} Transformed entry matching monthlyAdminData structure
 */
const transformAdminEntry = (entry) => {
  const { year, month, data, submittedAt } = entry;
  
  // Create formData-like object from step data
  const formData = {
    month,
    year,
    students: data.step1?.students || 0,
    employees: data.step1?.employees || 0,
  };
  
  // Ensure step1 is in savedData for prepareCompleteSubmissionData
  const savedData = {
    ...data,
    step1: data.step1 || { students: 0, employees: 0 },
  };

  // Use prepareCompleteSubmissionData to get the formatted structure
  const completeData = prepareCompleteSubmissionData(formData, savedData);
  
  return {
    ...completeData,
    submittedAt: submittedAt || new Date().toISOString(),
    submittedBy: 'admin',
  };
};

/**
 * Load all admin entries from localStorage and transform them
 * @returns {Promise<Array>} Array of entries in monthlyAdminData format
 */
export const loadAdminDataFromStorage = async () => {
  try {
    const entries = await getAllSubmittedEntries();
    return entries.map(transformAdminEntry);
  } catch (error) {
    console.error('Error loading admin data from storage:', error);
    return [];
  }
};

