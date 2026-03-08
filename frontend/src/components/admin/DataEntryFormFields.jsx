import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { MONTHS, DATA_ENTRY_TABS } from '../../constants/dataEntry';
import { getYearOptions } from '../../utils/formatters';

export const renderTabContent = (currentTab, formData, onFieldChange, onPeriodChange, allStepsCompleted, isEditMode, isLocked) => {
  const fieldProps = {
    formData,
    onFieldChange,
    isEditMode,
    disabled: isLocked,
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
    default:
      return null;
  }
};

const BasicInfoFields = ({ formData, onFieldChange, onPeriodChange, allStepsCompleted, isEditMode, disabled }) => {
  console.log("[UI Render] BasicInfoFields:", { month: formData.month, year: formData.year, disabled });
  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    onFieldChange('month', newMonth);
  };

  const handleYearChange = (e) => {
    const newYear = e.target.value;
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
            disabled={false}
          />
          <Select
            label="Year"
            value={formData.year}
            onChange={handleYearChange}
            options={getYearOptions()}
            required
            disabled={false}
          />
          <Input
            label="Number of Students"
            type="number"
            value={formData.students}
            onChange={(e) => onFieldChange('students', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            label="Number of Employees"
            type="number"
            value={formData.employees}
            onChange={(e) => onFieldChange('employees', e.target.value)}
            required
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

const PaperFields = ({ formData, onFieldChange, disabled }) => {
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
            required
            disabled={disabled}
          />
          <Input
            label="Sheets per Ream"
            type="number"
            value={formData.paperSheetsPerReam}
            onChange={(e) => onFieldChange('paperSheetsPerReam', e.target.value)}
            required
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

const ElectricityFields = ({ formData, onFieldChange, disabled }) => {
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
            required
            disabled={disabled}
          />
          <Input
            label="Total Cost of Electricity"
            type="number"
            step="0.01"
            value={formData.electricityTotalCost}
            onChange={(e) => onFieldChange('electricityTotalCost', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            label="Solar Offset (kWh)"
            type="number"
            step="0.01"
            value={formData.electricitySolarOffset}
            onChange={(e) => onFieldChange('electricitySolarOffset', e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

const WaterFields = ({ formData, onFieldChange, disabled }) => {
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
            required
            disabled={disabled}
          />
          <Input
            label="Price per Unit"
            type="number"
            step="0.01"
            value={formData.waterPricePerUnit}
            onChange={(e) => onFieldChange('waterPricePerUnit', e.target.value)}
            required
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

const WasteFields = ({ formData, onFieldChange, disabled }) => {
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
            required
            disabled={disabled}
          />
          <Input
            label="Recyclables (kg)"
            type="number"
            step="0.01"
            value={formData.wasteRecyclables}
            onChange={(e) => onFieldChange('wasteRecyclables', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            label="Others (kg)"
            type="number"
            step="0.01"
            value={formData.wasteOthers}
            onChange={(e) => onFieldChange('wasteOthers', e.target.value)}
            required
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

const GeneratorFields = ({ formData, onFieldChange, disabled }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
          Generator Usage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Hours"
            type="number"
            step="0.01"
            value={formData.generatorHours}
            onChange={(e) => onFieldChange('generatorHours', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            label="Fuel (Litres)"
            type="number"
            step="0.01"
            value={formData.generatorFuelLitres}
            onChange={(e) => onFieldChange('generatorFuelLitres', e.target.value)}
            required
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};



