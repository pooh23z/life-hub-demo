/* ==========================================================================
   Life & Business Hub - High-Contrast Donut & Line Chart System
   ========================================================================== */

class ChartRenderController {
    constructor() {
        this.overviewChart = null;
        this.categoryChart = null;
        this.shopChannelChart = null;
    }

    init() {
        // Initialized on tab switches
    }

    initMainOverviewChart() {
        const canvas = document.getElementById('mainOverviewChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (this.overviewChart) this.overviewChart.destroy();

        const financeList = store.getFinance();
        const businessList = store.getBusiness();

        // Calculate Monthly Totals
        const monthIncome = financeList.filter(x => x.type === 'income').reduce((s, x) => s + Number(x.amount), 0);
        const monthExpense = financeList.filter(x => x.type === 'expense').reduce((s, x) => s + Number(x.amount), 0);
        const monthShopSales = businessList.filter(x => x.type === 'sale').reduce((s, x) => s + Number(x.amount), 0);

        this.overviewChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['สัปดาห์ที่ 1', 'สัปดาห์ที่ 2', 'สัปดาห์ที่ 3', 'สัปดาห์ปัจจุบัน'],
                datasets: [
                    {
                        label: 'รายรับส่วนตัว (บาท)',
                        data: [monthIncome * 0.2, monthIncome * 0.4, monthIncome * 0.7, monthIncome],
                        borderColor: '#22c55e',
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#22c55e',
                        pointRadius: 5
                    },
                    {
                        label: 'รายจ่ายส่วนตัว (บาท)',
                        data: [monthExpense * 0.3, monthExpense * 0.5, monthExpense * 0.8, monthExpense],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#ef4444',
                        pointRadius: 5
                    },
                    {
                        label: 'ยอดขายร้านค้า (บาท)',
                        data: [monthShopSales * 0.25, monthShopSales * 0.5, monthShopSales * 0.75, monthShopSales],
                        borderColor: '#06b6d4',
                        backgroundColor: 'rgba(6, 182, 212, 0.15)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#06b6d4',
                        pointRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#38bdf8',
                        borderColor: 'rgba(56, 189, 248, 0.3)',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8', font: { family: 'Prompt' } }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8', font: { family: 'Prompt' } }
                    }
                }
            }
        });
    }

    initFinanceCategoryChart() {
        const canvas = document.getElementById('financeCategoryChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (this.categoryChart) this.categoryChart.destroy();

        const financeList = store.getFinance().filter(x => x.type === 'expense');

        // Aggregation by category
        const catMap = {};
        financeList.forEach(item => {
            const cat = item.category || 'อื่นๆ';
            catMap[cat] = (catMap[cat] || 0) + Number(item.amount);
        });

        const labels = Object.keys(catMap);
        const dataValues = Object.values(catMap);

        // Curated Ultra High-Contrast Modern Palette for Dark Theme
        const bgColors = [
            '#fb7185', // Rose
            '#38bdf8', // Cyan
            '#fbbf24', // Amber
            '#a855f7', // Purple
            '#34d399', // Emerald
            '#f472b6', // Pink
            '#60a5fa'  // Blue
        ];

        this.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels.length > 0 ? labels : ['ไม่มีข้อมูล'],
                datasets: [{
                    data: dataValues.length > 0 ? dataValues : [1],
                    backgroundColor: labels.length > 0 ? bgColors.slice(0, labels.length) : ['#334155'],
                    borderWidth: 2,
                    borderColor: '#0f172a'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: '#f8fafc', font: { family: 'Prompt', size: 12 }, padding: 14 }
                    }
                },
                cutout: '70%'
            }
        });
    }

    initShopChannelChart(customItems = null) {
        const canvas = document.getElementById('shopChannelChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (this.shopChannelChart) this.shopChannelChart.destroy();

        const businessList = (customItems || store.getBusiness()).filter(x => x.type === 'sale');

        // Aggregate by Product Title (clean item name)
        const itemMap = {};
        businessList.forEach(item => {
            let title = (item.title || 'หน้าร้าน').split(' (')[0].replace('ยอดขาย: ', '').trim();
            itemMap[title] = (itemMap[title] || 0) + Number(item.amount);
        });

        // Sort items by highest sales revenue
        const sortedItems = Object.keys(itemMap)
            .map(key => ({ name: key, total: itemMap[key] }))
            .sort((a, b) => b.total - a.total);

        // Take Top 5 best sellers and group remaining into 'อื่นๆ'
        let labels = [];
        let dataValues = [];

        if (sortedItems.length > 5) {
            const top5 = sortedItems.slice(0, 5);
            const otherSum = sortedItems.slice(5).reduce((s, x) => s + x.total, 0);
            labels = top5.map(x => x.name);
            dataValues = top5.map(x => x.total);
            if (otherSum > 0) {
                labels.push('อื่นๆ');
                dataValues.push(otherSum);
            }
        } else {
            labels = sortedItems.map(x => x.name);
            dataValues = sortedItems.map(x => x.total);
        }

        const bgColors = [
            '#fb7185', // Rose (หมูสามชั้น)
            '#fbbf24', // Amber (มันฝรั่ง)
            '#34d399', // Emerald (เห็ดเข็มทอง)
            '#38bdf8', // Cyan (ปลาดอลลี่)
            '#a855f7', // Purple (เต้าหู้ชีส)
            '#64748b'  // Slate (อื่นๆ)
        ];

        this.shopChannelChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels.length > 0 ? labels : ['หน้าร้าน'],
                datasets: [{
                    data: dataValues.length > 0 ? dataValues : [1],
                    backgroundColor: labels.length > 0 ? bgColors.slice(0, labels.length) : ['#34d399'],
                    borderWidth: 2,
                    borderColor: '#0f172a'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#cbd5e1', font: { family: 'Prompt', size: 11 }, padding: 10 }
                    }
                }
            }
        });
    }
}

const chartRenderController = window.chartRenderController = new ChartRenderController();

