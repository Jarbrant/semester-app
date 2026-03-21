/* ==========================================
   📅 EVENTS (FINAL PRO MAX – HEATMAP + SMART)
========================================== */

// 🔐 Fallbacks
if (typeof getGroups !== "function") window.getGroups = () => [];
if (typeof getEmployees !== "function") window.getEmployees = () => [];
if (typeof getVacations !== "function") window.getVacations = () => [];

/* ==========================================
   🎨 SAFE COLOR
========================================== */

function getSafeColor(group) {
    const defaultColor = "#3b82f6";

    if (!group || !group.color) return defaultColor;

    let color = group.color.trim();

    if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) return color;

    const map = {
        blue: "#3b82f6",
        red: "#ef4444",
        green: "#22c55e",
        yellow: "#eab308",
        orange: "#f97316",
        purple: "#8b5cf6",
        pink: "#ec4899",
        gray: "#6b7280"
    };

    return map[color.toLowerCase()] || defaultColor;
}

/* ==========================================
   📊 GROUP LOAD (OPTIMIZED)
========================================== */

function buildGroupLoadMap(vacations, employees) {
    const map = {};

    vacations.forEach(v => {
        const emp = employees.find(e => e.id == v.employee_id);
        if (!emp || !emp.group_id) return;

        let current = new Date(v.start);
        const end = new Date(v.end);

        while (current <= end) {
            const key = `${emp.group_id}_${current.toISOString().split("T")[0]}`;

            map[key] = (map[key] || 0) + 1;

            current.setDate(current.getDate() + 1);
        }
    });

    return map;
}

/* ==========================================
   🎨 HEATMAP COLOR ENGINE
========================================== */

function getHeatmapColor(baseColor, load, max = 5) {
    const intensity = Math.min(load / max, 1);

    if (intensity > 0.9) return "#dc2626"; // 🔥 critical

    const hex = baseColor.replace("#", "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const factor = 1 - intensity * 0.7;

    return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
}

/* ==========================================
   🧠 SMART COLOR
========================================== */

function getSmartEventColor(emp, group, year, load, max) {
    const base = getSafeColor(group);

    if (!emp) return base;

    const balance = getVacationBalance?.(emp.id, year);

    if (balance?.percent > 90) return "#ef4444";
    if (balance?.percent > 70) return "#f59e0b";

    return getHeatmapColor(base, load, max);
}

/* ==========================================
   🧠 TOOLTIP
========================================== */

function buildTooltip(emp, group, vac, year, load) {
    const balance = getVacationBalance?.(emp?.id, year);

    return `👤 ${emp?.name || "Okänd"}
🧩 ${group?.name || "Ingen grupp"}
📅 ${vac.start} → ${vac.end}
📊 ${balance ? `${balance.used}/${balance.total} dagar` : ""}
👥 ${load} i gruppen lediga`;
}

/* ==========================================
   📅 EVENTS
========================================== */

window.getCalendarEvents = function () {
    try {
        const vacations = getVacations() || [];
        const employees = getEmployees() || [];
        const groups = getGroups() || [];

        const year = (typeof getSelectedYear === "function")
            ? getSelectedYear()
            : new Date().getFullYear();

        // 🔥 lookup maps
        const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
        const groupMap = Object.fromEntries(groups.map(g => [g.id, g]));

        // 🔥 heatmap pre-calc
        const loadMap = buildGroupLoadMap(vacations, employees);

        return vacations.map(vac => {

            const emp = empMap[vac.employee_id];
            const group = emp ? groupMap[emp.group_id] : null;

            const dateKey = `${group?.id}_${vac.start}`;
            const load = loadMap[dateKey] || 0;

            const max = group?.maxConcurrent || 5;

            const color = getSmartEventColor(emp, group, year, load, max);

            return {
                id: vac.id ?? Date.now(),

                title: emp?.name || "Okänd",

                start: vac.start,
                end: addOneDaySafe(vac.end),

                display: "block",

                backgroundColor: color,
                borderColor: color,
                textColor: "#ffffff",

                allDay: true,

                extendedProps: {
                    tooltip: buildTooltip(emp, group, vac, year, load),
                    groupName: group?.name || null,
                    employeeId: emp?.id || null,
                    groupId: group?.id || null,
                    load
                }
            };
        });

    } catch (err) {
        console.error("❌ getCalendarEvents error:", err);
        return [];
    }
};

/* ==========================================
   🛠 DATE FIX
========================================== */

function addOneDaySafe(dateStr) {
    if (!dateStr) return null;

    try {
        const date = new Date(dateStr);
        if (isNaN(date)) return dateStr;

        date.setDate(date.getDate() + 1);

        return date.toISOString().split("T")[0];

    } catch {
        return dateStr;
    }
}
