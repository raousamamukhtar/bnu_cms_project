const departments = [
  'HR',
  'Admin',
  'Library',
  'Finance',
  'Transport',
  'IT',
  'Maintenance',
  'Academic Departments',
];

const departmentBaselines = {
  HR: { paper: 210, electricity: 820, water: 410, travel: 140, wasteFuel: 70 },
  Admin: { paper: 260, electricity: 960, water: 520, travel: 180, wasteFuel: 90 },
  Library: {
    paper: 340,
    electricity: 730,
    water: 360,
    travel: 90,
    wasteFuel: 60,
  },
  Finance: {
    paper: 180,
    electricity: 840,
    water: 420,
    travel: 120,
    wasteFuel: 80,
  },
  Transport: {
    paper: 90,
    electricity: 650,
    water: 320,
    travel: 410,
    wasteFuel: 260,
  },
  IT: { paper: 120, electricity: 910, water: 380, travel: 220, wasteFuel: 110 },
  Maintenance: {
    paper: 150,
    electricity: 980,
    water: 610,
    travel: 260,
    wasteFuel: 140,
  },
  'Academic Departments': {
    paper: 620,
    electricity: 1520,
    water: 880,
    travel: 360,
    wasteFuel: 200,
  },
};

const years = [2023, 2024, 2025];
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const randomize = (value, monthIndex, yearIndex) =>
  Math.round(value * (0.88 + monthIndex * 0.01 + yearIndex * 0.04));

export const departmentMonthlyData = departments.flatMap((department, dIdx) => {
  const base = departmentBaselines[department];
  return years.flatMap((year, yIdx) =>
    months.map((month, mIdx) => ({
      id: `${department}-${year}-${month}`,
      department,
      year,
      month,
      paper: randomize(base.paper + dIdx * 6, mIdx, yIdx),
      electricity: randomize(base.electricity + dIdx * 12, mIdx, yIdx),
      water: randomize(base.water + dIdx * 8, mIdx, yIdx),
      travel: randomize(base.travel + dIdx * 5, mIdx, yIdx),
      wasteFuel: randomize(base.wasteFuel + dIdx * 4, mIdx, yIdx),
    })),
  );
});

export const monthlyKpiData = years.flatMap((year, yIdx) =>
  months.map((month, mIdx) => ({
    id: `${year}-${month}`,
    year,
    month,
    paper: randomize(2200 + yIdx * 60, mIdx, yIdx),
    electricity: randomize(8200 + yIdx * 180, mIdx, yIdx),
    water: randomize(4200 + yIdx * 140, mIdx, yIdx),
    travel: randomize(2100 + yIdx * 100, mIdx, yIdx),
    wasteFuel: randomize(1100 + yIdx * 80, mIdx, yIdx),
  })),
);

export const departmentComparison = departments.map((department, idx) => ({
  department,
  efficiencyScore: 70 + idx * 3,
  renewableUsage: 40 + idx * 4,
  emissions: 180 - idx * 8,
  paperReduction: 15 + idx * 2,
}));

export const submissionLogs = [
  {
    id: 'sub-001',
    department: 'HR',
    coordinator: 'Sara Malik',
    month: 'October 2025',
    metrics: { paper: 210, electricity: 820, water: 430, travel: 160, wasteFuel: 75 },
    status: 'approved',
    submittedAt: '2025-10-04T10:15:00Z',
  },
  {
    id: 'sub-002',
    department: 'Finance',
    coordinator: 'Hasan Ali',
    month: 'October 2025',
    metrics: { paper: 190, electricity: 870, water: 460, travel: 140, wasteFuel: 82 },
    status: 'pending',
    submittedAt: '2025-10-05T09:20:00Z',
  },
  {
    id: 'sub-003',
    department: 'Transport',
    coordinator: 'Kiran Aftab',
    month: 'September 2025',
    metrics: { paper: 110, electricity: 660, water: 330, travel: 390, wasteFuel: 250 },
    status: 'approved',
    submittedAt: '2025-09-21T16:45:00Z',
  },
];

export const auditLogs = [
  {
    id: 'audit-001',
    user: 'Admin Farah',
    role: 'Admin',
    action: 'Created coordinator account for Hasan Ali',
    timestamp: '2025-10-05T08:30:00Z',
  },
  {
    id: 'audit-002',
    user: 'Admin Farah',
    role: 'Admin',
    action: 'Updated Transport department baseline',
    timestamp: '2025-10-01T11:18:00Z',
  },
  {
    id: 'audit-003',
    user: 'Cell Lead Imran',
    role: 'Sustainability Cell',
    action: 'Generated Q3 comparison report',
    timestamp: '2025-09-28T13:05:00Z',
  },
];

