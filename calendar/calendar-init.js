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

            console.log("Klick på datum:", info.dateStr);

            // 🔥 sätt datum i modal
            const startInput = document.getElementById("startDate");
            const endInput = document.getElementById("endDate");

            if (startInput && endInput) {
                startInput.value = info.dateStr;
                endInput.value = info.dateStr;
            }

            // 🔥 öppna modal
            openModal("vacationModal");
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
