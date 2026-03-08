import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';

// --- Formatters ---
const formatCurrency = (value) => `PKR ${value ? value.toLocaleString() : '0'}`;
const formatNumber = (value) => value ? value.toLocaleString() : '0';

// Colors for PDF
const COLORS = {
    emerald: [40, 116, 88], // #287458
    slate600: [71, 85, 105],
    slate500: [100, 116, 139],
    slate100: [241, 245, 249],
    headerFill: [16, 185, 129], // Emerald-500
};

// Colors for Excel Styling (Light & Professional Slate Palette)
const EXCEL_STYLES = {
    header: {
        fill: { fgColor: { rgb: "F8FAFC" } }, // Slate-50
        font: { color: { rgb: "334155" }, bold: true, sz: 10 },
        alignment: { vertical: "center", horizontal: "center", wrapText: true },
        border: {
            top: { style: "thin", color: { rgb: "CBD5E1" } },
            bottom: { style: "medium", color: { rgb: "64748B" } },
            left: { style: "thin", color: { rgb: "CBD5E1" } },
            right: { style: "thin", color: { rgb: "CBD5E1" } }
        }
    },
    totalRow: {
        fill: { fgColor: { rgb: "F1F5F9" } }, // Slate-100
        font: { bold: true, color: { rgb: "1E293B" }, sz: 10 },
        alignment: { vertical: "center" },
        border: {
            top: { style: "medium", color: { rgb: "94A3B8" } },
            bottom: { style: "thin", color: { rgb: "CBD5E1" } }
        }
    },
    dataCell: {
        alignment: { vertical: "center", horizontal: "left" },
        font: { sz: 10, color: { rgb: "475569" } },
        border: {
            bottom: { style: "thin", color: { rgb: "F1F5F9" } }
        }
    },
    numberCell: {
        alignment: { vertical: "center", horizontal: "right" },
        font: { sz: 10, color: { rgb: "475569" } },
        border: {
            bottom: { style: "thin", color: { rgb: "F1F5F9" } }
        }
    },
    title: {
        font: { bold: true, sz: 14, color: { rgb: "0F172A" } },
        alignment: { horizontal: "center" }
    },
    subTitle: {
        font: { italic: true, sz: 10, color: { rgb: "64748B" } },
        alignment: { horizontal: "center" }
    }
};

const monthOrder = {
    'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6,
    'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12
};

// --- PDF Generators ---

