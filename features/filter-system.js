(function () {

    const state = {
        employee: null,
        from: null,
        to: null,
        group: null
    };

    function getFilteredVacations() {

        let vacations = getVacations();

        if (state.employee) {
            vacations = vacations.filter(v => v.employee_id == state.employee);
        }

        if (state.from) {
            vacations = vacations.filter(v => v.start >= state.from);
        }

        if (state.to) {
            vacations = vacations.filter(v => v.end <= state.to);
        }

        if (state.group) {
            const employees = getEmployees();

            const ids = employees
                .filter(e => e.group_id == state.group)
                .map(e => e.id);

            vacations = vacations.filter(v => ids.includes(v.employee_id));
        }

        return vacations;
    }

    function applyFilters() {
        console.log("🔍 Filter applied:", state);

        const filtered = getFilteredVacations();

        // 🔥 Hook in i din kalender
        if (window.renderCalendarWithData) {
            window.renderCalendarWithData(filtered);
        } else {
            // fallback
            refreshCalendar?.();
        }
    }

    function resetFilters() {
        state.employee = null;
        state.from = null;
        state.to = null;
        state.group = null;

        applyFilters();
    }

    /* ==========================================
       🌐 PUBLIC API
    ========================================== */

    window.FilterSystem = {
        setEmployee(id) {
            state.employee = id || null;
            applyFilters();
        },
        setDateRange(from, to) {
            state.from = from || null;
            state.to = to || null;
            applyFilters();
        },
        setGroup(id) {
            state.group = id || null;
            applyFilters();
        },
        reset: resetFilters,
        getState: () => ({ ...state })
    };

})();
