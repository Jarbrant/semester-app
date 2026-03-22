/* ==========================================
   📅 FULLCALENDAR INIT (STATE DRIVEN PRO MAX++++)
========================================== */

let calendar;

/* ==========================================
   🛠 UTIL
========================================== */

function toISO(date) {
    return date.toISOString().split("T")[0];
}

/* ==========================================
   🧠 SAFE EVENT SOURCE
========================================== */

function getEventSource() {
    return (typeof getCalendarEvents === "function")
        ? getCalendarEvents
        : () => [];
}

/* ==========================================
   📅 INIT
========================================== */

window.initCalendar = function () {
    try {
        const calendarEl = document.getElementById("calendar");

        if (!calendarEl) {
            console.error("❌ #calendar saknas i DOM");
            return;
        }

        // 🔄 destroy safely
        if (calendar) {
            calendar.destroy();
            calendar = null;
        }

        const eventsFn = getEventSource();

        calendar = new FullCalendar.Calendar(calendarEl, {

            initialView: "dayGridMonth",
            firstDay: 1,
            locale: "sv",
            height: "auto",
            fixedWeekCount: false,
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
               📅 EVENTS (STATE + CACHE SAFE 🔥)
            ========================================== */

            events(fetchInfo, successCallback) {
                try {
                    const rawEvents = eventsFn() || [];

                    // 🔥 redan dag-splittade events → använd direkt
                    successCallback(rawEvents);

                    // 🔥 bygg cache EFTER render (stabil)
                    requestAnimationFrame(() => {
                        window.calendarActions?.buildEventCache();
                    });

                } catch (err) {
                    console.error("❌ event load error:", err);
                    successCallback([]);
                }
            },

            /* ==========================================
               🎨 EVENT RENDER
            ========================================== */

            eventDidMount(info) {
                try {
                    window.calendarActions?.applyEventColor(info);

                    const tooltip = info.event.extendedProps?.tooltip;
                    if (tooltip) {
                        info.el.title = tooltip;
                    }

                } catch (err) {
                    console.warn("⚠️ eventDidMount error:", err);
                }
            },

            /* ==========================================
               🌡 DAY CELLS (HEATMAP ENGINE)
            ========================================== */

            dayCellDidMount(info) {
                try {
                    const dateStr = toISO(info.date);

                    requestAnimationFrame(() => {
                        window.calendarActions?.processDayCell(
                            info.el,
                            dateStr
                        );
                    });

                } catch (err) {
                    console.warn("⚠️ dayCell error:", err);
                }
            },

            /* ==========================================
               🖱 INTERACTIONS (UX++)
            ========================================== */

            dateClick(info) {
                const startInput = document.getElementById("startDate");
                const endInput = document.getElementById("endDate");

                if (startInput && endInput) {
                    startInput.value = info.dateStr;
                    endInput.value = info.dateStr;

                    // 🔥 auto-focus slutdatum (din feature 👇)
                    requestAnimationFrame(() => {
                        endInput.focus();
                    });
                }

                openModal?.("vacationModal");
            },

            eventClick(info) {
                if (!info?.event?.id) return;

                const originalId = info.event.id.split("_")[0];

                window.openEditVacationModal?.(originalId);
            },

            eventMouseEnter(info) {
                info.el.style.cursor = "pointer";
            }

        });

        calendar.render();

        // 🔥 stabil initial sync
        requestAnimationFrame(() => {
            calendar.refetchEvents();
        });

        window.calendar = calendar;

        console.log("✅ Calendar PRO MAX++++ init klar");

    } catch (err) {
        console.error("💥 Calendar crash:", err);
    }
};

/* ==========================================
   🔄 REFRESH (STATE SAFE)
========================================== */

window.refreshCalendar = function () {
    try {
        if (!calendar) return;

        calendar.refetchEvents();

        // 🔥 sync cache + UI efter refresh
        requestAnimationFrame(() => {
            window.calendarActions?.buildEventCache();
        });

    } catch (err) {
        console.error("💥 refreshCalendar error:", err);
    }
};
