// dashboard.js — KKUPMO PMO Dashboard Charts

const COLORS = {
    primary: '#1a3a5c',
    primaryLight: '#2d5a8e',
    accent: '#c9a227',
    success: '#1a7a4a',
    danger: '#c0392b',
    warning: '#d68910',
    info: '#1a6fa8',
    purple: '#6c3483',
    teal: '#117a65',
    muted: '#6b7c93',
};

const STATUS_COLORS = [
    '#1a3a5c', '#1a7a4a', '#d68910', '#c0392b',
    '#6c3483', '#117a65', '#c9a227', '#1a6fa8', '#8e44ad'
];

Chart.defaults.font.family = "'Tajawal', sans-serif";
Chart.defaults.color = COLORS.muted;

// ==========================================
// Pie Chart — Projects by Status
// ==========================================
async function loadStatusChart() {
    try {
        const res = await fetch('/api/dashboard/projects-by-status');
        const data = await res.json();

        const ctx = document.getElementById('statusChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    backgroundColor: STATUS_COLORS,
                    borderWidth: 3,
                    borderColor: '#fff',
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '62%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 16,
                            font: { family: "'Tajawal', sans-serif", size: 12 },
                            usePointStyle: true,
                            pointStyleWidth: 10
                        }
                    },
                    tooltip: {
                        rtl: true,
                        callbacks: {
                            label: (ctx) => ` ${ctx.label}: ${ctx.raw} مشروع`
                        }
                    }
                }
            }
        });
    } catch (e) {
        console.error('Error loading status chart:', e);
        showChartError('statusChart');
    }
}

// ==========================================
// Bar Chart — Planned vs Actual
// ==========================================
async function loadPlannedActualChart() {
    try {
        const res = await fetch('/api/dashboard/delayed-projects');
        const data = await res.json();

        const ctx = document.getElementById('plannedActualChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'المخطط %',
                        data: data.planned,
                        backgroundColor: 'rgba(26,106,168,0.75)',
                        borderColor: COLORS.info,
                        borderWidth: 1.5,
                        borderRadius: 5,
                    },
                    {
                        label: 'الفعلي %',
                        data: data.actual,
                        backgroundColor: 'rgba(26,122,74,0.75)',
                        borderColor: COLORS.success,
                        borderWidth: 1.5,
                        borderRadius: 5,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { family: "'Tajawal', sans-serif", size: 12 },
                            usePointStyle: true,
                        }
                    },
                    tooltip: { rtl: true }
                },
                scales: {
                    x: {
                        min: 0,
                        max: 100,
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        ticks: { callback: v => v + '%', font: { family: "'Tajawal', sans-serif" } }
                    },
                    y: {
                        grid: { display: false },
                        ticks: {
                            font: { family: "'Tajawal', sans-serif", size: 11 },
                            maxRotation: 0
                        }
                    }
                }
            }
        });
    } catch (e) {
        console.error('Error loading planned/actual chart:', e);
        showChartError('plannedActualChart');
    }
}

// ==========================================
// Line Chart — Monthly Progress
// ==========================================
async function loadMonthlyChart() {
    try {
        const res = await fetch('/api/dashboard/monthly-progress');
        const data = await res.json();

        const ctx = document.getElementById('monthlyChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'المخطط %',
                        data: data.planned,
                        borderColor: COLORS.info,
                        backgroundColor: 'rgba(26,106,168,0.08)',
                        borderWidth: 2.5,
                        pointBackgroundColor: COLORS.info,
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'الفعلي %',
                        data: data.actual,
                        borderColor: COLORS.success,
                        backgroundColor: 'rgba(26,122,74,0.08)',
                        borderWidth: 2.5,
                        pointBackgroundColor: COLORS.success,
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { family: "'Tajawal', sans-serif", size: 12 },
                            usePointStyle: true,
                        }
                    },
                    tooltip: { rtl: true }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        ticks: { callback: v => v + '%', font: { family: "'Tajawal', sans-serif" } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: "'Tajawal', sans-serif" } }
                    }
                }
            }
        });
    } catch (e) {
        console.error('Error loading monthly chart:', e);
        showChartError('monthlyChart');
    }
}

// ==========================================
// Horizontal Bar — Delayed Projects
// ==========================================
async function loadDelayedChart() {
    try {
        const res = await fetch('/api/dashboard/delayed-projects');
        const data = await res.json();

        const ctx = document.getElementById('delayedChart');
        if (!ctx) return;

        const deviations = data.deviation ?? data.actual?.map((a, i) => a - data.planned[i]) ?? [];

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'نسبة الانحراف %',
                    data: deviations,
                    backgroundColor: deviations.map(d => d >= 0
                        ? 'rgba(26,122,74,0.75)'
                        : d >= -10 ? 'rgba(214,137,16,0.75)' : 'rgba(192,57,43,0.75)'),
                    borderColor: deviations.map(d => d >= 0 ? COLORS.success : d >= -10 ? COLORS.warning : COLORS.danger),
                    borderWidth: 1.5,
                    borderRadius: 5,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        rtl: true,
                        callbacks: {
                            label: ctx => ` الانحراف: ${ctx.raw > 0 ? '+' : ''}${ctx.raw}%`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        ticks: { callback: v => v + '%', font: { family: "'Tajawal', sans-serif" } }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { family: "'Tajawal', sans-serif", size: 11 } }
                    }
                }
            }
        });
    } catch (e) {
        console.error('Error loading delayed chart:', e);
        showChartError('delayedChart');
    }
}

function showChartError(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (canvas) {
        const parent = canvas.parentElement;
        canvas.style.display = 'none';
        parent.innerHTML += `<div class="text-center text-muted py-4">
            <i class="bi bi-exclamation-circle fs-2 d-block mb-2"></i>
            <small>لا توجد بيانات متاحة</small>
        </div>`;
    }
}

// Initialize all charts on page load
document.addEventListener('DOMContentLoaded', () => {
    loadStatusChart();
    loadPlannedActualChart();
    loadMonthlyChart();
    loadDelayedChart();
});
