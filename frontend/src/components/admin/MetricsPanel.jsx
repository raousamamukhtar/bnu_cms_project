import { useState } from 'react';
import { formatCompactNumber, formatCurrency } from '../../utils/numberFormatting';
import BulletGraph from './BulletGraph';

const calculateCarbonImpact = (metrics) => {
  if (!metrics.electricity && !metrics.generator && !metrics.travel) {
    return null;
  }

  const electricityCO2 = metrics.electricity
    ? (metrics.electricity.units * 0.5) / 1000
    : 0;
  const generatorCO2 = metrics.generator
    ? (metrics.generator.fuelLitres * 2.31) / 1000
    : 0;
  const travelCO2 = metrics.travel
    ? (metrics.travel.fuelLitres * 2.31) / 1000
    : 0;

  return electricityCO2 + generatorCO2 + travelCO2;
};

const MetricSection = ({ title, children, isPrimary = false }) => {
  return (
    <section
      className={`space-y-3 pb-4 ${isPrimary ? '' : 'border-b border-slate-200 dark:border-slate-700 last:border-0'
        }`}
      aria-labelledby={title.toLowerCase().replace(/\s+/g, '-')}
    >
      <h3
        id={title.toLowerCase().replace(/\s+/g, '-')}
        className={`text-xs font-semibold uppercase tracking-wider ${isPrimary
          ? 'text-slate-900 dark:text-slate-100 text-sm'
          : 'text-slate-600 dark:text-slate-400'
          }`}
      >
        {title}
      </h3>
      {children}
    </section>
  );
};

const MetricRow = ({ label, value, unit = '', highlight = false, ariaLabel }) => {
  return (
    <div
      className="flex justify-between items-baseline py-1"
      role="text"
      aria-label={ariaLabel || `${label}: ${value} ${unit}`}
    >
      <span className="text-xs text-slate-600 dark:text-slate-400">{label}</span>
      <span
        className={`text-xs tabular-nums ${highlight
          ? 'font-semibold text-slate-900 dark:text-slate-100'
          : 'font-medium text-slate-700 dark:text-slate-300'
          }`}
      >
        {value} {unit}
      </span>
    </div>
  );
};

