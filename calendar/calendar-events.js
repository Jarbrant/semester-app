/* ==========================================
   📅 EVENTS MED GROUP COLORS (ROBUST VERSION)
========================================== */

// 🔒 Fallbacks (förhindrar att appen kraschar)
if (typeof getGroups !== "function") {
    window.getGroups = () => [];
}

if (typeof getEmployees !== "function") {
    window.getEmployees = () => [];
}

if (typeof getVacations !== "function") {
    window.getVacations = () => [];
}

/* ==========================================
   🎨 HJÄLP: SÄKER FÄRGHANTERING
========================================== */

function getSafeColor(group) {
    // fallback färg om något saknas
    const defaultColor = "#3788d8";

    if (!group) return defaultColor;

    // säkerställ att color finns och är giltig string
    if (typeof group.color === "string" && group.color.trim() !== "") {
        return group.color;
    }

    return defaultColor;
}

/* ==========================================
   📅 HUVUDFUNKTION
========================================== */

window.getCalendarEvents = function () {
    try {
        const vacations = getVacations() || [];
        const employees = getEmployees() || [];
        const groups = getGroups() || [];

        return vacations.map(vac => {

            // 🔍 hitta employee
            const emp = employees.find(e => e.id == vac.employee_id);

            // 🔍 hitta group (om finns)
            const group = emp ? groups.find(g => g.id == emp.group_id) : null;

            // 🎨 färg
            const color = getSafeColor(group);

            return {
              id: vac.id ?? Date.now(),
              title: emp?.name || "Okänd",
              start: vac.start,
              end: addOneDaySafe(vac.end),

             // 🔥 FULL FIX
             color: color,
             backgroundColor: color,
             borderColor: color,
             textColor: "#ffffff",

             allDay: true
            };
        });

    } catch (err) {
        console.error("❌ getCalendarEvents error:", err);
        return [];
    }
};

/* ==========================================
   🛠 SÄKER DATE FIX
========================================== */

function addOneDaySafe(dateStr) {
    if (!dateStr) return null;

    try {
        const date = new Date(dateStr);

        if (isNaN(date)) return dateStr;

        date.setDate(date.getDate() + 1);

        return date.toISOString().split("T")[0];

    } catch (err) {
        console.warn("⚠️ date parsing failed:", dateStr);
        return dateStr;
    }
}
