// ================================
// INIT (VIKTIGT - ALLT EFTER DOM)
// ================================
document.addEventListener("DOMContentLoaded", () => {

    // 🔥 FIX: stoppa bubbling ENDAST på click (inte focus)
    ["startDate", "endDate"].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        el.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    });

    // Overlay click
    document.getElementById("modalOverlay")?.addEventListener("click", closeModal);

    // ESC close
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeModal();
    });

});

// ================================
// MODALLOGIK
// ================================

window.openModal = function (id) {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove("active"));

    const modal = document.getElementById(id);
    const overlay = document.getElementById("modalOverlay");

    if (!modal || !overlay) return;

    modal.classList.add("active");
    overlay.style.display = "block";

    // 🔥 Refresh employees korrekt
    if (id === "vacationModal") {
        window.refreshEmployeeSelect?.();
    }

    // Reset fält
    if (id === "employeeModal") {
        document.getElementById("employeeName").value = "";
        document.getElementById("employeeWarning").textContent = "";
    }

    if (id === "vacationModal") {
        document.getElementById("warning").textContent = "";
        document.getElementById("startDate").value = "";
        document.getElementById("endDate").value = "";
    }

    // Disable calendar clicks
    const calendar = document.querySelector(".fc");
    if (calendar) calendar.style.pointerEvents = "none";
};

window.closeModal = function () {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove("active"));

    const overlay = document.getElementById("modalOverlay");
    if (overlay) overlay.style.display = "none";

    const calendar = document.querySelector(".fc");
    if (calendar) calendar.style.pointerEvents = "auto";
};

// ================================
// FORM LOGIK
// ================================

window.tryAddEmployee = function () {
    const name = document.getElementById("employeeName")?.value.trim();
    const warning = document.getElementById("employeeWarning");

    if (!name) {
        if (warning) warning.textContent = "Du måste ange ett namn!";
        return;
    }

    warning.textContent = "";

    addEmployee(name);
    closeModal();
};

window.trySubmitVacation = function () {
    const emp = document.getElementById("employeeSelect")?.value;
    const start = document.getElementById("startDate")?.value;
    const end = document.getElementById("endDate")?.value;
    const warning = document.getElementById("warning");

    if (!emp || !start || !end) {
        warning.textContent = "Fyll i alla fält!";
        return;
    }

    warning.textContent = "";

    addVacation();
    closeModal();
};

// ================================
// ENTER SHORTCUTS
// ================================

document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    const active = document.activeElement?.id;

    if (active === "employeeName") {
        tryAddEmployee();
    }

    if (["startDate", "endDate", "employeeSelect"].includes(active)) {
        trySubmitVacation();
    }
});

// ================================
// EMPLOYEE LIST
// ================================

window.refreshEmployeeSelect = function () {
    if (!window.getEmployees) return;

    const employees = window.getEmployees();
    const select = document.getElementById("employeeSelect");

    if (!select) return;

    select.innerHTML = "";

    employees.forEach(emp => {
        const opt = document.createElement("option");
        opt.value = emp.id;
        opt.textContent = emp.name;
        select.appendChild(opt);
    });
};
