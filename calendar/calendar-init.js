/* ==========================================
   📅 FULLCALENDAR INIT (PRODUCTION)
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

            /* SPLIT EVENTS PER DAG */
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
                                id: event.id + "_" + dayStr,
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

            eventDidMount: function (info) {
                window.calendarActions?.applyEventColor(info);
                try {
                    const tooltip = info.event.extendedProps?.tooltip;
                    if (tooltip) {
                        info.el.title = tooltip;
                    }
                } catch {}
            },

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

            dateClick: function (info) {
                const startInput = document.getElementById("startDate");
                const endInput = document.getElementById("endDate");

                if (startInput && endInput) {
                    startInput.value = info.dateStr;
                    endInput.value = info.dateStr;
                }

                openModal?.("vacationModal");
            },

            /* 🔥 NY: EDIT istället för DELETE */
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

        setTimeout(() => {
            calendar.refetchEvents();
        }, 50);

        window.calendar = calendar;

        console.log("✅ Calendar FINAL init klar");
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
