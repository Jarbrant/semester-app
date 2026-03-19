/* ==========================================
   📅 FULLCALENDAR INIT
========================================== */

let calendar;

window.initCalendar = function () {
    const calendarEl = document.getElementById("calendar");

    calendar = new FullCalendar.Calendar(calendarEl, {

        initialView: "dayGridMonth",
        firstDay: 1,
        locale: "sv",
        height: "auto",

        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,listWeek"
        },

        buttonText: {
            today: "Idag",
            month: "Månad",
            week: "Vecka",
            list: "Lista"
        },

        events: getCalendarEvents(),

        /* ==========================================
           🖱 KLICK PÅ DAG
        ========================================== */

        dateClick: function(info) {

            const startInput = document.getElementById("startDate");
            const endInput = document.getElementById("endDate");

            if (startInput && endInput) {
                startInput.value = info.dateStr;
                endInput.value = info.dateStr;
            }

            openModal("vacationModal");
        },

        /* ==========================================
           🖱 KLICK PÅ EVENT
        ========================================== */

        eventClick: function(info) {

            const confirmed = confirm(
                `Ta bort semester för ${info.event.title}?`
            );

            if (!confirmed) return;

            removeVacation(info.event.id);
        }

    });

    calendar.render();
};

/* ==========================================
   🔄 REFRESH
========================================== */

window.refreshCalendar = function () {
    if (!calendar) return;

    calendar.removeAllEvents();
    calendar.addEventSource(getCalendarEvents());
};
