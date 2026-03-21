/* ==========================================
   📅 FULLCALENDAR INIT (MAX PRODUCTION PATCHED)
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
               🎨 STABIL FÄRG (FIXAD)
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
               📊 DAY CELL (OFÖRÄNDRAD FUNKTION)
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

                        const counter = document.createElement("div");
                        counter.innerText = todays.length;
                        counter.style.position = "absolute";
                        counter.style.top = "4px";
                        counter.style.right = "6px";
                        counter.style.fontSize = "11px";
                        counter.style.opacity = "0.6";

                        info.el.appendChild(counter);

                        if (todays.length > 3) {
                            info.el.style.boxShadow = "inset 0 0 0 2px #ef4444";
                        }

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

        /* 🔥 KRITISK: FIX RELOAD BUG */
        setTimeout(() => {
            try {
                calendar.refetchEvents();

                // 🔥 FORCE repaint
                document.querySelectorAll(".fc-event").forEach(el => {
                    const bg = el.style.backgroundColor;
                    if (bg) {
                        el.style.setProperty("background-color", bg, "important");
                    }
                });

            } catch {}
        }, 50);

        console.log("✅ Calendar MAX init klar");

    } catch (err) {
        console.error("💥 Calendar crash:", err);
    }
};


/* ==========================================
   🔄 REFRESH (PATCHED)
========================================== */

window.refreshCalendar = function () {
    try {
        if (!calendar) return;

        calendar.refetchEvents();

        // 🔥 FORCE repaint efter refetch
        setTimeout(() => {
            document.querySelectorAll(".fc-event").forEach(el => {
                const bg = el.style.backgroundColor;
                if (bg) {
                    el.style.setProperty("background-color", bg, "important");
                }
            });
        }, 30);

    } catch (err) {
        console.error("💥 refreshCalendar error:", err);
    }
};


/* ==========================================
   🎨 COLOR ENGINE (NY – KRITISK FIX)
========================================== */

function applyEventColor(info) {
    try {
        const bg = info.event.backgroundColor;
        if (!bg) return;

        // event
        info.el.style.setProperty("background-color", bg, "important");
        info.el.style.setProperty("border-color", bg, "important");

        // wrapper (viktig!)
        const parent = info.el.closest(".fc-daygrid-event-harness");

        if (parent) {
            parent.style.setProperty("background-color", bg, "important");
            parent.style.setProperty("border-radius", "999px");
        }

    } catch (err) {
        console.warn("⚠️ applyEventColor error:", err);
    }
}
