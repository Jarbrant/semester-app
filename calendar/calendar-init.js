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
   🧠 EDIT LOADER (🔥 AO-03 FINAL FIX)
========================================== */

function loadVacationIntoForm(vacationId) {

    const vacations = getVacations?.() || [];
    const vac = vacations.find(v => v.id == vacationId);

    if (!vac) {
        console.warn("⚠️ Kunde inte hitta semester:", vacationId);
        return;
    }

    // 🔥 säkerställ state
    window.AppState = window.AppState || {};
    window.AppState.editingVacationId = vac.id;

    console.log("✏️ Edit mode:", vac.id);

    // 🔥 fyll UI
    const empEl = document.getElementById("employeeSelect");
    const startEl = document.getElementById("startDate");
    const endEl = document.getElementById("endDate");

    if (empEl) empEl.value = vac.employee_id;
    if (startEl) startEl.value = vac.start;
    if (endEl) endEl.value = vac.end;
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
               📅 EVENTS
            ========================================== */

            events(fetchInfo, successCallback) {
                try {
                    const rawEvents = eventsFn() || [];

                    successCallback(rawEvents);

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
               🌡 DAY CELLS
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
               🖱 INTERACTIONS
            ========================================== */

            dateClick(info) {

                // 🔥 säkerställ state
                window.AppState = window.AppState || {};
                window.AppState.editingVacationId = null;

                const startInput = document.getElementById("startDate");
                const endInput = document.getElementById("endDate");

                if (startInput && endInput) {
                    startInput.value = info.dateStr;
                    endInput.value = info.dateStr;

                    requestAnimationFrame(() => {
                        endInput.focus();
                    });
                }

                openModal?.("vacationModal");
            },

            eventClick(info) {

                const vacId = info.event.extendedProps?.vacationId;

                if (!vacId) {
                    console.warn("⚠️ saknar vacationId");
                    return;
                }

                // 🔥 edit flow
                loadVacationIntoForm(vacId);

                openModal?.("vacationModal");
            },

            eventMouseEnter(info) {
                info.el.style.cursor = "pointer";
            }

        });

        calendar.render();

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
   🔄 REFRESH
========================================== */

window.refreshCalendar = function () {
    try {
        if (!calendar) return;

        calendar.refetchEvents();

        requestAnimationFrame(() => {
            calendar.rerenderEvents?.();
        });

        requestAnimationFrame(() => {
            window.calendarActions?.buildEventCache();
        });

    } catch (err) {
        console.error("💥 refreshCalendar error:", err);
    }
};
