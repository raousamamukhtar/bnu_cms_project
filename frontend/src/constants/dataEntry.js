export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const DATA_ENTRY_TABS = [
  { id: 'basic', title: 'Basic Info', stepId: 1 },
  { id: 'paper', title: 'Paper', stepId: 2 },
  { id: 'electricity', title: 'Electricity', stepId: 3 },
  { id: 'water', title: 'Water', stepId: 4 },
  { id: 'waste', title: 'Waste', stepId: 5 },
  { id: 'generator', title: 'Generator', stepId: 6 },
  { id: 'travel', title: 'Travel', stepId: 7 },
];

export const DEFAULT_PAPER_SHEETS_PER_REAM = 500;

export const STEP_FIELD_MAPPINGS = {
  1: {
    fields: ['month', 'year', 'students', 'employees'],
    required: true,
  },
  2: {
    fields: ['paperReams', 'paperSheetsPerReam'],
    required: false,
  },
  3: {
    fields: ['electricityUnits', 'electricityTotalCost'],
    required: false,
  },
  4: {
    fields: ['waterUnits', 'waterPricePerUnit'],
    required: false,
  },
  5: {
    fields: ['wasteOrganic', 'wasteRecyclables', 'wasteOthers'],
    required: false,
  },
  6: {
    fields: ['generatorAvgHours', 'generatorFuelLitres'],
    required: false,
  },
  7: {
    fields: ['businessTravelKms', 'businessTravelFuelLitres'],
    required: false,
  },
};

export const FIELD_LABELS = {
  month: 'Month',
  year: 'Year',
  students: 'No. of Students',
  employees: 'No. of Employees',
  paperReams: 'Reams',
  paperSheetsPerReam: 'Sheets per ream',
  electricityUnits: 'Electricity Units',
  electricityTotalCost: 'Cost of Electricity',
  waterUnits: 'Water Consumption',
  waterPricePerUnit: 'Price per unit',
  wasteOrganic: 'Organic Waste',
  wasteRecyclables: 'Recyclables',
  wasteOthers: 'Others',
  generatorAvgHours: 'Avg. running hours',
  generatorFuelLitres: 'Fuel quantity',
  businessTravelKms: 'Business kms',
  businessTravelFuelLitres: 'Fuel litres',
};

