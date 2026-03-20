/* ==========================================
   📅 FULLCALENDAR INIT (PRODUCTION PATCHED)
========================================== */

let calendar;

window.initCalendar = function () {
    try {
        const calendarEl = document.getElementById("calendar");

        if (!calendarEl) {
            console.error("❌ #calendar saknas i DOM");
            return;
        }

        // 🔥 Undvik dubbel init
        if (calendar) {
            calendar.destroy();
            calendar = null;
        }

        const eventsFn = typeof getCalendarEvents === "function"
            ? getCalendarEvents
            : () => [];

        calendar = new FullCalendar.Calendar(calendarEl, {

            /* ==========================================
               ⚙️ BASCONFIG
            ========================================== */

            initialView: "dayGridMonth",
            firstDay: 1,
            locale: "sv",
            height: "auto",

            /* 🔥 KRITISK FIX – gör att färger funkar */
            eventDisplay: "block",

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
               📡 EVENTS (SAFE FETCH)
            ========================================== */

            events: function (fetchInfo, successCallback) {
                try {
                    const events = eventsFn();

                    if (!Array.isArray(events)) {
                        console.warn("⚠️ getCalendarEvents returnerade ej array");
                        return successCallback([]);
                    }

                    successCallback(events);

                } catch (err) {
                    console.error("❌ event fetch error:", err);
                    successCallback([]);
                }
            },

            /* ==========================================
               🖱 KLICK PÅ DAG
            ========================================== */

            dateClick: function (info) {
                try {
                    const startInput = document.getElementById("startDate");
                    const endInput = document.getElementById("endDate");

                    if (startInput && endInput) {
                        startInput.value = info.dateStr;
                        endInput.value = info.dateStr;
                    }

                    if (typeof openModal === "function") {
                        openModal("vacationModal");
                    }

                } catch (err) {
                    console.warn("⚠️ dateClick error:", err);
                }
            },

            /* ==========================================
               🗑 DELETE EVENT
            ========================================== */

            eventClick: function (info) {
                try {
                    if (!info?.event?.id) return;

                    const ok = confirm(`Ta bort semester för ${info.event.title}?`);
                    if (!ok) return;

                    if (typeof removeVacation === "function") {
                        removeVacation(info.event.id);
                    }

                } catch (err) {
                    console.warn("⚠️ eventClick error:", err);
                }
            },

            /* ==========================================
               💡 TOOLTIP
            ========================================== */

            eventDidMount: function (info) {
                try {
                    const tooltip = info.event.extendedProps?.tooltip;

                    if (tooltip) {
                        info.el.title = tooltip;
                    }

                } catch (err) {
                    console.warn("⚠️ tooltip error:", err);
                }
            },

            /* ==========================================
               ✨ UX – CURSOR
            ========================================== */

            eventMouseEnter: function (info) {
                try {
                    info.el.style.cursor = "pointer";
                } catch {}
            }

        });

        calendar.render();

        console.log("✅ Calendar init klar");

    } catch (err) {
        console.error("💥 Calendar crash:", err);
    }
};


/* ==========================================
   🔄 REFRESH (PRODUCTION SAFE)
========================================== */

window.refreshCalendar = function () {
    try {
        if (!calendar) return;

        calendar.refetchEvents();

    } catch (err) {
        console.error("💥 refreshCalendar error:", err);
    }
};
