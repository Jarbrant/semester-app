let calendar;

window.renderCalendar = function() {
    const employees = getEmployees();
    const vacations = getVacations();

    const filter = document.getElementById("filter")?.value || "all";

    const events = vacations
        .filter(v => filter === "all" || v.employee_id == filter)
        .map(v => {
            const emp = employees.find(e => e.id == v.employee_id);

            return {
                title: emp ? emp.name : "?",
                start: v.start,
                end: v.end
            };
        });

    if (calendar) calendar.destroy();

    calendar = new FullCalendar.Calendar(
        document.getElementById("calendar"),
        {
            initialView: "dayGridMonth",
            events
        }
    );

    calendar.render();
};
