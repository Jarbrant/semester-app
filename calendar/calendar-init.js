/* ==========================================
   📅 FULLCALENDAR INIT (PER-DAY RENDER PATCH)
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
               🔥 SPLIT EVENTS PER DAG
            ========================================== */

            events: function (fetchInfo, successCallback) {
                try {
                    const rawEvents = eventsFn();

                    const splitEvents = [];

                    rawEvents.forEach(event => {
                        const start = new Date(event.start);
                        const end = new Date(event.end);

                        const current = new Date(start);

                        while (current < end) {

                            const dayStr = current.toISOString().split("T")[0];

                            splitEvents.push({
                                ...event,
                                start: dayStr,
                                end: dayStr, // 🔥 1-day event
                                id: event.id + "_" + dayStr
                            });

                            current.setDate(current.getDate() + 1);
                        }
                    });

                    successCallback(splitEvents);

                } catch (err) {
                    console.error("❌ event split error:", err);
                    successCallback([]);
                }
            },

            /* ==========================================
               🎨 STABIL FÄRG
            ========================================== */

            eventDidMount: function (info) {
                applyEventColor(info);

                try {
                    const tooltip = info.event.extendedProps?.tooltip;
                    if (tooltip) {
                        info.el.title = tooltip;
                    }
                } catch {}
            },

            /* ==========================================
               📊 DAY LOGIC (OFÖRÄNDRAD)
            ========================================== */

            dayCellDidMount: function (info) {
                try {
                    setTimeout(() => {
                        const dateStr = info.date.toISOString().split("T")[0];

                        window.calendarActions?.processDayCell(
                            info.el,
                            dateStr
                        );

                    }, 0);
                } catch {}
            },

            /* ==========================================
               🖱 INTERACTION
            ========================================== */

            dateClick: function (info) {
                const startInput = document.getElementById("startDate");
                const endInput = document.getElementById("endDate");

                if (startInput && endInput) {
                    startInput.value = info.dateStr;
                    endInput.value = info.dateStr;
                }

                openModal?.("vacationModal");
            },

            eventClick: function (info) {
                if (!info?.event?.id) return;

                const originalId = info.event.id.split("_")[0];

                const ok = confirm(`Ta bort semester för ${info.event.title}?`);
                if (!ok) return;

                removeVacation?.(originalId);
            },

            eventMouseEnter: function (info) {
                info.el.style.cursor = "pointer";
            }

        });

        calendar.render();

        setTimeout(() => {
            calendar.refetchEvents();
        }, 50);

        console.log("✅ Calendar PER-DAY init klar");

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


/* ==========================================
   🎨 COLOR ENGINE
========================================== */

function applyEventColor(info) {
    try {
        const bg = info.event.backgroundColor;
        if (!bg) return;

        info.el.style.setProperty("background-color", bg, "important");
        info.el.style.setProperty("border-color", bg, "important");

    } catch (err) {
        console.warn("⚠️ applyEventColor error:", err);
    }
}
