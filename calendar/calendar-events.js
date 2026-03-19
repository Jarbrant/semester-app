/* ==========================================
   📅 MAPPA DATA → FULLCALENDAR EVENTS
========================================== */

const defaultColors = [
    "#3b82f6", "#22c55e", "#f59e0b",
    "#ef4444", "#8b5cf6", "#06b6d4"
];

function getEmployeeColor(emp) {
    if (emp?.color) return emp.color;

    // fallback baserat på id
    const index = parseInt(emp?.id || 0) % defaultColors.length;
    return defaultColors[index];
}

window.getCalendarEvents = function () {
    const vacations = getVacations();
    const employees = getEmployees();

    return vacations.map(vac => {

        const emp = employees.find(e => e.id == vac.employee_id);
        const color = getEmployeeColor(emp);

        return {
            id: vac.id, // 🔥 viktigt för delete

            title: emp ? emp.name : "Okänd",

            start: vac.start,
            end: addOneDay(vac.end),

            backgroundColor: color,
            borderColor: color,

            allDay: true
        };
    });
};

/* ==========================================
   🛠 FIX: FullCalendar end
========================================== */

function addOneDay(dateStr) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);

    return date.toISOString().split("T")[0];
}
