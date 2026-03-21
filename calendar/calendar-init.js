/* ==========================================
   📅 FULLCALENDAR INIT (NEXT LEVEL PRO)
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
               📡 EVENTS
            ========================================== */

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
               🎨 FORCE COLOR (ULTIMATE FIX)
            ========================================== */

            eventDidMount: function (info) {
                try {
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
               📊 DAY COUNTER + OVERBOOK
            ========================================== */

            dayCellDidMount: function (info) {
                try {
                    setTimeout(() => {
                        const events = calendar.getEvents();

                        const dayStr = info.date.toISOString().split("T")[0];

                        const todays = events.filter(e =>
                            e.startStr <= dayStr && e.endStr >= dayStr
                        );

                        if (todays.length === 0) return;

                        // 📊 counter
                        const counter = document.createElement("div");
                        counter.innerText = todays.length;
                        counter.style.position = "absolute";
                        counter.style.top = "4px";
                        counter.style.right = "6px";
                        counter.style.fontSize = "11px";
                        counter.style.opacity = "0.6";

                        info.el.appendChild(counter);

                        // 🚨 overbook (basic)
                        if (todays.length > 3) {
                            info.el.style.boxShadow = "inset 0 0 0 2px #ef4444";
                        }

                    }, 0);

                } catch (err) {
                    console.warn("⚠️ dayCell error:", err);
                }
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

                const ok = confirm(`Ta bort semester för ${info.event.title}?`);
                if (!ok) return;

                removeVacation?.(info.event.id);
            },

            eventMouseEnter: function (info) {
                info.el.style.cursor = "pointer";
            }

        });

        calendar.render();

        /* 🔥 CRITICAL: FIX reload bug */
        setTimeout(() => {
            calendar.refetchEvents();
        }, 50);

        console.log("✅ Calendar NEXT LEVEL init klar");

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
