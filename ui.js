/* ==========================================
   🧩 GROUP UI
========================================== */

window.tryAddGroup = function () {
    const name = document.getElementById("groupName")?.value.trim();
    const color = document.getElementById("groupColor")?.value;
    const limit = document.getElementById("groupLimit")?.value;
    const warning = document.getElementById("groupWarning");

    if (!name) {
        warning.textContent = "Ange gruppnamn";
        return;
    }

    addGroup(name, color, limit || 1);

    warning.textContent = "";
    closeModal();
};

/* ==========================================
   🔽 GROUP SELECT
========================================== */

window.refreshGroupSelect = function () {
    const select = document.getElementById("employeeGroupSelect");
    if (!select || typeof getGroups !== "function") return;

    const groups = getGroups();

    select.innerHTML = "";

    groups.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g.id;
        opt.textContent = `${g.name} (max ${g.maxConcurrent})`;
        select.appendChild(opt);
    });

    if (groups.length > 0) {
        select.selectedIndex = 0;
    }
};

/* ==========================================
   👤 EMPLOYEE
========================================== */

window.tryAddEmployee = function () {
    const name = document.getElementById("employeeName")?.value.trim();
    const groupId = document.getElementById("employeeGroupSelect")?.value;
    const warning = document.getElementById("employeeWarning");

    if (!name) {
        warning.textContent = "Du måste ange ett namn!";
        return;
    }

    warning.textContent = "";

    addEmployee(name, groupId || null);

    closeModal();
};

/* ==========================================
   🪟 MODAL
========================================== */

window.openModal = function (id) {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove("active"));

    const modal = document.getElementById(id);
    const overlay = document.getElementById("modalOverlay");

    if (!modal || !overlay) return;

    modal.classList.add("active");
    overlay.style.display = "block";

    if (id === "employeeModal") {
        refreshGroupSelect();
    }
};

window.closeModal = function () {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove("active"));

    const overlay = document.getElementById("modalOverlay");
    if (overlay) overlay.style.display = "none";
};

/* ==========================================
   EVENTS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("modalOverlay")?.addEventListener("click", closeModal);

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeModal();
    });

});
