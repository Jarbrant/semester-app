/* ==========================================
   📅 FULLCALENDAR INIT (MAX PRODUCTION)
========================================== */

let calendar;

window.initCalendar = function () {
    try {
        const calendarEl = document.getElementById("calendar");

        if (!calendarEl) {
            console.error("❌ #calendar saknas i DOM");
            return;
        }

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

            /* 🔥 CRITICAL */
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

            events: function (fetchInfo, successCallback) {
                try {
                    const events = eventsFn();
                    successCallback(Array.isArray(events) ? events : []);
                } catch (err) {
                    console.error("❌ event fetch error:", err);
                    successCallback([]);
                }
            },

            /* ==========================================
               🎨 FORCE RENDER FIX (THE MAGIC)
            ========================================== */

            eventDidMount: function (info) {
                try {
                    const bg = info.event.backgroundColor;

                    if (bg) {
                        // 🔥 Force color on element
                        info.el.style.backgroundColor = bg;
                        info.el.style.borderColor = bg;

                        // 🔥 Force color on wrapper (THIS fixes your bug)
                        if (info.el.parentElement) {
                            info.el.parentElement.style.backgroundColor = bg;
                            info.el.parentElement.style.borderRadius = "999px";
                        }
                    }

                    // Tooltip
                    const tooltip = info.event.extendedProps?.tooltip;
                    if (tooltip) {
                        info.el.title = tooltip;
                    }

                } catch (err) {
                    console.warn("⚠️ eventDidMount error:", err);
                }
            },

            dateClick: function (info) {
                try {
                    const startInput = document.getElementById("startDate");
                    const endInput = document.getElementById("endDate");

                    if (startInput && endInput) {
                        startInput.value = info.dateStr;
                        endInput.value = info.dateStr;
                    }

                    openModal?.("vacationModal");

                } catch (err) {
                    console.warn("⚠️ dateClick error:", err);
                }
            },

            eventClick: function (info) {
                try {
                    if (!info?.event?.id) return;

                    const ok = confirm(`Ta bort semester för ${info.event.title}?`);
                    if (!ok) return;

                    removeVacation?.(info.event.id);

                } catch (err) {
                    console.warn("⚠️ eventClick error:", err);
                }
            },

            eventMouseEnter: function (info) {
                info.el.style.cursor = "pointer";
            }

        });

        calendar.render();

        console.log("✅ Calendar MAX init klar");

    } catch (err) {
        console.error("💥 Calendar crash:", err);
    }
};

/* ==========================================
   🔄 REFRESH
========================================== */

window.refreshCalendar = function () {
    try {
        if (!calendar) return;
        calendar.refetchEvents();
    } catch (err) {
        console.error("💥 refreshCalendar error:", err);
    }
};