export const users = [
  {
    id: 'user-001',
    name: 'Admin Farah',
    role: 'admin',
    email: 'farah@sdms.edu',
  },
  {
    id: 'user-002',
    name: 'Hasan Ali',
    role: 'coordinator',
    email: 'hasan@sdms.edu',
    department: 'Finance',
  },
  {
    id: 'user-003',
    name: 'Sara Malik',
    role: 'coordinator',
    email: 'sara@sdms.edu',
    department: 'HR',
  },
  {
    id: 'user-004',
    name: 'Imran Saeed',
    role: 'cell',
    email: 'imran@sdms.edu',
  },
  {
    id: 'user-005',
    name: 'Dr. Nadia Awan',
    role: 'management',
    email: 'nadia@sdms.edu',
  },
  {
    id: 'user-006',
    name: 'Ahmed Khan',
    role: 'coordinator',
    email: 'ahmed@sdms.edu',
    department: 'Admin',
  },
  {
    id: 'user-007',
    name: 'Fatima Sheikh',
    role: 'coordinator',
    email: 'fatima@sdms.edu',
    department: 'Library',
  },
  {
    id: 'user-008',
    name: 'Kiran Aftab',
    role: 'coordinator',
    email: 'kiran@sdms.edu',
    department: 'Transport',
  },
  {
    id: 'user-009',
    name: 'Zain Malik',
    role: 'coordinator',
    email: 'zain@sdms.edu',
    department: 'IT',
  },
  {
    id: 'user-010',
    name: 'Bilal Hassan',
    role: 'coordinator',
    email: 'bilal@sdms.edu',
    department: 'Maintenance',
  },
  {
    id: 'user-011',
    name: 'Ayesha Raza',
    role: 'coordinator',
    email: 'ayesha@sdms.edu',
    department: 'Academic Departments',
  },
  {
    id: 'user-012',
    name: 'HR Manager',
    role: 'hr',
    email: 'hr@sdms.edu',
  },
];

export const departmentRanking = departments.map((department, idx) => ({
  department,
  consumptionScore: 82 - idx * 3,
  yoyImprovement: 4 + idx,
  renewableShare: 25 + idx * 3,
}));

export const reportsCatalog = [
  {
    id: 'rpt-001',
    title: 'Quarterly Sustainability Overview',
    description: 'High-level summary for leadership review.',
    format: 'PDF',
    lastGenerated: '2025-10-02',
  },
  {
    id: 'rpt-002',
    title: 'Departmental Consumption Comparison',
    description: 'Heatmaps and ranking across departments.',
    format: 'Excel',
    lastGenerated: '2025-09-29',
  },
  {
    id: 'rpt-003',
    title: 'Multi-year Emission Trends',
    description: 'Detailed analytics for sustainability cell.',
    format: 'PDF',
    lastGenerated: '2025-09-20',
  },
];

export const trendHighlights = [
  {
    title: 'Paper usage down',
    value: '12%',
    status: 'positive',
    detail: 'vs last academic year',
  },
  {
    title: 'Electricity stable',
    value: '1.5%',
    status: 'neutral',
    detail: 'vs previous quarter',
  },
  {
    title: 'Travel emissions up',
    value: '4.1%',
    status: 'negative',
    detail: 'requires mitigation',
  },
];

export const kpiTargets = [
  { kpi: 'Paper', target: 2000, current: 2140 },
  { kpi: 'Electricity', target: 8000, current: 8320 },
  { kpi: 'Water', target: 4100, current: 4220 },
  { kpi: 'Travel', target: 2000, current: 2180 },
];

export const impactInitiatives = [
  {
    id: 'init-001',
    title: 'Green Commuter Program',
    department: 'Transport',
    status: 'In Progress',
    impact: 'High',
  },
  {
    id: 'init-002',
    title: 'Paperless Finance Workflows',
    department: 'Finance',
    status: 'Pilot',
    impact: 'Medium',
  },
  {
    id: 'init-003',
    title: 'Rooftop Solar Expansion',
    department: 'Maintenance',
    status: 'Planning',
    impact: 'High',
  },
];

