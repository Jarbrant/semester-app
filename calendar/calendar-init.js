/* ==========================================
   📅 FULLCALENDAR INIT (SAFE VERSION)
========================================== */

let calendar;

window.initCalendar = function () {
    try {
        const calendarEl = document.getElementById("calendar");

        if (!calendarEl) {
            console.error("❌ #calendar saknas i DOM");
            return;
        }

        // 🔥 fallback om getCalendarEvents saknas
        const eventsFn = typeof getCalendarEvents === "function"
            ? getCalendarEvents
            : () => [];

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

            events: eventsFn(),

            dateClick: function(info) {
                const startInput = document.getElementById("startDate");
                const endInput = document.getElementById("endDate");

                if (startInput && endInput) {
                    startInput.value = info.dateStr;
                    endInput.value = info.dateStr;
                }

                if (typeof openModal === "function") {
                    openModal("vacationModal");
                }
            },

            eventClick: function(info) {
                if (!info?.event?.id) return;

                const ok = confirm(`Ta bort semester för ${info.event.title}?`);
                if (!ok) return;

                if (typeof removeVacation === "function") {
                    removeVacation(info.event.id);
                }
            }

        });

        calendar.render();

    } catch (err) {
        console.error("💥 Calendar crash:", err);
    }
};

/* ==========================================
   🔄 REFRESH (SAFE)
========================================== */

window.refreshCalendar = function () {
    try {
        if (!calendar) return;

        calendar.removeAllEvents();

        const eventsFn = typeof getCalendarEvents === "function"
            ? getCalendarEvents
            : () => [];

        calendar.addEventSource(eventsFn());

    } catch (err) {
        console.error("💥 refreshCalendar error:", err);
    }
};
