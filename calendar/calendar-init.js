/* ==========================================
   📅 FULLCALENDAR INIT (FINAL PRO MAX)
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
               📅 EVENTS (SPLIT + SAFE)
            ========================================== */

            events: function (fetchInfo, successCallback) {
                try {
                    const rawEvents = eventsFn() || [];
                    const splitEvents = [];

                    rawEvents.forEach(event => {
                        const start = new Date(event.start);
                        const end = new Date(event.end);

                        if (isNaN(start) || isNaN(end)) return;

                        const current = new Date(start);

                        while (current < end) {
                            const dayStr = current.toISOString().split("T")[0];

                            splitEvents.push({
                                id: `${event.id}_${dayStr}`,
                                title: event.title,
                                start: dayStr,
                                end: dayStr,
                                backgroundColor: event.backgroundColor,
                                borderColor: event.borderColor,
                                textColor: event.textColor,
                                display: "block",
                                allDay: true,
                                extendedProps: event.extendedProps
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
               🎨 EVENT RENDER
            ========================================== */

            eventDidMount: function (info) {
                try {
                    // 🔥 FORCE COLOR (säker mot CSS buggar)
                    const bg = info.event.backgroundColor;

                    if (bg) {
                        info.el.style.backgroundColor = bg;
                        info.el.style.borderColor = bg;

                        if (info.el.parentElement) {
                            info.el.parentElement.style.backgroundColor = bg;
                            info.el.parentElement.style.borderRadius = "999px";
                        }
                    }

                    const tooltip = info.event.extendedProps?.tooltip;
                    if (tooltip) {
                        info.el.title = tooltip;
                    }

                } catch (err) {
                    console.warn("⚠️ eventDidMount error:", err);
                }
            },

            /* ==========================================
               🔥 HEATMAP DAY CELLS (NYTT)
            ========================================== */

            dayCellDidMount: function (info) {
                try {
                    const dateStr = info.date.toISOString().split("T")[0];

                    // 🔥 samla events för denna dag
                    const events = calendar.getEvents();

                    let load = 0;

                    events.forEach(e => {
                        if (e.startStr === dateStr) {
                            load += e.extendedProps?.load || 0;
                        }
                    });

                    // 🔥 visualisera cell
                    if (load > 0) {
                        const intensity = Math.min(load / 10, 1);

                        info.el.style.background = `
                            linear-gradient(
                                180deg,
                                rgba(255,255,255,0.8),
                                rgba(255,0,0,${0.05 + intensity * 0.25})
                            )
                        `;
                    }

                } catch (err) {
                    console.warn("⚠️ dayCell heatmap error:", err);
                }
            },

            /* ==========================================
               🖱 INTERACTIONS
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

                window.openEditVacationModal?.(originalId);
            },

            eventMouseEnter: function (info) {
                info.el.style.cursor = "pointer";
            }

        });

        calendar.render();

        // 🔥 säker refetch efter render (fixar race condition)
        requestAnimationFrame(() => {
            calendar.refetchEvents();
        });

        window.calendar = calendar;

        console.log("✅ Calendar FINAL MAX init klar");

    } catch (err) {
        console.error("💥 Calendar crash:", err);
    }
};

/* ==========================================
   🔄 REFRESH (STABIL)
========================================== */

window.refreshCalendar = function () {
    try {
        if (!calendar) return;

        calendar.refetchEvents();

    } catch (err) {
        console.error("💥 refreshCalendar error:", err);
    }
};
