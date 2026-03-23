(function () {

    console.log("🏷️ Badge system loaded");

    function hasConflict(v, all) {
        return all.some(x =>
            x.employee_id == v.employee_id &&
            x.id !== v.id &&
            !(v.end < x.start || v.start > x.end)
        );
    }

    function isGroupOverload(v, all) {

        const employees = getEmployees();
        const groups = getGroups?.() || [];

        const emp = employees.find(e => e.id == v.employee_id);
        if (!emp?.group_id) return false;

        const group = groups.find(g => g.id == emp.group_id);
        if (!group) return false;

        const max = parseInt(group.maxConcurrent) || 999;

        let count = 0;

        all.forEach(x => {
            const e = employees.find(emp => emp.id == x.employee_id);
            if (!e || e.group_id != group.id) return;

            if (!(v.end < x.start || v.start > x.end)) {
                count++;
            }
        });

        return count > max;
    }

    /* ==========================================
       🪝 HOOK EVENT BUILDER (INTE core!)
    ========================================== */

    const originalGetCalendarEvents = window.getCalendarEvents;

    window.getCalendarEvents = function () {

        const events = originalGetCalendarEvents();

        const vacations = getVacations();

        return events.map(ev => {

            const vacId = ev.extendedProps?.vacationId;
            const vac = vacations.find(v => v.id == vacId);

            if (!vac) return ev;

            const all = vacations;

            let prefix = "";

            if (hasConflict(vac, all)) {
                prefix = "⚠️ ";
            } else if (isGroupOverload(vac, all)) {
                prefix = "🔥 ";
            }

            // 🔥 subtil förbättring (inte skrika)
            return {
                ...ev,
                title: prefix + ev.title
            };
        });
    };

})();
