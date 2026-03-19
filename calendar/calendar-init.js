/* ==========================================
   📅 FULLCALENDAR INIT
========================================== */

let calendar; // global så vi kan uppdatera senare

window.initCalendar = function () {
    const calendarEl = document.getElementById("calendar");

    // 🔥 skapa kalender
    calendar = new FullCalendar.Calendar(calendarEl, {

        /* ==========================================
           🧠 BASINSTÄLLNINGAR
        ========================================== */

        initialView: "dayGridMonth",

        firstDay: 1, // 🔥 MÅNDAG

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
           📅 EVENTS (tomt just nu)
        ========================================== */

        events: []

    });

    calendar.render();
};
