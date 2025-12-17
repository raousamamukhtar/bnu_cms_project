import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username required'),
  password: z.string().min(1, 'Password required'),
  role: z.enum(['admin', 'coordinator', 'management', 'hr', 'marketing'], {
    errorMap: () => ({ message: 'Select a valid role' }),
  }),
});

const positiveNumber = (label) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine((val) => {
      const trimmed = val.trim();
      if (!trimmed) return false;
      const num = Number(trimmed);
      return !Number.isNaN(num) && num >= 0;
    }, `${label} must be a valid number (≥ 0)`);

export const coordinatorEntrySchema = z.object({
  month: z.string().min(1, 'Select a month'),
  year: z
    .string()
    .min(1, 'Year required')
    .regex(/^\d{4}$/, 'Year must be 4 digits'),
  
  // Default fields
  students: positiveNumber('No. of Students'),
  employees: positiveNumber('No. of Employees'),

  // Paper
  paperReams: positiveNumber('Reams'),
  paperSheetsPerReam: positiveNumber('Sheets per ream'),

  // Electricity
  electricityUnits: positiveNumber('Units'),

  // Water
  waterVolume: positiveNumber('Water volume'),
  waterPricePerUnit: positiveNumber('Water price'),

  // Waste
  wasteOrganic: positiveNumber('Organic waste'),
  wasteRecyclables: positiveNumber('Recyclables'),
  wasteOthers: positiveNumber('Other waste'),

  // Generator
  generatorHours: positiveNumber('Generator hours'),
  generatorFuelLitres: positiveNumber('Fuel litres'),

  // Travel
  businessKms: positiveNumber('Business kms'),
  businessFuelLitres: positiveNumber('Business fuel'),

  // Carbon
  carbonFootprint: positiveNumber('Carbon footprint'),
});


