/* ==========================================
   📅 FULLCALENDAR INIT (PRO MAX ULTRA)
========================================== */

let calendar;

window.initCalendar = function () {
    try {
        const calendarEl = document.getElementById("calendar");

        if (!calendarEl) {
            console.error("❌ #calendar saknas i DOM");
            return;
        }

        // 🔄 clean destroy
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
            fixedWeekCount: false,

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
               📅 EVENTS (SMART SPLIT)
            ========================================== */

            events(fetchInfo, successCallback) {
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

                    // 🔥 bygg cache för actions
                    requestAnimationFrame(() => {
                        window.calendarActions?.buildEventCache();
                    });

                    successCallback(splitEvents);

                } catch (err) {
                    console.error("❌ event split error:", err);
                    successCallback([]);
                }
            },

            /* ==========================================
               🎨 EVENT RENDER (HARD FIX)
            ========================================== */

            eventDidMount(info) {
                try {
                    // 🔥 använd din centraliserade engine
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
               🌡 DAY CELLS (HEATMAP + UI)
            ========================================== */

            dayCellDidMount(info) {
                try {
                    const dateStr = info.date.toISOString().split("T")[0];

                    // 🔥 använd central logik istället
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
               🖱 INTERACTIONS
            ========================================== */

            dateClick(info) {
                const startInput = document.getElementById("startDate");
                const endInput = document.getElementById("endDate");

                if (startInput && endInput) {
                    startInput.value = info.dateStr;
                    endInput.value = info.dateStr;
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

        // 🔥 stabil refetch (fixar timing issues)
        requestAnimationFrame(() => {
            calendar.refetchEvents();
        });

        window.calendar = calendar;

        console.log("✅ Calendar PRO MAX init klar");

    } catch (err) {
        console.error("💥 Calendar crash:", err);
    }
};

/* ==========================================
   🔄 REFRESH (SMART)
========================================== */

window.refreshCalendar = function () {
    try {
        if (!calendar) return;

        // 🔥 rebuild cache + refresh
        calendar.refetchEvents();

        requestAnimationFrame(() => {
            window.calendarActions?.buildEventCache();
        });

    } catch (err) {
        console.error("💥 refreshCalendar error:", err);
    }
};
