/* ==========================================
   📅 EVENTS MED GROUP COLORS
========================================== */

window.getCalendarEvents = function () {
    const vacations = getVacations();
    const employees = getEmployees();
    const groups = getGroups();

    return vacations.map(vac => {

        const emp = employees.find(e => e.id == vac.employee_id);
        const group = groups.find(g => g.id == emp?.group_id);

        const color = group?.color || "#3788d8";

        return {
            id: vac.id,
            title: emp ? emp.name : "Okänd",

            start: vac.start,
            end: addOneDay(vac.end),

            backgroundColor: color,
            borderColor: color,

            allDay: true
        };
    });
};

function addOneDay(dateStr) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);

    return date.toISOString().split("T")[0];
}
