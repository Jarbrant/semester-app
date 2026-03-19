/* ==========================================
   📅 MAPPA DATA → FULLCALENDAR EVENTS
========================================== */

window.getCalendarEvents = function () {
    const vacations = getVacations();
    const employees = getEmployees();

    return vacations.map(vac => {

        // 🔍 hitta person
        const emp = employees.find(e => e.id == vac.employee_id);

        return {
            title: emp ? emp.name : "Okänd",

            start: vac.start,
            end: addOneDay(vac.end), // 🔥 viktigt (FullCalendar fix)

            backgroundColor: emp?.color || "#3788d8",
            borderColor: emp?.color || "#3788d8",

            allDay: true
        };
    });
};

/* ==========================================
   🛠 FIX: FullCalendar tolkar end som exklusiv
========================================== */

function addOneDay(dateStr) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);

    return date.toISOString().split("T")[0];
}