export function MetricsPanel({ metrics, period }) {
  const [expandedSections, setExpandedSections] = useState({
    carbon: true,
    resources: false,
    waste: false,
    operations: false,
  });

  const hasAnyData =
    metrics.personnel.total > 0 ||
    metrics.paper ||
    metrics.electricity ||
    metrics.water ||
    metrics.waste ||
    metrics.generator ||
    metrics.travel;

  if (!hasAnyData) {
    return null;
  }

  const carbonImpact = calculateCarbonImpact(metrics);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
      role="region"
      aria-label="Sustainability metrics overview"
    >
      <div className="p-5">
        <header className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Metrics Overview
          </h2>
          {period?.month && period?.year && (
            <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wide">
              {period.month} {period.year}
            </p>
          )}
        </header>

        <div className="space-y-5">
          {carbonImpact !== null && (
            <MetricSection title="Net Carbon Impact" isPrimary>
              <div className="space-y-3">
                <div className="py-2">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      Total CO₂ Equivalent
                    </span>
                    <span className="text-lg font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatCompactNumber(carbonImpact)} tCO₂e
                    </span>
                  </div>
                  <BulletGraph
                    value={carbonImpact}
                    target={10}
                    max={20}
                    label="Carbon Footprint"
                    unit="tCO₂e"
                    ariaLabel={`Carbon footprint: ${formatCompactNumber(carbonImpact)} tonnes CO₂ equivalent`}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-500 dark:text-slate-500 block">Electricity</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatCompactNumber(
                        metrics.electricity ? (metrics.electricity.units * 0.5) / 1000 : 0
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-500 block">Generator</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatCompactNumber(
                        metrics.generator ? (metrics.generator.fuelLitres * 2.31) / 1000 : 0
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-500 block">Travel</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatCompactNumber(
                        metrics.travel ? (metrics.travel.fuelLitres * 2.31) / 1000 : 0
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </MetricSection>
          )}

          {metrics.personnel.total > 0 && (
            <MetricSection title="Personnel">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <MetricRow
                    label="Students"
                    value={metrics.personnel.students.toLocaleString()}
                    ariaLabel={`Students: ${metrics.personnel.students}`}
                  />
                </div>
                <div>
                  <MetricRow
                    label="Employees"
                    value={metrics.personnel.employees.toLocaleString()}
                    ariaLabel={`Employees: ${metrics.personnel.employees}`}
                  />
                </div>
                <div>
                  <MetricRow
                    label="Total"
                    value={metrics.personnel.total.toLocaleString()}
                    highlight
                    ariaLabel={`Total personnel: ${metrics.personnel.total}`}
                  />
                </div>
              </div>
            </MetricSection>
          )}

          <button
            onClick={() => toggleSection('resources')}
            className="w-full text-left"
            aria-expanded={expandedSections.resources}
            aria-controls="resources-section"
          >
            <MetricSection title="Resource Consumption">
              {expandedSections.resources ? (
                <div id="resources-section" className="space-y-4 pt-2">
                  {metrics.paper && (
                    <div className="space-y-2">
                      <MetricRow
                        label="Paper Reams"
                        value={formatCompactNumber(metrics.paper.reams)}
                        ariaLabel={`Paper consumption: ${formatCompactNumber(metrics.paper.reams)} reams`}
                      />
                      <MetricRow
                        label="Total Sheets"
                        value={formatCompactNumber(metrics.paper.totalSheets)}
                        ariaLabel={`Total paper sheets: ${formatCompactNumber(metrics.paper.totalSheets)}`}
                      />
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <BulletGraph
                          value={parseFloat(metrics.paper.perCapitaReams)}
                          target={2.0}
                          max={3.0}
                          label="Per Capita"
                          unit="reams/person"
                          ariaLabel={`Paper per capita: ${metrics.paper.perCapitaReams} reams per person`}
                        />
                      </div>
                    </div>
                  )}

                  {metrics.electricity && (
                    <div className="space-y-2">
                      <MetricRow
                        label="Units"
                        value={formatCompactNumber(metrics.electricity.units)}
                        unit="kWh"
                        ariaLabel={`Electricity consumption: ${formatCompactNumber(metrics.electricity.units)} kilowatt hours`}
                      />
                      <MetricRow
                        label="Total Cost"
                        value={formatCurrency(metrics.electricity.totalCost)}
                        ariaLabel={`Electricity cost: ${formatCurrency(metrics.electricity.totalCost)}`}
                      />
                      <MetricRow
                        label="Rate"
                        value={`PKR ${metrics.electricity.perUnitRate.toLocaleString()}`}
                        unit="/kWh"
                        ariaLabel={`Electricity rate: ${metrics.electricity.perUnitRate} PKR per kilowatt hour`}
                      />
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <BulletGraph
                          value={metrics.electricity.perCapitaConsumption}
                          target={200}
                          max={300}
                          label="Per Capita"
                          unit="kWh/person"
                          ariaLabel={`Electricity per capita: ${metrics.electricity.perCapitaConsumption} kilowatt hours per person`}
                        />
                      </div>
                    </div>
                  )}

                  {metrics.water && (
                    <div className="space-y-2">
                      <MetricRow
                        label="Units"
                        value={formatCompactNumber(metrics.water.units)}
                        unit="m³"
                        ariaLabel={`Water consumption: ${formatCompactNumber(metrics.water.units)} cubic meters`}
                      />
                      <MetricRow
                        label="Price/Unit"
                        value={`PKR ${metrics.water.pricePerUnit.toLocaleString()}`}
                        ariaLabel={`Water price per unit: ${metrics.water.pricePerUnit} PKR`}
                      />
                      <MetricRow
                        label="Total Cost"
                        value={formatCurrency(parseFloat(metrics.water.totalCost))}
                        ariaLabel={`Water cost: ${formatCurrency(parseFloat(metrics.water.totalCost))}`}
                      />
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <BulletGraph
                          value={parseFloat(metrics.water.perCapitaConsumption)}
                          target={2000}
                          max={3000}
                          label="Per Capita"
                          unit="m³/person"
                          ariaLabel={`Water per capita: ${metrics.water.perCapitaConsumption} cubic meters per person`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-500 dark:text-slate-500 pt-1">
                  Click to expand
                </div>
              )}
            </MetricSection>
          </button>

          {metrics.waste && (
            <button
              onClick={() => toggleSection('waste')}
              className="w-full text-left"
              aria-expanded={expandedSections.waste}
              aria-controls="waste-section"
            >
              <MetricSection title="Waste Generation">
                {expandedSections.waste ? (
                  <div id="waste-section" className="space-y-3 pt-2">
                    <div className="grid grid-cols-3 gap-3">
                      <MetricRow
                        label="Organic"
                        value={formatCompactNumber(metrics.waste.organic)}
                        unit="kg"
                        ariaLabel={`Organic waste: ${formatCompactNumber(metrics.waste.organic)} kilograms`}
                      />
                      <MetricRow
                        label="Recyclables"
                        value={formatCompactNumber(metrics.waste.recyclables)}
                        unit="kg"
                        ariaLabel={`Recyclable waste: ${formatCompactNumber(metrics.waste.recyclables)} kilograms`}
                      />
                      <MetricRow
                        label="Others"
                        value={formatCompactNumber(metrics.waste.others)}
                        unit="kg"
                        ariaLabel={`Other waste: ${formatCompactNumber(metrics.waste.others)} kilograms`}
                      />
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <MetricRow
                        label="Total"
                        value={formatCompactNumber(parseFloat(metrics.waste.total))}
                        unit="kg"
                        highlight
                        ariaLabel={`Total waste: ${formatCompactNumber(parseFloat(metrics.waste.total))} kilograms`}
                      />
                      <div className="mt-2">
                        <BulletGraph
                          value={parseFloat(metrics.waste.perCapitaGeneration)}
                          target={5.0}
                          max={8.0}
                          label="Per Capita"
                          unit="kg/person"
                          ariaLabel={`Waste per capita: ${metrics.waste.perCapitaGeneration} kilograms per person`}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 dark:text-slate-500 pt-1">
                    Click to expand
                  </div>
                )}
              </MetricSection>
            </button>
          )}

          {(metrics.generator || metrics.travel) && (
            <button
              onClick={() => toggleSection('operations')}
              className="w-full text-left"
              aria-expanded={expandedSections.operations}
              aria-controls="operations-section"
            >
              <MetricSection title="Operations">
                {expandedSections.operations ? (
                  <div id="operations-section" className="space-y-3 pt-2">
                    {metrics.generator && (
                      <div className="space-y-2">
                        <MetricRow
                          label="Total Hours"
                          value={formatCompactNumber(metrics.generator.avgRunningHours)}
                          ariaLabel={`Generator total hours: ${formatCompactNumber(metrics.generator.avgRunningHours)}`}
                        />
                        <MetricRow
                          label="Fuel Consumption"
                          value={formatCompactNumber(metrics.generator.fuelLitres)}
                          unit="L"
                          ariaLabel={`Generator fuel consumption: ${formatCompactNumber(metrics.generator.fuelLitres)} litres`}
                        />
                      </div>
                    )}
                    {metrics.travel && (
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <MetricRow
                          label="Business Distance"
                          value={formatCompactNumber(metrics.travel.businessKms)}
                          unit="km"
                          ariaLabel={`Business travel distance: ${formatCompactNumber(metrics.travel.businessKms)} kilometers`}
                        />
                        <MetricRow
                          label="Fuel Consumption"
                          value={formatCompactNumber(metrics.travel.fuelLitres)}
                          unit="L"
                          ariaLabel={`Travel fuel consumption: ${formatCompactNumber(metrics.travel.fuelLitres)} litres`}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 dark:text-slate-500 pt-1">
                    Click to expand
                  </div>
                )}
              </MetricSection>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
