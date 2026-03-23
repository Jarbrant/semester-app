(function () {

    function populateEmployees() {
        const select = document.getElementById("filterEmployee");
        if (!select) return;

        const employees = getEmployees() || [];

        select.innerHTML = `<option value="">Alla</option>`;

        employees.forEach(e => {
            const opt = document.createElement("option");
            opt.value = e.id;
            opt.textContent = e.name;
            select.appendChild(opt);
        });
    }

    function populateGroups() {
        const select = document.getElementById("filterGroup");
        if (!select) return;

        const groups = getGroups?.() || [];

        select.innerHTML = `<option value="">Alla</option>`;

        groups.forEach(g => {
            const opt = document.createElement("option");
            opt.value = g.id;
            opt.textContent = g.name;
            select.appendChild(opt);
        });
    }

    function initFilterUI() {

        populateEmployees();
        populateGroups();

        document.getElementById("applyFilterBtn")?.addEventListener("click", () => {

            const emp = document.getElementById("filterEmployee")?.value;
            const group = document.getElementById("filterGroup")?.value;
            const from = document.getElementById("filterFrom")?.value;
            const to = document.getElementById("filterTo")?.value;

            window.FilterSystem.setEmployee(emp);
            window.FilterSystem.setGroup(group);
            window.FilterSystem.setDateRange(from, to);

            closeModal?.("filterModal");
        });

        document.getElementById("resetFilterBtn")?.addEventListener("click", () => {
            window.FilterSystem.reset();
            closeModal?.("filterModal");
        });
    }

    document.addEventListener("DOMContentLoaded", initFilterUI);

})();
