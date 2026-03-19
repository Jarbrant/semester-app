/* ==========================================
   🧩 GROUP UI (ROBUST)
========================================== */

window.tryAddGroup = function () {
    const name = document.getElementById("groupName")?.value?.trim();
    const color = document.getElementById("groupColor")?.value;
    const limit = document.getElementById("groupLimit")?.value;
    const warning = document.getElementById("groupWarning");

    if (!name) {
        if (warning) warning.textContent = "Ange gruppnamn";
        return;
    }

    if (typeof addGroup === "function") {
        addGroup(name, color, limit || 1);
    } else {
        console.error("❌ addGroup saknas");
    }

    if (warning) warning.textContent = "";

    closeModal();
};

/* ==========================================
   🔽 GROUP SELECT
========================================== */

window.refreshGroupSelect = function () {
    const select = document.getElementById("employeeGroupSelect");
    if (!select) return;

    if (typeof getGroups !== "function") {
        console.warn("⚠️ getGroups saknas");
        select.innerHTML = "";
        return;
    }

    const groups = getGroups();

    select.innerHTML = "";

    if (!groups.length) {
        const opt = document.createElement("option");
        opt.textContent = "Inga grupper";
        opt.value = "";
        select.appendChild(opt);
        return;
    }

    groups.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g.id;
        opt.textContent = `${g.name} (max ${g.maxConcurrent})`;
        select.appendChild(opt);
    });

    select.selectedIndex = 0;
};

/* ==========================================
   👤 EMPLOYEE
========================================== */

window.tryAddEmployee = function () {
    const name = document.getElementById("employeeName")?.value?.trim();
    const groupId = document.getElementById("employeeGroupSelect")?.value;
    const warning = document.getElementById("employeeWarning");

    if (!name) {
        if (warning) warning.textContent = "Du måste ange ett namn!";
        return;
    }

    if (warning) warning.textContent = "";

    if (typeof addEmployee === "function") {
        addEmployee(name, groupId || null);
    } else {
        console.error("❌ addEmployee saknas");
    }

    closeModal();
};

/* ==========================================
   📅 VACATION (behåll kompatibilitet)
========================================== */

window.trySubmitVacation = function () {
    const emp = document.getElementById("employeeSelect")?.value;
    const start = document.getElementById("startDate")?.value;
    const end = document.getElementById("endDate")?.value;
    const warning = document.getElementById("warning");

    if (!emp || !start || !end) {
        if (warning) warning.textContent = "Fyll i alla fält!";
        return;
    }

    if (warning) warning.textContent = "";

    if (typeof addVacation === "function") {
        addVacation();
    } else {
        console.error("❌ addVacation saknas");
    }

    closeModal();
};

/* ==========================================
   🪟 MODAL (STABIL)
========================================== */

window.openModal = function (id) {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove("active"));

    const modal = document.getElementById(id);
    const overlay = document.getElementById("modalOverlay");

    if (!modal || !overlay) {
        console.warn("⚠️ Modal eller overlay saknas:", id);
        return;
    }

    modal.classList.add("active");
    overlay.style.display = "block";

    // 🔥 Refresh beroende på modal
    if (id === "employeeModal") {
        refreshGroupSelect();
    }

    if (id === "vacationModal" && typeof refreshEmployeeSelect === "function") {
        refreshEmployeeSelect();
    }
};

window.closeModal = function () {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove("active"));

    const overlay = document.getElementById("modalOverlay");
    if (overlay) overlay.style.display = "none";
};

/* ==========================================
   EVENTS (SAFE INIT)
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // Overlay click
    document.getElementById("modalOverlay")?.addEventListener("click", closeModal);

    // ESC close
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeModal();
    });

});
