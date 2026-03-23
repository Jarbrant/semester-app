(function () {

    console.log("✏️ Employee edit UI loaded");

    function populateGroupSelect(selectedGroupId) {

        const select = document.getElementById("editEmployeeGroup");
        if (!select) return;

        const groups = getGroups?.() || [];

        select.innerHTML = `<option value="">Ingen grupp</option>`;

        groups.forEach(g => {
            const opt = document.createElement("option");
            opt.value = g.id;
            opt.textContent = g.name;

            if (String(g.id) === String(selectedGroupId)) {
                opt.selected = true;
            }

            select.appendChild(opt);
        });
    }

    /* ==========================================
       ✏️ OPEN EDIT
    ========================================== */

    window.openEditEmployee = function (id) {

        const employees = getEmployees?.() || [];
        const emp = employees.find(e => String(e.id) === String(id));

        if (!emp) return;

        document.getElementById("editEmployeeId").value = emp.id;
        document.getElementById("editEmployeeName").value = emp.name || "";
        document.getElementById("editEmployeeVacationDays").value = emp.vacationDays || 25;

        populateGroupSelect(emp.group_id);

        openModal?.("editEmployeeModal");
    };

    /* ==========================================
       💾 SAVE
    ========================================== */

    function handleSave() {

        const id = document.getElementById("editEmployeeId").value;
        const name = document.getElementById("editEmployeeName").value.trim();
        const days = document.getElementById("editEmployeeVacationDays").value;
        const groupId = document.getElementById("editEmployeeGroup").value;

        if (!name) {
            alert("Namn krävs");
            return;
        }

        if (typeof updateEmployee !== "function") {
            console.error("❌ updateEmployee saknas");
            return;
        }

        updateEmployee(id, {
            name,
            vacationDays: parseInt(days) || 25,
            group_id: groupId || null
        });

        renderEmployeeList?.();
        refreshCalendar?.();

        closeModal?.("editEmployeeModal");
    }

    /* ==========================================
       🗑 DELETE
    ========================================== */

    function handleDelete() {

        const id = document.getElementById("editEmployeeId").value;

        if (!confirm("Ta bort denna person?")) return;

        removeEmployee?.(id);

        renderEmployeeList?.();
        refreshCalendar?.();

        closeModal?.("editEmployeeModal");
    }

    /* ==========================================
       🚀 INIT
    ========================================== */

    function init() {

        document.getElementById("updateEmployeeBtn")
            ?.addEventListener("click", handleSave);

        document.getElementById("deleteEmployeeBtn")
            ?.addEventListener("click", handleDelete);
    }

    document.addEventListener("DOMContentLoaded", init);

})();
