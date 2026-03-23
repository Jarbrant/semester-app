(function () {

    console.log("🔴 Conflict system loaded");

    function isConflict(vacation, all) {
        return all.some(v =>
            v.employee_id == vacation.employee_id &&
            v.id !== vacation.id &&
            !(vacation.end < v.start || vacation.start > v.end)
        );
    }

    function isGroupOverbooked(vacation, all) {

        const employees = getEmployees();
        const groups = getGroups?.() || [];

        const emp = employees.find(e => e.id == vacation.employee_id);
        if (!emp || !emp.group_id) return false;

        const group = groups.find(g => g.id == emp.group_id);
        if (!group) return false;

        const max = parseInt(group.maxConcurrent) || 999;

        let count = 0;

        all.forEach(v => {
            const e = employees.find(emp => emp.id == v.employee_id);
            if (!e || e.group_id != group.id) return;

            if (!(vacation.end < v.start || vacation.start > v.end)) {
                count++;
            }
        });

        return count > max;
    }

    /* ==========================================
       🪝 HOOK CALENDAR EVENTS
    ========================================== */

    const originalGetVacations = window.getVacations;

    window.getVacations = function () {

        const data = originalGetVacations();

        return data.map(v => {

            const all = data;

            let color = "#22c55e"; // 🟢 default

            if (isConflict(v, all)) {
                color = "#ef4444"; // 🔴 konflikt
            } else if (isGroupOverbooked(v, all)) {
                color = "#f59e0b"; // 🟠 grupp över max
            }

            return {
                ...v,
                color
            };
        });
    };

})();
