(function () {

    console.log("🔗 Calendar filter hook loaded");

    // 🔥 Spara original
    const originalGetVacations = window.getVacations;

    // 🔥 Override
    window.getVacations = function () {

        const base = originalGetVacations();

        // om inget filter finns → returnera original
        if (!window.FilterSystem) {
            return base;
        }

        const state = window.FilterSystem.getState();

        let result = [...base];

        if (state.employee) {
            result = result.filter(v => v.employee_id == state.employee);
        }

        if (state.from) {
            result = result.filter(v => v.start >= state.from);
        }

        if (state.to) {
            result = result.filter(v => v.end <= state.to);
        }

        if (state.group) {
            const employees = getEmployees();

            const ids = employees
                .filter(e => e.group_id == state.group)
                .map(e => e.id);

            result = result.filter(v => ids.includes(v.employee_id));
        }

        return result;
    };

})();