// Monthly admin entered data for management dashboard
// This matches the exact structure from DataEntry.jsx submission
export const monthlyAdminData = [
  {
    period: { month: 'January', year: '2025' },
    personnel: { students: 200, employees: 20, total: 220 },
    paper: { reams: 380, sheetsPerReam: 500, totalSheets: 190000, perCapitaReams: '1.727' },
    electricity: { units: 38500, perUnitRate: 425, totalCost: 16362500, perUnitCost: 425, perCapitaConsumption: 175 },
    water: { units: 385000, pricePerUnit: 40, totalCost: 15400000, perCapitaConsumption: '1750.000' },
    waste: { organic: 280, recyclables: 380, others: 290, total: 950, perCapitaGeneration: '4.318' },
    generator: { avgRunningHours: 21000, fuelLitres: 31000 },
    travel: { businessKms: 380, fuelLitres: 200 },
    submittedAt: '2025-01-20T20:14:30.360Z',
    submittedBy: 'admin',
  },
  {
    period: { month: 'February', year: '2025' },
    personnel: { students: 213, employees: 23, total: 236 },
    paper: { reams: 423, sheetsPerReam: 500, totalSheets: 211500, perCapitaReams: '1.792' },
    electricity: { units: 43243, perUnitRate: 432, totalCost: 18680976, perUnitCost: 432, perCapitaConsumption: 183 },
    water: { units: 432342, pricePerUnit: 42, totalCost: 18158364, perCapitaConsumption: '1831.958' },
    waste: { organic: 324, recyclables: 423, others: 342, total: 1089, perCapitaGeneration: '4.614' },
    generator: { avgRunningHours: 23342, fuelLitres: 34234 },
    travel: { businessKms: 432, fuelLitres: 234 },
    submittedAt: '2025-02-20T20:14:30.360Z',
    submittedBy: 'admin',
  },
  {
    period: { month: 'March', year: '2025' },
    personnel: { students: 220, employees: 25, total: 245 },
    paper: { reams: 450, sheetsPerReam: 500, totalSheets: 225000, perCapitaReams: '1.837' },
    electricity: { units: 45000, perUnitRate: 440, totalCost: 19800000, perUnitCost: 440, perCapitaConsumption: 184 },
    water: { units: 450000, pricePerUnit: 43, totalCost: 19350000, perCapitaConsumption: '1836.735' },
    waste: { organic: 350, recyclables: 450, others: 380, total: 1180, perCapitaGeneration: '4.816' },
    generator: { avgRunningHours: 24500, fuelLitres: 36000 },
    travel: { businessKms: 480, fuelLitres: 260 },
    submittedAt: '2025-03-20T20:14:30.360Z',
    submittedBy: 'admin',
  },
  {
    period: { month: 'April', year: '2025' },
    personnel: { students: 225, employees: 26, total: 251 },
    paper: { reams: 470, sheetsPerReam: 500, totalSheets: 235000, perCapitaReams: '1.873' },
    electricity: { units: 47000, perUnitRate: 445, totalCost: 20915000, perUnitCost: 445, perCapitaConsumption: 187 },
    water: { units: 470000, pricePerUnit: 44, totalCost: 20680000, perCapitaConsumption: '1872.510' },
    waste: { organic: 370, recyclables: 480, others: 400, total: 1250, perCapitaGeneration: '4.980' },
    generator: { avgRunningHours: 25500, fuelLitres: 37500 },
    travel: { businessKms: 500, fuelLitres: 280 },
    submittedAt: '2025-04-20T20:14:30.360Z',
    submittedBy: 'admin',
  },
  {
    period: { month: 'May', year: '2025' },
    personnel: { students: 230, employees: 28, total: 258 },
    paper: { reams: 490, sheetsPerReam: 500, totalSheets: 245000, perCapitaReams: '1.899' },
    electricity: { units: 49000, perUnitRate: 450, totalCost: 22050000, perUnitCost: 450, perCapitaConsumption: 190 },
    water: { units: 490000, pricePerUnit: 45, totalCost: 22050000, perCapitaConsumption: '1899.225' },
    waste: { organic: 390, recyclables: 500, others: 420, total: 1310, perCapitaGeneration: '5.078' },
    generator: { avgRunningHours: 26500, fuelLitres: 39000 },
    travel: { businessKms: 520, fuelLitres: 300 },
    submittedAt: '2025-05-20T20:14:30.360Z',
    submittedBy: 'admin',
  },
  {
    period: { month: 'June', year: '2025' },
    personnel: { students: 235, employees: 30, total: 265 },
    paper: { reams: 510, sheetsPerReam: 500, totalSheets: 255000, perCapitaReams: '1.925' },
    electricity: { units: 51000, perUnitRate: 455, totalCost: 23205000, perUnitCost: 455, perCapitaConsumption: 192 },
    water: { units: 510000, pricePerUnit: 46, totalCost: 23460000, perCapitaConsumption: '1924.528' },
    waste: { organic: 410, recyclables: 520, others: 440, total: 1370, perCapitaGeneration: '5.170' },
    generator: { avgRunningHours: 27500, fuelLitres: 40500 },
    travel: { businessKms: 540, fuelLitres: 320 },
    submittedAt: '2025-06-20T20:14:30.360Z',
    submittedBy: 'admin',
  },
  {
    period: { month: 'July', year: '2025' },
    personnel: { students: 240, employees: 32, total: 272 },
    paper: { reams: 530, sheetsPerReam: 500, totalSheets: 265000, perCapitaReams: '1.949' },
    electricity: { units: 53000, perUnitRate: 460, totalCost: 24380000, perUnitCost: 460, perCapitaConsumption: 195 },
    water: { units: 530000, pricePerUnit: 47, totalCost: 24910000, perCapitaConsumption: '1948.529' },
    waste: { organic: 430, recyclables: 540, others: 460, total: 1430, perCapitaGeneration: '5.257' },
    generator: { avgRunningHours: 28500, fuelLitres: 42000 },
    travel: { businessKms: 560, fuelLitres: 340 },
    submittedAt: '2025-07-20T20:14:30.360Z',
    submittedBy: 'admin',
  },
  {
    period: { month: 'August', year: '2025' },
    personnel: { students: 245, employees: 34, total: 279 },
    paper: { reams: 550, sheetsPerReam: 500, totalSheets: 275000, perCapitaReams: '1.971' },
    electricity: { units: 55000, perUnitRate: 465, totalCost: 25575000, perUnitCost: 465, perCapitaConsumption: 197 },
    water: { units: 550000, pricePerUnit: 48, totalCost: 26400000, perCapitaConsumption: '1971.326' },
    waste: { organic: 450, recyclables: 560, others: 480, total: 1490, perCapitaGeneration: '5.341' },
    generator: { avgRunningHours: 29500, fuelLitres: 43500 },
    travel: { businessKms: 580, fuelLitres: 360 },
    submittedAt: '2025-08-20T20:14:30.360Z',
    submittedBy: 'admin',
  },
  {
    period: { month: 'September', year: '2025' },
    personnel: { students: 250, employees: 36, total: 286 },
    paper: { reams: 570, sheetsPerReam: 500, totalSheets: 285000, perCapitaReams: '1.993' },
    electricity: { units: 57000, perUnitRate: 470, totalCost: 26790000, perUnitCost: 470, perCapitaConsumption: 199 },
    water: { units: 570000, pricePerUnit: 49, totalCost: 27930000, perCapitaConsumption: '1993.007' },
    waste: { organic: 470, recyclables: 580, others: 500, total: 1550, perCapitaGeneration: '5.420' },
    generator: { avgRunningHours: 30500, fuelLitres: 45000 },
    travel: { businessKms: 600, fuelLitres: 380 },
    submittedAt: '2025-09-20T20:14:30.360Z',
    submittedBy: 'admin',
  },
  {
    period: { month: 'October', year: '2025' },
    personnel: { students: 255, employees: 38, total: 293 },
    paper: { reams: 590, sheetsPerReam: 500, totalSheets: 295000, perCapitaReams: '2.014' },
    electricity: { units: 59000, perUnitRate: 475, totalCost: 28025000, perUnitCost: 475, perCapitaConsumption: 201 },
    water: { units: 590000, pricePerUnit: 50, totalCost: 29500000, perCapitaConsumption: '2013.652' },
    waste: { organic: 490, recyclables: 600, others: 520, total: 1610, perCapitaGeneration: '5.495' },
    generator: { avgRunningHours: 31500, fuelLitres: 46500 },
    travel: { businessKms: 620, fuelLitres: 400 },
    submittedAt: '2025-10-20T20:14:30.360Z',
    submittedBy: 'admin',
  },
  {
    period: { month: 'November', year: '2025' },
    personnel: { students: 260, employees: 40, total: 300 },
    paper: { reams: 610, sheetsPerReam: 500, totalSheets: 305000, perCapitaReams: '2.033' },
    electricity: { units: 61000, perUnitRate: 480, totalCost: 29280000, perUnitCost: 480, perCapitaConsumption: 203 },
    water: { units: 610000, pricePerUnit: 51, totalCost: 31110000, perCapitaConsumption: '2033.333' },
    waste: { organic: 510, recyclables: 620, others: 540, total: 1670, perCapitaGeneration: '5.567' },
    generator: { avgRunningHours: 32500, fuelLitres: 48000 },
    travel: { businessKms: 640, fuelLitres: 420 },
    submittedAt: '2025-11-20T20:14:30.360Z',
    submittedBy: 'admin',
  },
  {
    period: { month: 'December', year: '2025' },
    personnel: { students: 265, employees: 42, total: 307 },
    paper: { reams: 630, sheetsPerReam: 500, totalSheets: 315000, perCapitaReams: '2.052' },
    electricity: { units: 63000, perUnitRate: 485, totalCost: 30555000, perUnitCost: 485, perCapitaConsumption: 205 },
    water: { units: 630000, pricePerUnit: 52, totalCost: 32760000, perCapitaConsumption: '2052.117' },
    waste: { organic: 530, recyclables: 640, others: 560, total: 1730, perCapitaGeneration: '5.638' },
    generator: { avgRunningHours: 33500, fuelLitres: 49500 },
    travel: { businessKms: 660, fuelLitres: 440 },
    submittedAt: '2025-12-20T20:14:30.360Z',
    submittedBy: 'admin',
  },
];

export { departments };



