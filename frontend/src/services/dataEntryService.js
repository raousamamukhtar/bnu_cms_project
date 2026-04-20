import { apiClient } from './api';

const stepEndpoints = {
  1: 'sustainability/period',
  2: 'sustainability/paper',
  3: 'sustainability/electricity',
  4: 'sustainability/water',
  5: 'sustainability/waste',
  6: 'sustainability/generator',
};

// Convert null/undefined to 0 for form display
const toFormValue = (val) => (val === null || val === undefined) ? 0 : val;

const getMonthNumber = (monthName) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months.indexOf(monthName) + 1;
};

const transformPayload = (stepId, data, periodId) => {
  const payload = { ...data };

  if (stepId === 1) {
    return {
      data_month: getMonthNumber(data.month),
      data_year: parseInt(data.year),
      students: parseInt(data.students || 0),
      employees: parseInt(data.employees || 0)
    };
  }

  payload.period_id = periodId;

  if (stepId === 2) {
    return {
      period_id: periodId,
      paper_reams: parseFloat(data.paperReams),
      sheets_per_ream: parseInt(data.paperSheetsPerReam)
    };
  }
  if (stepId === 3) {
    return {
      period_id: periodId,
      units_kwh: parseFloat(data.electricityUnits),
      total_cost: parseFloat(data.electricityTotalCost),
      kwh_solar_offset: parseFloat(data.electricitySolarOffset || 0)
    };
  }
  if (stepId === 4) {
    return {
      period_id: periodId,
      units: parseFloat(data.waterUnits),
      price_per_unit: parseFloat(data.waterPricePerUnit)
    };
  }
  if (stepId === 5) {
    return {
      period_id: periodId,
      organic_kg: parseFloat(data.wasteOrganic),
      recyclable_kg: parseFloat(data.wasteRecyclables),
      other_kg: parseFloat(data.wasteOthers)
    };
  }
  if (stepId === 6) {
    return {
      period_id: periodId,
      avg_running_hours: parseFloat(data.generatorHours) || 0,
      fuel_litres: parseFloat(data.generatorFuelLitres) || 0
    };
  }


  return payload;
};

export const saveStepData = async (year, month, stepData, stepId) => {
  try {
    if (stepId === 1) {
      const payload = transformPayload(1, stepData);
      const response = await apiClient.post(stepEndpoints[1], payload);
      return response.data;
    } else {
      // Fetch or Create period from database
      const payload = {
        data_month: getMonthNumber(month),
        data_year: parseInt(year)
      };
      const periodResponse = await apiClient.post(stepEndpoints[1], payload);
      const periodId = periodResponse.data?.period_id;

      const stepPayload = transformPayload(stepId, stepData, periodId);
      const response = await apiClient.post(stepEndpoints[stepId], stepPayload);
      return response.data;
    }
  } catch (error) {
    console.error('Save step data failed:', {
      stepId,
      year,
      month,
      stepData,
      errorMessage: error.message,
      errorResponse: error.response?.data,
      errorStatus: error.response?.status,
      fullError: error
    });
    throw error;
  }
};

export const loadStepData = async (year, month) => {
  try {
    const response = await apiClient.get('reports/dashboard');
    const data = response.data;
    // Find the entry that matches year and month (case-insensitive)
    const entry = data.find(e => {
      if (!e.period) return false;
      const dbYear = String(e.period.year).trim();
      const selYear = String(year).trim();
      const dbMonth = String(e.period.month).trim().toLowerCase();
      const selMonth = String(month).trim().toLowerCase();

      const match = dbYear === selYear && dbMonth === selMonth;
      return match;
    });

    if (!entry) {
      console.log(`[Service] No matching entry found for: [${month}] [${year}]. Checked ${data.length} entries.`);
      return null;
    }

    console.log(`[Service] Found entry for: [${month}] [${year}]`, entry);

    // Map backend response back to Step Data structure
    const mapped = {};

    // Step 1
    if (entry.personnel) {
      mapped.students = entry.personnel.students;
      mapped.employees = entry.personnel.employees;
    }

    // Step 2: Paper
    if (entry.paper) {
      mapped.paperReams = toFormValue(entry.paper.reams);
      mapped.paperSheetsPerReam = entry.paper.sheetsPerReam || '500';
    }

    // Step 3: Electricity
    if (entry.electricity) {
      mapped.electricityUnits = toFormValue(entry.electricity.units);
      mapped.electricityTotalCost = toFormValue(entry.electricity.totalCost);
      mapped.electricitySolarOffset = toFormValue(entry.electricity.kwh_solar_offset);
    }

    // Step 4: Water
    if (entry.water) {
      mapped.waterUnits = toFormValue(entry.water.units);
      mapped.waterPricePerUnit = toFormValue(entry.water.pricePerUnit);
    }

    // Step 5: Waste
    if (entry.waste) {
      mapped.wasteOrganic = toFormValue(entry.waste.organic);
      mapped.wasteRecyclables = toFormValue(entry.waste.recyclables);
      mapped.wasteOthers = toFormValue(entry.waste.others);
    }

    // Step 6: Generator
    if (entry.generator) {
      mapped.generatorHours = toFormValue(entry.generator.avgRunningHours);
      mapped.generatorFuelLitres = toFormValue(entry.generator.fuelLitres);
    }

    // Step 7: Travel


    return mapped;

  } catch (e) {
    console.error("[Service] Critical error in loadStepData:", e);
    return null;
  }
};

