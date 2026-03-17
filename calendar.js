let calendar;

window.renderCalendar = function() {
    const calendarEl = document.getElementById("calendar");

    // 🛑 säkerhetscheck
    if (!calendarEl) {
        console.error("Calendar element saknas");
        return;
    }

    // 🛑 säkerhetscheck
    if (typeof FullCalendar === "undefined") {
        console.error("FullCalendar laddades inte");
        return;
    }

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

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        height: 600,
        events: events
    });

    calendar.render();
};
