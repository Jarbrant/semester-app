// ==========================================
// 📅 CALENDAR MODULE (PRO VERSION)
// ==========================================

let calendar = null;

// 🎯 Rendera kalender
window.renderCalendar = function () {
    const calendarEl = document.getElementById("calendar");

    // säkerhetscheck
    if (!calendarEl) {
        console.error("Calendar element saknas");
        return;
    }

    // säkerhetscheck
    if (typeof FullCalendar === "undefined") {
        console.error("FullCalendar är inte laddad");
        return;
    }

    const employees = getEmployees();
    const vacations = getVacations();

    const filterEl = document.getElementById("filter");
    const filter = filterEl ? filterEl.value : "all";

    // 🔥 skapa events
    const events = vacations
        .filter(v => filter === "all" || v.employee_id == filter)
        .map(v => {
            const emp = employees.find(e => e.id == v.employee_id);

            return {
                id: v.id,
                title: emp ? emp.name : "Okänd",
                start: v.start,
                end: v.end,
                allDay: true
            };
        });

    // 🔄 destroy gamla kalendern
    if (calendar) {
        calendar.destroy();
        calendar = null;
    }

    // 🚀 skapa ny kalender
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        height: 600,

        locale: "sv",
        firstDay: 1,

        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek"
        },

        events: events,

        // 🗑️ klicka för att ta bort
        eventClick: function (info) {
            if (confirm("Ta bort denna semester?")) {
                deleteVacation(info.event.id);
            }
        }
    });

    calendar.render();
};

// ❌ Ta bort semester
window.deleteVacation = function (id) {
    let vacations = getVacations();

    vacations = vacations.filter(v => v.id != id);

    saveVacations(vacations);

    // uppdatera kalender
    renderCalendar();
};