/**
 * Robust check if data exists for a given period
 */
export const checkIfEntryExists = async (year, month) => {
  try {
    const response = await apiClient.get('reports/dashboard');
    const data = response.data;

    if (!Array.isArray(data)) {
      console.error("[Service] checkIfEntryExists: Expected array from dashboard, got:", typeof data);
      return false;
    }

    const targetYear = String(year).trim();
    const targetMonth = String(month).trim().toLowerCase();

    const exists = data.some(e => {
      if (!e.period) return false;
      const dbYear = String(e.period.year).trim();
      const dbMonth = String(e.period.month).trim().toLowerCase();
      return dbYear === targetYear && dbMonth === targetMonth;
    });

    console.log(`[Service] Existence check for ${month} ${year}: ${exists}`);
    return exists;
  } catch (error) {
    console.error("[Service] checkIfEntryExists failed:", error);
    return false;
  }
};

export const loadSubmissionStatus = (year, month) => {
  const key = `submission_status_${year}_${month}`;
  const raw = localStorage.getItem(key);
  try {
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const saveSubmissionStatus = (year, month, stepId, submitted) => {
  const key = `submission_status_${year}_${month}`;
  const status = loadSubmissionStatus(year, month);
  status[stepId] = submitted;
  localStorage.setItem(key, JSON.stringify(status));
};

export const areAllStepsCompleted = (year, month, totalSteps = 6) => {
  const status = loadSubmissionStatus(year, month);
  // Basic info (Step 1) is always required and usually considered "done" once we're on the page with month/year
  // But strictly, we check if all steps 1 to totalSteps are true in status
  for (let i = 1; i <= totalSteps; i++) {
    if (!status[i]) return false;
  }
  return true;
};

export const submitCompleteEntry = async (year, month, completeData) => {
  // Data is saved incrementally. This is just a final confirmation hook.

  return Promise.resolve({ success: true });
};

export const getAllSubmittedEntries = async () => {
  // This is used by Admin History potentially, or fallbacks.
  // We redirect to API.
  try {
    const response = await apiClient.get('reports/dashboard');
    return response.data.map(entry => {
      // Map backend response back to the step structure expected by History panel preview
      const mappedData = {
        step1: {
          students: entry.personnel?.students,
          employees: entry.personnel?.employees
        },
        step2: entry.paper ? {
          paperReams: entry.paper.reams,
          paperSheetsPerReam: entry.paper.sheetsPerReam
        } : null,
        step3: entry.electricity ? {
          electricityUnits: toFormValue(entry.electricity.units),
          electricityTotalCost: toFormValue(entry.electricity.totalCost),
          electricitySolarOffset: toFormValue(entry.electricity.kwh_solar_offset)
        } : null,
        step4: entry.water ? {
          waterUnits: toFormValue(entry.water.units),
          waterPricePerUnit: toFormValue(entry.water.pricePerUnit)
        } : null,
        step5: entry.waste ? {
          wasteOrganic: toFormValue(entry.waste.organic),
          wasteRecyclables: toFormValue(entry.waste.recyclables),
          wasteOthers: toFormValue(entry.waste.others)
        } : null,
        step6: entry.generator ? {
          generatorHours: toFormValue(entry.generator.avgRunningHours),
          generatorFuelLitres: toFormValue(entry.generator.fuelLitres)
        } : null
      };

      return {
        year: entry.period.year.toString(),
        month: entry.period.month,
        submittedAt: entry.submittedAt,
        data: mappedData
      };
    });
  } catch (error) {
    console.error("Failed to load all entries", error);
    return [];
  }
};
