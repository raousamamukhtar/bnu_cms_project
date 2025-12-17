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

export { departments };



