/* ==========================================
   📅 EVENTS (FINAL PRO+++ SMART SYSTEM)
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
   🎨 SMART COLOR (LOAD BASED)
========================================== */

function getSmartEventColor(emp, group, year) {
    const base = getSafeColor(group);

    if (!emp) return base;

    const balance = getVacationBalance?.(emp.id, year);

    if (!balance) return base;

    const percent = balance.percent || 0;

    // 🔥 justera ljusstyrka beroende på belastning
    if (percent > 90) return "#ef4444"; // röd (slut)
    if (percent > 70) return "#f59e0b"; // orange

    return base;
}

/* ==========================================
   🧠 TOOLTIP (UPGRADED)
========================================== */

function buildTooltip(emp, group, vac, year) {
    const balance = getVacationBalance?.(emp?.id, year);

    return `👤 ${emp?.name || "Okänd"}
🧩 ${group?.name || "Ingen grupp"}
📅 ${vac.start} → ${vac.end}
📊 ${balance ? `${balance.used}/${balance.total} dagar` : ""}`;
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

        // 🔥 PERFORMANCE: skapa lookup maps
        const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
        const groupMap = Object.fromEntries(groups.map(g => [g.id, g]));

        return vacations.map(vac => {

            const emp = empMap[vac.employee_id];
            const group = emp ? groupMap[emp.group_id] : null;

            const color = getSmartEventColor(emp, group, year);

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
                    tooltip: buildTooltip(emp, group, vac, year),
                    groupName: group?.name || null,
                    employeeId: emp?.id || null,
                    groupId: group?.id || null
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
