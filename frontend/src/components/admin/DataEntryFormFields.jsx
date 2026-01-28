import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { MONTHS, DATA_ENTRY_TABS } from '../../constants/dataEntry';
import { getYearOptions } from '../../utils/formatters';

const BasicInfoFields = ({ formData, onFieldChange, onPeriodChange, allStepsCompleted }) => {
  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    if (formData.month && formData.year && !allStepsCompleted) {
      onPeriodChange?.('Please complete all tabs for the current month before changing the period');
      return;
    }
    onFieldChange('month', newMonth);
  };

  const handleYearChange = (e) => {
    const newYear = e.target.value;
    if (formData.month && formData.year && !allStepsCompleted) {
      onPeriodChange?.('Please complete all tabs for the current month before changing the period');
      return;
    }
    onFieldChange('year', newYear);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Month"
            value={formData.month}
            onChange={handleMonthChange}
            options={[
              { label: 'Select Month', value: '' },
              ...MONTHS.map((month) => ({ label: month, value: month })),
            ]}
            required
            disabled={formData.month && formData.year && !allStepsCompleted}
          />
          <Select
            label="Year"
            value={formData.year}
            onChange={handleYearChange}
            options={getYearOptions()}
            required
            disabled={formData.month && formData.year && !allStepsCompleted}
          />
          <Input
            label="Number of Students"
            type="number"
            value={formData.students}
            onChange={(e) => onFieldChange('students', e.target.value)}
            required
          />
          <Input
            label="Number of Employees"
            type="number"
            value={formData.employees}
            onChange={(e) => onFieldChange('employees', e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
};

const PaperFields = ({ formData, onFieldChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
          Paper Consumption
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Paper Reams"
            type="number"
            step="0.01"
            value={formData.paperReams}
            onChange={(e) => onFieldChange('paperReams', e.target.value)}
          />
          <Input
            label="Sheets per Ream"
            type="number"
            value={formData.paperSheetsPerReam}
            onChange={(e) => onFieldChange('paperSheetsPerReam', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

const ElectricityFields = ({ formData, onFieldChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
          Electricity Consumption
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Electricity Units (kWh)"
            type="number"
            step="0.01"
            value={formData.electricityUnits}
            onChange={(e) => onFieldChange('electricityUnits', e.target.value)}
          />
          <Input
            label="Total Cost of Electricity"
            type="number"
            step="0.01"
            value={formData.electricityTotalCost}
            onChange={(e) => onFieldChange('electricityTotalCost', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

const WaterFields = ({ formData, onFieldChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
          Water Consumption
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Water Consumption (Units)"
            type="number"
            step="0.01"
            value={formData.waterUnits}
            onChange={(e) => onFieldChange('waterUnits', e.target.value)}
          />
          <Input
            label="Price per Unit"
            type="number"
            step="0.01"
            value={formData.waterPricePerUnit}
            onChange={(e) => onFieldChange('waterPricePerUnit', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

const WasteFields = ({ formData, onFieldChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
          Waste Generation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Organic Waste (kg)"
            type="number"
            step="0.01"
            value={formData.wasteOrganic}
            onChange={(e) => onFieldChange('wasteOrganic', e.target.value)}
          />
          <Input
            label="Recyclables (kg)"
            type="number"
            step="0.01"
            value={formData.wasteRecyclables}
            onChange={(e) => onFieldChange('wasteRecyclables', e.target.value)}
          />
          <Input
            label="Others (kg)"
            type="number"
            step="0.01"
            value={formData.wasteOthers}
            onChange={(e) => onFieldChange('wasteOthers', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

const GeneratorFields = ({ formData, onFieldChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
          Generator Usage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Average Running Hours"
            type="number"
            step="0.01"
            value={formData.generatorAvgHours}
            onChange={(e) => onFieldChange('generatorAvgHours', e.target.value)}
          />
          <Input
            label="Fuel Quantity (Litres)"
            type="number"
            step="0.01"
            value={formData.generatorFuelLitres}
            onChange={(e) => onFieldChange('generatorFuelLitres', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

const TravelFields = ({ formData, onFieldChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
          Business Travel
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Business Travel (km)"
            type="number"
            step="0.01"
            value={formData.businessTravelKms}
            onChange={(e) => onFieldChange('businessTravelKms', e.target.value)}
          />
          <Input
            label="Fuel Consumption (Litres)"
            type="number"
            step="0.01"
            value={formData.businessTravelFuelLitres}
            onChange={(e) => onFieldChange('businessTravelFuelLitres', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export const renderTabContent = (currentTab, formData, onFieldChange, onPeriodChange, allStepsCompleted) => {
  const fieldProps = {
    formData,
    onFieldChange,
  };

  switch (currentTab) {
    case 'basic':
      return (
        <BasicInfoFields
          {...fieldProps}
          onPeriodChange={onPeriodChange}
          allStepsCompleted={allStepsCompleted}
        />
      );
    case 'paper':
      return <PaperFields {...fieldProps} />;
    case 'electricity':
      return <ElectricityFields {...fieldProps} />;
    case 'water':
      return <WaterFields {...fieldProps} />;
    case 'waste':
      return <WasteFields {...fieldProps} />;
    case 'generator':
      return <GeneratorFields {...fieldProps} />;
    case 'travel':
      return <TravelFields {...fieldProps} />;
    default:
      return null;
  }
};

