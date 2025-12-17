import { useState, useRef, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useUI } from '../../context/UIContext';
import { useNavigate } from 'react-router-dom';
import { getYearOptions, getDefaultYear } from '../../utils/formatters';

export default function DataEntry() {
  const { addToast } = useUI();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    department: '',
    month: '',
    year: getDefaultYear(),
    students: '',
    employees: '',
    paperReams: '',
    paperSheetsPerReam: '500',
    electricityUnits: '',
    electricityPerUnitCost: '',
    waterUnits: '',
    waterPricePerUnit: '',
    wasteOrganic: '',
    wasteRecyclables: '',
    wasteOthers: '',
    generatorAvgHours: '',
    generatorFuelLitres: '',
    businessTravelKms: '',
    businessTravelFuelLitres: '',
  });

  const months = [
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

  const steps = [
    { id: 1, title: 'Basic Info', description: '' },
    { id: 2, title: 'Paper', description: 'Consumption' },
    { id: 3, title: 'Electricity', description: 'Consumption & Cost' },
    { id: 4, title: 'Water', description: 'Consumption Pattern' },
    { id: 5, title: 'Waste', description: 'Generation Pattern' },
    { id: 6, title: 'Generator', description: 'Fuel Usage' },
    { id: 7, title: 'Travel', description: 'Business Travel' },
  ];

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.month || !formData.year || !formData.students || !formData.employees) {
          const missing = [];
          if (!formData.month) missing.push('Month');
          if (!formData.year) missing.push('Year');
          if (!formData.students) missing.push('No. of Students');
          if (!formData.employees) missing.push('No. of Employees');
          addToast(`Incomplete Basic Information: Please fill in ${missing.join(', ')}`, 'error');
          return false;
        }
        return true;
      case 2:
        if (!formData.paperReams || !formData.paperSheetsPerReam) {
          const missing = [];
          if (!formData.paperReams) missing.push('Reams');
          if (!formData.paperSheetsPerReam) missing.push('Sheets per ream');
          addToast(`Incomplete Paper Data: Please fill in ${missing.join(' and ')}`, 'error');
          return false;
        }
        return true;
      case 3:
        if (!formData.electricityUnits || !formData.electricityPerUnitCost) {
          const missing = [];
          if (!formData.electricityUnits) missing.push('Electricity Units');
          if (!formData.electricityPerUnitCost) missing.push('Per Unit Rate');
          addToast(`Incomplete Electricity Data: Please fill in ${missing.join(' and ')}`, 'error');
          return false;
        }
        return true;
      case 4:
        if (!formData.waterUnits || !formData.waterPricePerUnit) {
          const missing = [];
          if (!formData.waterUnits) missing.push('Water Consumption');
          if (!formData.waterPricePerUnit) missing.push('Price per unit');
          addToast(`Incomplete Water Data: Please fill in ${missing.join(' and ')}`, 'error');
          return false;
        }
        return true;
      case 5:
        if (!formData.wasteOrganic || !formData.wasteRecyclables || !formData.wasteOthers) {
          const missing = [];
          if (!formData.wasteOrganic) missing.push('Organic Waste');
          if (!formData.wasteRecyclables) missing.push('Recyclables');
          if (!formData.wasteOthers) missing.push('Others');
          addToast(`Incomplete Waste Data: Please fill in ${missing.join(', ')}`, 'error');
          return false;
        }
        return true;
      case 6:
        if (!formData.generatorAvgHours || !formData.generatorFuelLitres) {
          const missing = [];
          if (!formData.generatorAvgHours) missing.push('Avg. running hours');
          if (!formData.generatorFuelLitres) missing.push('Fuel quantity');
          addToast(`Incomplete Generator Data: Please fill in ${missing.join(' and ')}`, 'error');
          return false;
        }
        return true;
      case 7:
        if (!formData.businessTravelKms || !formData.businessTravelFuelLitres) {
          const missing = [];
          if (!formData.businessTravelKms) missing.push('Business kms');
          if (!formData.businessTravelFuelLitres) missing.push('Fuel litres');
          addToast(`Incomplete Travel Data: Please fill in ${missing.join(' and ')}`, 'error');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  // Reset scroll position on component mount (when navigating to this page)
  useEffect(() => {
    // Ensure page starts at top when component mounts
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Scroll to form when step changes (but not on initial mount)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (formRef.current) {
      const timer = setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId) => {
    // Validate all previous steps before allowing jump
    if (stepId > currentStep) {
      // Trying to go forward - validate current step first
      if (!validateStep(currentStep)) {
        return;
      }
      // Validate all steps between current and target
      for (let i = currentStep + 1; i < stepId; i++) {
        if (!validateStep(i)) {
          addToast(`Please complete step ${i} before jumping to step ${stepId}`, 'error');
          return;
        }
      }
    }
    setCurrentStep(stepId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all steps before submission
    for (let i = 1; i <= steps.length; i++) {
      if (!validateStep(i)) {
        setCurrentStep(i);
        addToast('Please complete all steps before submitting', 'error');
      return;
      }
    }

    // Format and prepare the complete data object
    const submissionData = {
      // Basic Information
      period: {
        month: formData.month,
        year: formData.year,
      },
      personnel: {
        students: parseInt(formData.students) || 0,
        employees: parseInt(formData.employees) || 0,
        total: (parseInt(formData.students) || 0) + (parseInt(formData.employees) || 0),
      },
      
      // Paper Consumption
      paper: {
        reams: parseFloat(formData.paperReams) || 0,
        sheetsPerReam: parseFloat(formData.paperSheetsPerReam) || 500,
        totalSheets: (parseFloat(formData.paperReams) || 0) * (parseFloat(formData.paperSheetsPerReam) || 500),
        perCapitaReams: (() => {
          const reams = parseFloat(formData.paperReams) || 0;
          const totalPeople = (parseInt(formData.students) || 0) + (parseInt(formData.employees) || 0);
          return totalPeople > 0 ? (reams / totalPeople).toFixed(3) : 0;
        })(),
      },
      
      // Electricity Consumption
      electricity: {
        units: parseFloat(formData.electricityUnits) || 0,
        perUnitRate: parseFloat(formData.electricityPerUnitCost) || 0, // Input: Per Unit Rate
        totalCost: (() => {
          // Formula: Units Consumed × Per Unit Rate
          const units = parseFloat(formData.electricityUnits) || 0;
          const ratePerUnit = parseFloat(formData.electricityPerUnitCost) || 0;
          return units * ratePerUnit;
        })(),
        perUnitCost: (() => {
          // Formula: Total Cost ÷ Total Units (includes taxes/fees)
          const units = parseFloat(formData.electricityUnits) || 0;
          const ratePerUnit = parseFloat(formData.electricityPerUnitCost) || 0;
          const totalCost = units * ratePerUnit;
          return units > 0 ? Math.round(totalCost / units) : 0;
        })(),
        perCapitaConsumption: (() => {
          // Formula: Total Units ÷ Total People
          const units = parseFloat(formData.electricityUnits) || 0;
          const totalPeople = (parseInt(formData.students) || 0) + (parseInt(formData.employees) || 0);
          return totalPeople > 0 ? Math.round(units / totalPeople) : 0;
        })(),
      },
      
      // Water Consumption
      water: {
        units: parseFloat(formData.waterUnits) || 0,
        pricePerUnit: parseFloat(formData.waterPricePerUnit) || 0,
        totalCost: (parseFloat(formData.waterUnits) || 0) * (parseFloat(formData.waterPricePerUnit) || 0),
        perCapitaConsumption: (() => {
          const units = parseFloat(formData.waterUnits) || 0;
          const totalPeople = (parseInt(formData.students) || 0) + (parseInt(formData.employees) || 0);
          return totalPeople > 0 ? (units / totalPeople).toFixed(3) : 0;
        })(),
      },
      
      // Waste Generation
      waste: {
        organic: parseFloat(formData.wasteOrganic) || 0,
        recyclables: parseFloat(formData.wasteRecyclables) || 0,
        others: parseFloat(formData.wasteOthers) || 0,
        total: (parseFloat(formData.wasteOrganic) || 0) + (parseFloat(formData.wasteRecyclables) || 0) + (parseFloat(formData.wasteOthers) || 0),
        perCapitaGeneration: (() => {
          const total = (parseFloat(formData.wasteOrganic) || 0) + (parseFloat(formData.wasteRecyclables) || 0) + (parseFloat(formData.wasteOthers) || 0);
          const totalPeople = (parseInt(formData.students) || 0) + (parseInt(formData.employees) || 0);
          return totalPeople > 0 ? (total / totalPeople).toFixed(3) : 0;
        })(),
      },
      
      // Generator Usage
      generator: {
        avgRunningHours: parseFloat(formData.generatorAvgHours) || 0,
        fuelLitres: parseFloat(formData.generatorFuelLitres) || 0,
      },
      
      // Business Travel
      travel: {
        businessKms: parseFloat(formData.businessTravelKms) || 0,
        fuelLitres: parseFloat(formData.businessTravelFuelLitres) || 0,
      },
      
      // Metadata
      submittedAt: new Date().toISOString(),
      submittedBy: 'admin', // This can be replaced with actual user info later
    };

    // Console log the complete data object
    console.log('=====================================');
    console.log('📊 MONTHLY ENVIRONMENTAL DATA ENTRY');
    console.log('=====================================');
    console.log('Complete Submission Data:', submissionData);
    console.log('=====================================');
    console.log('Formatted JSON:', JSON.stringify(submissionData, null, 2));
    console.log('=====================================');

    // Show success message
    addToast('Data prepared successfully! Check console for complete data object.', 'success');
    
    // Optional: Reset form after submission (commented out for testing)
    // Uncomment below when ready to reset after submission
    /*
    setFormData({
      department: '',
      month: '',
      year: getDefaultYear(),
      students: '',
      employees: '',
      paperReams: '',
      paperSheetsPerReam: '500',
      electricityUnits: '',
      electricityPerUnitCost: '',
      waterUnits: '',
      waterPricePerUnit: '',
      wasteOrganic: '',
      wasteRecyclables: '',
      wasteOthers: '',
      generatorAvgHours: '',
      generatorFuelLitres: '',
      businessTravelKms: '',
      businessTravelFuelLitres: '',
    });
    setCurrentStep(1);
    */
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-emerald-800/20 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-white">
              <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">
                Admin Portal
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Monthly Environmental Data Entry
              </h1>
              <p className="text-sm text-emerald-50">
                Enter comprehensive environmental data for the selected month and department
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/admin/dashboard')}
              className="whitespace-nowrap bg-white/90 hover:bg-white text-black font-semibold shadow-md"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Timeline Stepper */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-emerald-100 p-6">
          <div className="relative pb-20">
            {/* Top Row: Circles - Fixed Alignment */}
            <div className="flex items-center justify-between relative py-2 overflow-x-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1 min-w-0 relative">
                  <div className="flex items-center justify-center flex-1 min-w-0 relative z-10 py-2">
                    <button
                      type="button"
                      onClick={() => handleStepClick(step.id)}
                      className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm transition-all duration-300 shrink-0 ${
                        currentStep === step.id
                          ? 'bg-emerald-600 text-white shadow-lg scale-110'
                          : currentStep > step.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {currentStep > step.id ? '✓' : step.id}
                    </button>
                  </div>
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div 
                      className={`absolute left-1/2 top-1/2 h-0.5 -translate-y-1/2 z-0 ${
                        currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                      style={{
                        width: `calc(100% - 48px)`,
                        marginLeft: '24px'
                      }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            {/* Bottom Row: Labels - Fixed Position Below Circles */}
            <div className="flex items-start justify-between absolute top-20 left-0 right-0 overflow-x-auto">
              {steps.map((step) => (
                <div key={step.id} className="flex-1 min-w-0 px-1 text-center">
                  <p className={`text-xs font-semibold ${
                    currentStep === step.id ? 'text-emerald-600' : 'text-slate-600'
                  }`}>
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                      {step.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          {currentStep === 1 && (
          <>
          <Card className="bg-white border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">
                Basic Information
              </h3>
                  <p className="text-sm text-emerald-100 mt-0.5">Period and personnel details</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Month <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.month}
                    onChange={(e) =>
                      setFormData({ ...formData, month: e.target.value })
                    }
                    options={[
                      { label: 'Select Month', value: '' },
                      ...months.map((month) => ({
                        label: month,
                        value: month,
                      })),
                    ]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    options={getYearOptions()}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    No. of Students <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.students}
                    onChange={(e) =>
                      setFormData({ ...formData, students: e.target.value })
                    }
                    placeholder="Enter number of students"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    No. of Employees <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.employees}
                    onChange={(e) =>
                      setFormData({ ...formData, employees: e.target.value })
                    }
                    placeholder="Enter number of employees"
                    required
                    min="0"
                  />
                </div>
              </div>
            </div>
          </Card>
          
          {/* Navigation for Step 1 */}
          <div className="flex gap-4 mt-6">
            {currentStep < steps.length && (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all"
              >
                Next: {steps[1].title} →
              </Button>
            )}
          </div>
          </>
          )}

          {/* Paper Consumption Section */}
          {currentStep === 2 && (
          <>
          <Card className="bg-white border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">
                Paper Consumption (70gsm)
              </h3>
                  <p className="text-sm text-emerald-100 mt-0.5">Track paper usage and consumption patterns</p>
            </div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Reams <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.paperReams}
                    onChange={(e) =>
                      setFormData({ ...formData, paperReams: e.target.value })
                    }
                    placeholder="Enter number of reams"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sheets per ream <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.paperSheetsPerReam}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paperSheetsPerReam: e.target.value,
                      })
                    }
                    placeholder="Default: 500"
                    required
                    min="0"
                  />
                </div>
              </div>
              
              {/* Calculated Values */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border-2 border-emerald-200/60 shadow-md">
                <h4 className="text-sm font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Calculated Metrics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-emerald-200 shadow-sm">
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      Total Sheets
                    </label>
                    <div className="text-xl font-bold text-emerald-600">
                      {(() => {
                        const reams = parseFloat(formData.paperReams) || 0;
                        const sheetsPerReam = parseFloat(formData.paperSheetsPerReam) || 500;
                        return (reams * sheetsPerReam).toLocaleString();
                      })()}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-emerald-200 shadow-sm">
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      Per Capita Ream Consumption
                    </label>
                    <div className="text-xl font-bold text-emerald-600">
                      {(() => {
                        const reams = parseFloat(formData.paperReams) || 0;
                        const students = parseFloat(formData.students) || 0;
                        const employees = parseFloat(formData.employees) || 0;
                        const totalPeople = students + employees;
                        if (reams > 0 && totalPeople > 0) {
                          return (reams / totalPeople).toFixed(3);
                        }
                        return '0.000';
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Navigation for Step 2 */}
          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              onClick={handlePrevious}
              variant="secondary"
              className="px-6 py-3.5 border-2 border-slate-300 hover:border-slate-400 font-medium"
            >
              ← Previous
            </Button>
            {currentStep < steps.length && (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all"
              >
                Next: {steps[2].title} →
              </Button>
            )}
          </div>
          </>
          )}

          {/* Electricity Consumption Section */}
          {currentStep === 3 && (
          <>
          <Card className="bg-white border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">
                    Consumption Pattern of Electricity
              </h3>
                  <p className="text-sm text-emerald-100 mt-0.5">Record electricity consumption and costs</p>
            </div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Unit Consumption of Electricity (KWH) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.electricityUnits}
                  onChange={(e) =>
                    setFormData({ ...formData, electricityUnits: e.target.value })
                  }
                  placeholder="Enter electricity consumption in kWh"
                  required
                  min="0"
                  step="0.01"
                />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Per Unit Rate (PKR/KWH) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.electricityPerUnitCost}
                    onChange={(e) =>
                      setFormData({ ...formData, electricityPerUnitCost: e.target.value })
                    }
                    placeholder="Enter rate per unit in PKR"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              {/* Calculated Values Display */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border-2 border-emerald-200/60 shadow-md">
                <h4 className="text-sm font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Calculated Metrics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-emerald-200 shadow-sm">
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      Per Capita Consumption
                    </label>
                    <div className="text-lg font-bold text-emerald-600">
                      {(() => {
                        // Formula: Total Units ÷ Total People
                        const units = parseFloat(formData.electricityUnits) || 0;
                        const students = parseFloat(formData.students) || 0;
                        const employees = parseFloat(formData.employees) || 0;
                        const totalPeople = students + employees;
                        if (units > 0 && totalPeople > 0) {
                          return Math.round(units / totalPeople);
                        }
                        return '0';
                      })()} <span className="text-xs font-normal text-slate-500">KWH/person</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-emerald-200 shadow-sm">
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      Per Unit Cost
                    </label>
                    <div className="text-lg font-bold text-emerald-600">
                      {(() => {
                        // Formula: Total Cost ÷ Total Units
                        const units = parseFloat(formData.electricityUnits) || 0;
                        const ratePerUnit = parseFloat(formData.electricityPerUnitCost) || 0;
                        const totalCost = units * ratePerUnit;
                        if (units > 0 && totalCost > 0) {
                          return Math.round(totalCost / units);
                        }
                        return '0';
                      })()} <span className="text-xs font-normal text-slate-500">PKR/KWH</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-emerald-200 shadow-sm">
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      Cost of Electricity
                    </label>
                    <div className="text-lg font-bold text-emerald-600">
                      {(() => {
                        // Formula: Units Consumed × Per Unit Rate
                        const units = parseFloat(formData.electricityUnits) || 0;
                        const ratePerUnit = parseFloat(formData.electricityPerUnitCost) || 0;
                        if (units > 0 && ratePerUnit > 0) {
                          return (units * ratePerUnit).toLocaleString('en-PK', { maximumFractionDigits: 0 });
                        }
                        return '0';
                      })()} <span className="text-xs font-normal text-slate-500">PKR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Navigation for Step 3 */}
          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              onClick={handlePrevious}
              variant="secondary"
              className="px-6 py-3.5 border-2 border-slate-300 hover:border-slate-400 font-medium"
            >
              ← Previous
            </Button>
            {currentStep < steps.length && (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all"
              >
                Next: {steps[3].title} →
              </Button>
            )}
          </div>
          </>
          )}

          {/* Water Consumption Section */}
          {currentStep === 4 && (
          <>
          <Card className="bg-white border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">
                Water Consumption Pattern
              </h3>
                  <p className="text-sm text-emerald-100 mt-0.5">Monitor water usage and pricing information</p>
            </div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Unit consumption of water (m³ or litres){' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.waterUnits}
                    onChange={(e) =>
                      setFormData({ ...formData, waterUnits: e.target.value })
                    }
                    placeholder="Enter water consumption"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price / unit (Rs.) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.waterPricePerUnit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        waterPricePerUnit: e.target.value,
                      })
                    }
                    placeholder="Enter price per unit in Rs."
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              {/* Calculated Values */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border-2 border-emerald-200/60 shadow-md">
                <h4 className="text-sm font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Calculated Metrics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-emerald-200 shadow-sm">
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      Per Capita Water Consumption
                    </label>
                    <div className="text-lg font-bold text-emerald-600">
                      {(() => {
                        const units = parseFloat(formData.waterUnits) || 0;
                        const students = parseFloat(formData.students) || 0;
                        const employees = parseFloat(formData.employees) || 0;
                        const totalPeople = students + employees;
                        if (units > 0 && totalPeople > 0) {
                          return (units / totalPeople).toFixed(3);
                        }
                        return '0.000';
                      })()} <span className="text-xs font-normal text-slate-500">m³/person</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-emerald-200 shadow-sm">
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      Total Water Cost (PKR)
                    </label>
                    <div className="text-lg font-bold text-emerald-600">
                      {(() => {
                        const units = parseFloat(formData.waterUnits) || 0;
                        const pricePerUnit = parseFloat(formData.waterPricePerUnit) || 0;
                        if (units > 0 && pricePerUnit > 0) {
                          return (units * pricePerUnit).toLocaleString('en-PK', { maximumFractionDigits: 0 });
                        }
                        return '0';
                      })()} <span className="text-xs font-normal text-slate-500">PKR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Navigation for Step 4 */}
          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              onClick={handlePrevious}
              variant="secondary"
              className="px-6 py-3.5 border-2 border-slate-300 hover:border-slate-400 font-medium"
            >
              ← Previous
            </Button>
            {currentStep < steps.length && (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all"
              >
                Next: {steps[4].title} →
              </Button>
            )}
          </div>
          </>
          )}

          {/* Waste Generation Section */}
          {currentStep === 5 && (
          <>
          <Card className="bg-white border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">5</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">
                Waste Generation Pattern (kg)
              </h3>
                  <p className="text-sm text-emerald-100 mt-0.5">Categorize waste by type: Organic, Recyclables, and Others</p>
            </div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Organic (kg) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.wasteOrganic}
                    onChange={(e) =>
                      setFormData({ ...formData, wasteOrganic: e.target.value })
                    }
                    placeholder="Enter organic waste in kg"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Recyclables (kg) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.wasteRecyclables}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        wasteRecyclables: e.target.value,
                      })
                    }
                    placeholder="Enter recyclable waste in kg"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Others (kg) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.wasteOthers}
                    onChange={(e) =>
                      setFormData({ ...formData, wasteOthers: e.target.value })
                    }
                    placeholder="Enter other waste in kg"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              {/* Calculated Values */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border-2 border-emerald-200/60 shadow-md">
                <h4 className="text-sm font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Calculated Metrics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-emerald-200 shadow-sm">
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      Total Waste Produced (kg)
                    </label>
                    <div className="text-lg font-bold text-emerald-600">
                      {(() => {
                        const organic = parseFloat(formData.wasteOrganic) || 0;
                        const recyclables = parseFloat(formData.wasteRecyclables) || 0;
                        const others = parseFloat(formData.wasteOthers) || 0;
                        return (organic + recyclables + others).toLocaleString('en-PK', { maximumFractionDigits: 2 });
                      })()} <span className="text-xs font-normal text-slate-500">kg</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-emerald-200 shadow-sm">
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      Per Capita Waste Produced
                    </label>
                    <div className="text-lg font-bold text-emerald-600">
                      {(() => {
                        const organic = parseFloat(formData.wasteOrganic) || 0;
                        const recyclables = parseFloat(formData.wasteRecyclables) || 0;
                        const others = parseFloat(formData.wasteOthers) || 0;
                        const totalWaste = organic + recyclables + others;
                        const students = parseFloat(formData.students) || 0;
                        const employees = parseFloat(formData.employees) || 0;
                        const totalPeople = students + employees;
                        if (totalWaste > 0 && totalPeople > 0) {
                          return (totalWaste / totalPeople).toFixed(3);
                        }
                        return '0.000';
                      })()} <span className="text-xs font-normal text-slate-500">kg/person</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Navigation for Step 5 */}
          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              onClick={handlePrevious}
              variant="secondary"
              className="px-6 py-3.5 border-2 border-slate-300 hover:border-slate-400 font-medium"
            >
              ← Previous
            </Button>
            {currentStep < steps.length && (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all"
              >
                Next: {steps[5].title} →
              </Button>
            )}
          </div>
          </>
          )}

          {/* Generator Fuel Usage Section */}
          {currentStep === 6 && (
          <>
          <Card className="bg-white border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">6</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">
                Generator Fuel Usage
              </h3>
                  <p className="text-sm text-emerald-100 mt-0.5">Track generator operation hours and fuel consumption</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Avg. running hours <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.generatorAvgHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        generatorAvgHours: e.target.value,
                      })
                    }
                    placeholder="Enter average running hours"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fuel quantity (litres) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.generatorFuelLitres}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        generatorFuelLitres: e.target.value,
                      })
                    }
                    placeholder="Enter fuel quantity in litres"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </Card>
          
          {/* Navigation for Step 6 */}
          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              onClick={handlePrevious}
              variant="secondary"
              className="px-6 py-3.5 border-2 border-slate-300 hover:border-slate-400 font-medium"
            >
              ← Previous
            </Button>
            {currentStep < steps.length && (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all"
              >
                Next: {steps[6].title} →
              </Button>
            )}
          </div>
          </>
          )}

          {/* Business Travel Section */}
          {currentStep === 7 && (
          <>
          <Card className="bg-white border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">7</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">
                Business Travel km Usage
              </h3>
                  <p className="text-sm text-emerald-100 mt-0.5">Record business travel distance and fuel consumption</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business kms <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.businessTravelKms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        businessTravelKms: e.target.value,
                      })
                    }
                    placeholder="Enter business travel distance in kms"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fuel litres <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.businessTravelFuelLitres}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        businessTravelFuelLitres: e.target.value,
                      })
                    }
                    placeholder="Enter fuel consumption in litres"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Navigation for Step 7 (Final Step) */}
          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              onClick={handlePrevious}
              variant="secondary"
              className="px-6 py-3.5 border-2 border-slate-300 hover:border-slate-400 font-medium"
            >
              ← Previous
            </Button>
              <Button
                type="submit"
              className="flex-1 w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all"
              >
              ✓ Submit Monthly Data
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-3.5 border-2 border-slate-300 hover:border-slate-400 font-medium"
              >
                Cancel
              </Button>
            </div>
          </>
          )}
        </form>
      </div>
    </div>
  );
}
