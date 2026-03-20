/* ==========================================
   📅 FULLCALENDAR INIT (PRO VERSION)
========================================== */

let calendar;

window.initCalendar = function () {
    try {
        const calendarEl = document.getElementById("calendar");

        if (!calendarEl) {
            console.error("❌ #calendar saknas i DOM");
            return;
        }

        // 🔥 undvik dubbel init
        if (calendar) {
            calendar.destroy();
            calendar = null;
        }

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

            // 🔥 viktigt: använd function istället
            events: function(fetchInfo, successCallback) {
                try {
                    successCallback(eventsFn());
                } catch (err) {
                    console.error("❌ event fetch error:", err);
                    successCallback([]);
                }
            },

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

                openModal?.("vacationModal");
            },

            /* ==========================================
               🗑 DELETE EVENT
            ========================================== */

            eventClick: function(info) {
                if (!info?.event?.id) return;

                const ok = confirm(`Ta bort semester för ${info.event.title}?`);
                if (!ok) return;

                removeVacation?.(info.event.id);
            },

            /* ==========================================
               💡 NICE: TOOLTIP
            ========================================== */

            eventDidMount: function(info) {
                const tooltip = info.event.extendedProps?.tooltip;

                if (tooltip) {
                    info.el.title = tooltip;
                }
            },

            /* ==========================================
               ✨ NICE: HOVER EFFECT (cursor)
            ========================================== */

            eventMouseEnter: function(info) {
                info.el.style.cursor = "pointer";
            }

        });

        calendar.render();

    } catch (err) {
        console.error("💥 Calendar crash:", err);
    }
};

/* ==========================================
   🔄 REFRESH (PRO VERSION)
========================================== */

window.refreshCalendar = function () {
    try {
        if (!calendar) return;

        calendar.refetchEvents(); // 🔥 bättre än remove/add

    } catch (err) {
        console.error("💥 refreshCalendar error:", err);
    }
};
