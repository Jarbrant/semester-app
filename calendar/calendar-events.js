/* ==========================================
   📅 EVENTS MED GROUP COLORS (PATCHED)
========================================== */

// 🔒 Fallbacks
if (typeof getGroups !== "function") window.getGroups = () => [];
if (typeof getEmployees !== "function") window.getEmployees = () => [];
if (typeof getVacations !== "function") window.getVacations = () => [];

/* ==========================================
   🎨 SAFE COLOR (FIXAD)
========================================== */

function getSafeColor(group) {
    const defaultColor = "#3788d8";

    if (!group) return defaultColor;

    const color = group.color;

    const isHex = typeof color === "string" &&
        /^#([0-9A-F]{3}){1,2}$/i.test(color);

    return isHex ? color : defaultColor;
}

/* ==========================================
   🧠 TOOLTIP
========================================== */

function buildTooltip(emp, group, vac) {
    return `👤 ${emp?.name || "Okänd"}
🧩 ${group?.name || "Ingen grupp"}
📅 ${vac.start} → ${vac.end}`;
}

/* ==========================================
   📅 EVENTS
========================================== */

window.getCalendarEvents = function () {
    try {
        const vacations = getVacations() || [];
        const employees = getEmployees() || [];
        const groups = getGroups() || [];

        return vacations.map(vac => {

            const emp = employees.find(e => e.id == vac.employee_id);

            const group = emp && groups.length
                ? groups.find(g => g.id == emp.group_id)
                : null;

            const color = getSafeColor(group);

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
                    tooltip: buildTooltip(emp, group, vac),
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
