/* ==========================================
   📅 FULLCALENDAR INIT
========================================== */

let calendar; // global referens

window.initCalendar = function () {
    const calendarEl = document.getElementById("calendar");

    calendar = new FullCalendar.Calendar(calendarEl, {

        /* ==========================================
           🧠 BASINSTÄLLNINGAR
        ========================================== */

        initialView: "dayGridMonth",
        firstDay: 1, // 🔥 måndag
        locale: "sv",
        height: "auto",

        /* ==========================================
           🧭 NAVIGATION & VYER
        ========================================== */

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

        /* ==========================================
           📅 EVENTS
        ========================================== */

        events: getCalendarEvents()

    });

    calendar.render();
};

/* ==========================================
   🔄 UPPDATERA EVENTS
========================================== */

window.refreshCalendar = function () {
    if (!calendar) return;

    calendar.removeAllEvents();
    calendar.addEventSource(getCalendarEvents());
};
