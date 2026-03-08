import { DEFAULT_PAPER_SHEETS_PER_REAM } from '../constants/dataEntry';

const parseNumber = (value, defaultValue = 0) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

const parseIntValue = (value, defaultValue = 0) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

const calculateTotalPeople = (formData) => {
  return parseIntValue(formData.students) + parseIntValue(formData.employees);
};

const calculatePerCapita = (total, people) => {
  return people > 0 ? (total / people).toFixed(3) : 0;
};

export const prepareStepSubmissionData = (stepId, formData) => {
  const totalPeople = calculateTotalPeople(formData);

  switch (stepId) {
    case 1:
      return {
        period: {
          month: formData.month,
          year: formData.year,
        },
        personnel: {
          students: parseIntValue(formData.students),
          employees: parseIntValue(formData.employees),
          total: totalPeople,
        },
      };

    case 2: {
      const reams = parseNumber(formData.paperReams);
      const sheetsPerReam = parseNumber(formData.paperSheetsPerReam, DEFAULT_PAPER_SHEETS_PER_REAM);
      return {
        paper: {
          reams,
          sheetsPerReam,
          totalSheets: reams * sheetsPerReam,
          perCapitaReams: calculatePerCapita(reams, totalPeople),
        },
      };
    }

    case 3: {
      const units = parseNumber(formData.electricityUnits);
      const totalCost = parseNumber(formData.electricityTotalCost);
      const perUnitRate = units > 0 ? Math.round(totalCost / units) : 0;
      return {
        electricity: {
          units,
          totalCost,
          perUnitRate,
          perUnitCost: perUnitRate,
          perCapitaConsumption: totalPeople > 0 ? Math.round(units / totalPeople) : 0,
        },
      };
    }

    case 4: {
      const units = parseNumber(formData.waterUnits);
      const pricePerUnit = parseNumber(formData.waterPricePerUnit);
      return {
        water: {
          units,
          pricePerUnit,
          totalCost: units * pricePerUnit,
          perCapitaConsumption: calculatePerCapita(units, totalPeople),
        },
      };
    }

    case 5: {
      const organic = parseNumber(formData.wasteOrganic);
      const recyclables = parseNumber(formData.wasteRecyclables);
      const others = parseNumber(formData.wasteOthers);
      const total = organic + recyclables + others;
      return {
        waste: {
          organic,
          recyclables,
          others,
          total,
          perCapitaGeneration: calculatePerCapita(total, totalPeople),
        },
      };
    }

    case 6:
      return {
        generator: {
          avgRunningHours: parseNumber(formData.generatorHours),
          fuelLitres: parseNumber(formData.generatorFuelLitres),
        },
      };



    default:
      return {};
  }
};

export const prepareStepData = (stepId, formData) => {
  const stepConfig = {
    1: ['month', 'year', 'students', 'employees'],
    2: ['paperReams', 'paperSheetsPerReam'],
    3: ['electricityUnits', 'electricityTotalCost', 'electricitySolarOffset'],
    4: ['waterUnits', 'waterPricePerUnit'],
    5: ['wasteOrganic', 'wasteRecyclables', 'wasteOthers'],
    6: ['generatorHours', 'generatorFuelLitres'],
  };

  const fields = stepConfig[stepId] || [];
  const stepData = {};

  fields.forEach((field) => {
    if (formData[field] !== undefined) {
      stepData[field] = formData[field];
    }
  });

  return stepData;
};

export const prepareCompleteSubmissionData = (formData, savedData) => {
  const totalPeople = calculateTotalPeople(formData);

  const completeData = {
    period: {
      month: formData.month,
      year: formData.year,
    },
    personnel: {
      students: parseIntValue(formData.students),
      employees: parseIntValue(formData.employees),
      total: totalPeople,
    },
  };

  if (savedData.step2) {
    const reams = parseNumber(savedData.step2.paperReams);
    const sheetsPerReam = parseNumber(savedData.step2.paperSheetsPerReam, DEFAULT_PAPER_SHEETS_PER_REAM);
    completeData.paper = {
      reams,
      sheetsPerReam,
      totalSheets: reams * sheetsPerReam,
      perCapitaReams: calculatePerCapita(reams, totalPeople),
    };
  }

  if (savedData.step3) {
    const units = parseNumber(savedData.step3.electricityUnits);
    const totalCost = parseNumber(savedData.step3.electricityTotalCost);
    const perUnitRate = units > 0 ? Math.round(totalCost / units) : 0;
    completeData.electricity = {
      units,
      totalCost,
      perUnitRate,
      perUnitCost: perUnitRate,
      perCapitaConsumption: totalPeople > 0 ? Math.round(units / totalPeople) : 0,
    };
  }

  if (savedData.step4) {
    const units = parseNumber(savedData.step4.waterUnits);
    const pricePerUnit = parseNumber(savedData.step4.waterPricePerUnit);
    completeData.water = {
      units,
      pricePerUnit,
      totalCost: units * pricePerUnit,
      perCapitaConsumption: calculatePerCapita(units, totalPeople),
    };
  }

  if (savedData.step5) {
    const organic = parseNumber(savedData.step5.wasteOrganic);
    const recyclables = parseNumber(savedData.step5.wasteRecyclables);
    const others = parseNumber(savedData.step5.wasteOthers);
    const total = organic + recyclables + others;
    completeData.waste = {
      organic,
      recyclables,
      others,
      total,
      perCapitaGeneration: calculatePerCapita(total, totalPeople),
    };
  }

  if (savedData.step6) {
    completeData.generator = {
      avgRunningHours: parseNumber(savedData.step6.generatorHours),
      fuelLitres: parseNumber(savedData.step6.generatorFuelLitres),
    };
  }



  return completeData;
};

