/* ==========================================
   📅 CALENDAR (PRO VERSION)
========================================== */

let calendar;

window.renderCalendar = function() {
    const employees = getEmployees();
    const vacations = getVacations();

    const filter = document.getElementById("filter")?.value || "all";

    const events = vacations
        .filter(v => filter === "all" || v.employee_id == filter)
        .map(v => {
            const emp = employees.find(e => e.id == v.employee_id);

            return {
                id: v.id,
                title: emp?.name || "?",
                start: v.start,
                end: v.end,
                backgroundColor: emp?.color || "#1677ff"
            };
        });

    if (calendar) calendar.destroy();

    calendar = new FullCalendar.Calendar(
        document.getElementById("calendar"),
        {
            initialView: "dayGridMonth",
            editable: true, // 🔥 drag & drop

            events: events,

            // 🔥 DRAG & DROP UPDATE
            eventDrop: function(info) {
                updateVacation(info.event);
            },

            eventResize: function(info) {
                updateVacation(info.event);
            },

            // 🔥 DELETE (ADMIN ONLY)
            eventClick: function(info) {
                if (!isAdmin()) {
                    alert("Endast admin kan ta bort");
                    return;
                }

                if (confirm("Ta bort?")) {
                    deleteVacation(info.event.id);
                }
            }
        }
    );

    calendar.render();
};

// 🔄 uppdatera efter drag
function updateVacation(event) {
    let vacations = getVacations();

    vacations = vacations.map(v => {
        if (v.id == event.id) {
            return {
                ...v,
                start: event.startStr,
                end: event.endStr
            };
        }
        return v;
    });

    saveVacations(vacations);
}

// ❌ delete
function deleteVacation(id) {
    let vacations = getVacations();
    vacations = vacations.filter(v => v.id != id);

    saveVacations(vacations);
    renderCalendar();
}