const addCoverPage = (doc, title, periodLabel) => {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    doc.setFillColor(240, 253, 244);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    doc.setFontSize(32);
    doc.setTextColor(...COLORS.emerald);
    doc.text('Sustainability Dashboard', pageWidth / 2, 80, { align: 'center' });
    doc.setFontSize(24);
    doc.setTextColor(...COLORS.slate600);
    doc.text(title, pageWidth / 2, 100, { align: 'center' });
    doc.setFontSize(16);
    doc.setTextColor(...COLORS.slate500);
    doc.text(periodLabel, pageWidth / 2, 115, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Beaconhouse National University', pageWidth / 2, 200, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 210, { align: 'center' });
    doc.addPage();
};

const addExecutiveSummary = (doc, data, type) => {
    doc.setFontSize(18);
    doc.setTextColor(...COLORS.emerald);
    doc.text('Executive Summary', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.slate600);
    const summaryText = type === 'monthly'
        ? `This report details the sustainability metrics for ${data.period?.month} ${data.period?.year}. Key highlights include a total electricity consumption of ${formatNumber(data.electricity?.units)} kWh, water usage of ${formatNumber(data.water?.units)} m³, and waste generation of ${formatNumber(data.waste?.total)} kg.`
        : `This annual summary for ${data.period?.year} provides an aggregated view of environmental impact. Total paper consumption stood at ${formatNumber(data.paper?.reams)} reams, electricity usage totaled ${formatNumber(data.electricity?.units)} kWh, and total waste generation reached ${formatNumber(data.waste?.total)} kg.`;
    doc.text(doc.splitTextToSize(summaryText, 180), 14, 30);
};

const getMonthlyTableData = (data) => {
    const head = [['Category', 'Metric', 'Value', 'Unit']];
    const body = [];
    const addSection = (title, rows) => {
        body.push([{ content: title, rowSpan: rows.length, styles: { valign: 'middle', fontStyle: 'bold', fillColor: [240, 253, 244] } }, ...rows[0]]);
        for (let i = 1; i < rows.length; i++) body.push(rows[i]);
    };
    addSection('Personnel', [['Students', formatNumber(data.personnel?.students), 'Count'], ['Employees', formatNumber(data.personnel?.employees), 'Count']]);
    addSection('Paper', [['Reams Consumed', formatNumber(data.paper?.reams), 'Reams'], ['Total Sheets', formatNumber(data.paper?.totalSheets), 'Sheets'], ['Per Capita', data.paper?.perCapitaReams || '0', 'Reams/Person']]);
    addSection('Electricity', [['Consumption', formatNumber(data.electricity?.units), 'kWh'], ['Total Cost', formatCurrency(data.electricity?.totalCost), 'PKR'], ['Cost Per Unit', formatCurrency(data.electricity?.perUnitRate), 'PKR/kWh'], ['Per Capita', `${data.electricity?.perCapitaConsumption || 0}`, 'kWh/Person']]);
    addSection('Water', [['Consumption', formatNumber(data.water?.units), 'm³'], ['Total Cost', formatCurrency(data.water?.totalCost), 'PKR'], ['Price Per Unit', formatCurrency(data.water?.pricePerUnit), 'PKR/m³'], ['Per Capita', `${data.water?.perCapitaConsumption || 0}`, 'm³/Person']]);
    addSection('Waste', [['Organic', formatNumber(data.waste?.organic), 'kg'], ['Recyclables', formatNumber(data.waste?.recyclables), 'kg'], ['Others', formatNumber(data.waste?.others), 'kg'], ['Total Waste', formatNumber(data.waste?.total), 'kg'], ['Per Capita', data.waste?.perCapitaGeneration || '0', 'kg/Person']]);
    addSection('Generator', [['Total Hours', formatNumber(data.generator?.avgRunningHours), 'Hours'], ['Fuel Consumed', formatNumber(data.generator?.fuelLitres), 'Litres']]);
    return { head, body };
};

const getYearlyTableData = (data) => {
    const head = [['Metric Category', 'Total Consumption', 'Financial / Impact']];
    const body = [
        ['Personnel (Avg)', `${formatNumber(data.personnel?.total)} People`, '-'],
        ['Paper', `${formatNumber(data.paper?.reams)} Reams`, `${formatNumber(data.paper?.totalSheets)} Sheets`],
        ['Electricity', `${formatNumber(data.electricity?.units)} kWh`, formatCurrency(data.electricity?.totalCost)],
        ['Water', `${formatNumber(data.water?.units)} m³`, formatCurrency(data.water?.totalCost)],
        ['Waste', `${formatNumber(data.waste?.total)} kg`, `Recycled: ${formatNumber(data.waste?.recyclables)} kg`],
        ['Generator', `${formatNumber(data.generator?.avgRunningHours)} Hours`, `${formatNumber(data.generator?.fuelLitres)} Fuel`],
    ];
    return { head, body };
};

export const generatePDF = (data, title, type = 'monthly', chartImages = []) => {
    const doc = new jsPDF();
    const periodLabel = type === 'monthly' ? `${data.period?.month} ${data.period?.year}` : `Year: ${data.period?.year}`;
    addCoverPage(doc, title, periodLabel);
    addExecutiveSummary(doc, data, type);
    const { head, body } = type === 'monthly' ? getMonthlyTableData(data) : getYearlyTableData(data);
    autoTable(doc, {
        startY: 45, head, body, theme: 'grid',
        headStyles: { fillColor: COLORS.headerFill, textColor: 255 },
        styles: { fontSize: 10, cellPadding: 4, lineColor: [226, 232, 240], lineWidth: 0.1 },
        alternateRowStyles: { fillColor: COLORS.slate100 },
        columnStyles: { 2: { halign: 'right' }, 3: { halign: 'center' } }
    });
    if (chartImages?.length > 0) {
        let finalY = doc.lastAutoTable.finalY + 15 || 60;
        doc.addPage(); finalY = 20;
        doc.setFontSize(14); doc.setTextColor(...COLORS.emerald);
        doc.text('Visual Analysis', 14, finalY); finalY += 10;
        for (let i = 0; i < chartImages.length; i++) {
            const imgData = chartImages[i];
            const imgProps = doc.getImageProperties(imgData);
            let pdfWidth = doc.internal.pageSize.width - 28;
            let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            if (pdfHeight > 120) { pdfHeight = 120; pdfWidth = (imgProps.width * pdfHeight) / imgProps.height; }
            if (finalY + pdfHeight > doc.internal.pageSize.height - 20) { doc.addPage(); finalY = 20; }
            doc.addImage(imgData, 'PNG', (doc.internal.pageSize.width - pdfWidth) / 2, finalY, pdfWidth, pdfHeight);
            finalY += pdfHeight + 10;
        }
    }
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 2; i <= pageCount; i++) {
        doc.setPage(i); doc.setFontSize(8); doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount} - BNU Sustainability Report`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }
    doc.save(`BNU_${title.replace(/\s+/g, '_')}.pdf`);
};

export const generateExcel = (data, title, type = 'monthly', monthlyBreakdown = []) => {
    const wb = XLSX.utils.book_new();

    // Summary Sheet
    const summaryRows = [
        [{ v: 'BNU SUSTAINABILITY DASHBOARD', s: EXCEL_STYLES.title }],
        [{ v: title, s: EXCEL_STYLES.subTitle }],
        [{ v: `Generated: ${new Date().toLocaleString()}`, s: EXCEL_STYLES.cell }],
        [],
        [{ v: 'Executive Summary', s: { font: { bold: true, sz: 14 } } }],
        [
            { v: 'Metric Category', s: EXCEL_STYLES.header },
            { v: 'Key Measurement', s: EXCEL_STYLES.header }
        ],
        [{ v: 'Total Personnel', s: EXCEL_STYLES.dataCell }, { v: type === 'monthly' ? (data.personnel?.students + data.personnel?.employees) : data.personnel?.total, s: EXCEL_STYLES.numberCell }],
        [{ v: 'Electricity Consumption (kWh)', s: EXCEL_STYLES.dataCell }, { v: data.electricity?.units || 0, s: EXCEL_STYLES.numberCell }],
        [{ v: 'Total Electricity Cost (PKR)', s: EXCEL_STYLES.dataCell }, { v: data.electricity?.totalCost || 0, s: EXCEL_STYLES.numberCell }],
        [{ v: 'Water Consumption (m³)', s: EXCEL_STYLES.dataCell }, { v: data.water?.units || 0, s: EXCEL_STYLES.numberCell }],
        [{ v: 'Total Waste Generation (kg)', s: EXCEL_STYLES.dataCell }, { v: data.waste?.total || 0, s: EXCEL_STYLES.numberCell }],
        [{ v: 'Carbon Footprint (tCO₂e)', s: EXCEL_STYLES.dataCell }, { v: data.carbon?.carbonFootprint || 0, s: EXCEL_STYLES.numberCell }],
        [{ v: 'Average AQI Score', s: EXCEL_STYLES.dataCell }, { v: data.carbon?.aqi || 0, s: EXCEL_STYLES.numberCell }]
    ];
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryRows);
    summaryWs['!cols'] = [{ wch: 40 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, "Summary View");

    // Monthly Breakdown Sheet
    if (type === 'yearly' && monthlyBreakdown?.length > 0) {
        // SORT: January First
        const sorted = [...monthlyBreakdown].sort((a, b) => (monthOrder[a.period?.month] || 0) - (monthOrder[b.period?.month] || 0));

        const headers = [
            'Month', 'Students', 'Employees', 'Total Pop.',
            'Elec (kWh)', 'Elec Cost', 'Water (m³)', 'Water Cost',
            'Waste (kg)', 'Recycle (kg)', 'Paper (Reams)', 'Total Sheets',
            'Gen (Hrs)', 'Fuel (L)', 'Carbon', 'AQI'
        ].map(h => ({ v: h, s: EXCEL_STYLES.header }));

        const rows = sorted.map(m => [
            { v: m.period?.month, s: EXCEL_STYLES.dataCell },
            { v: m.personnel?.students || 0, s: EXCEL_STYLES.numberCell },
            { v: m.personnel?.employees || 0, s: EXCEL_STYLES.numberCell },
            { v: m.personnel?.total || 0, s: EXCEL_STYLES.numberCell },
            { v: m.electricity?.units || 0, s: EXCEL_STYLES.numberCell },
            { v: m.electricity?.totalCost || 0, s: EXCEL_STYLES.numberCell },
            { v: m.water?.units || 0, s: EXCEL_STYLES.numberCell },
            { v: m.water?.totalCost || 0, s: EXCEL_STYLES.numberCell },
            { v: m.waste?.total || 0, s: EXCEL_STYLES.numberCell },
            { v: m.waste?.recyclables || 0, s: EXCEL_STYLES.numberCell },
            { v: m.paper?.reams || 0, s: EXCEL_STYLES.numberCell },
            { v: m.paper?.totalSheets || 0, s: EXCEL_STYLES.numberCell },
            { v: m.generator?.avgRunningHours || 0, s: EXCEL_STYLES.numberCell },
            { v: m.generator?.fuelLitres || 0, s: EXCEL_STYLES.numberCell },
            { v: m.carbon?.carbonFootprint || 0, s: EXCEL_STYLES.numberCell },
            { v: m.carbon?.aqi || 0, s: EXCEL_STYLES.numberCell }
        ]);

        const totals = {
            s: 0, e: 0, t: 0, ek: 0, ec: 0, wu: 0, wc: 0, wt: 0, wr: 0, pr: 0, ps: 0, gh: 0, fl: 0, cf: 0, aq: 0, n: 0
        };
        sorted.forEach(m => {
            totals.s += (m.personnel?.students || 0); totals.e += (m.personnel?.employees || 0);
            totals.t += (m.personnel?.total || 0); totals.ek += (m.electricity?.units || 0);
            totals.ec += (m.electricity?.totalCost || 0); totals.wu += (m.water?.units || 0);
            totals.wc += (m.water?.totalCost || 0); totals.wt += (m.waste?.total || 0);
            totals.wr += (m.waste?.recyclables || 0); totals.pr += (m.paper?.reams || 0);
            totals.ps += (m.paper?.totalSheets || 0); totals.gh += (m.generator?.avgRunningHours || 0);
            totals.fl += (m.generator?.fuelLitres || 0); totals.cf += (m.carbon?.carbonFootprint || 0);
            totals.aq += (m.carbon?.aqi || 0); totals.n++;
        });

        const totalRow = [
            { v: 'TOTALS / AVG', s: EXCEL_STYLES.totalRow },
            { v: '-', s: EXCEL_STYLES.totalRow },
            { v: '-', s: EXCEL_STYLES.totalRow },
            { v: '-', s: EXCEL_STYLES.totalRow },
            { v: totals.ek, s: EXCEL_STYLES.totalRow },
            { v: totals.ec, s: EXCEL_STYLES.totalRow },
            { v: totals.wu, s: EXCEL_STYLES.totalRow },
            { v: totals.wc, s: EXCEL_STYLES.totalRow },
            { v: totals.wt, s: EXCEL_STYLES.totalRow },
            { v: totals.wr, s: EXCEL_STYLES.totalRow },
            { v: totals.pr, s: EXCEL_STYLES.totalRow },
            { v: totals.ps, s: EXCEL_STYLES.totalRow },
            { v: totals.gh, s: EXCEL_STYLES.totalRow },
            { v: totals.fl, s: EXCEL_STYLES.totalRow },
            { v: totals.cf, s: EXCEL_STYLES.totalRow },
            { v: totals.n > 0 ? (totals.aq / totals.n).toFixed(1) : 0, s: EXCEL_STYLES.totalRow }
        ];

        const breakdownRows = [headers, ...rows, totalRow];
        const breakdownWs = XLSX.utils.aoa_to_sheet(breakdownRows);
        breakdownWs['!cols'] = headers.map(() => ({ wch: 15 }));
        XLSX.utils.book_append_sheet(wb, breakdownWs, "Monthly Breakdown");
    }

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `BNU_${title.replace(/\s+/g, '_')}.xlsx`);
};
