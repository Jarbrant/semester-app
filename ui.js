/* ==========================================
   🪟 MODAL & UI-HANTERING (Produktion)
========================================== */

// Öppna vald modal
window.openModal = function (id) {
    // Stäng alla öppna modaler
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove("active");
    });

    const modal = document.getElementById(id);
    const overlay = document.getElementById("modalOverlay");
    if (!modal || !overlay) return;

    // === Patch: Dynamiskt HTML-innehåll för vacation-modal ===
    if (id === "vacationModal") {
        setVacationModalContent();
        populateEmployeeSelect();
        resetVacationModalFields();
        setupVacationModalEventListeners();
    }

    modal.classList.add("active");
    overlay.style.display = "block";

    // Lås kalendern i bakgrunden
    const calendar = document.querySelector(".fc");
    if (calendar) {
        calendar.style.pointerEvents = "none";
    }
};

// Stäng alla öppna modaler 
window.closeModal = function () {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove("active");
    });
    const overlay = document.getElementById("modalOverlay");
    if (overlay) overlay.style.display = "none";

    // Återaktivera kalenderns klick
    const calendar = document.querySelector(".fc");
    if (calendar) {
        calendar.style.pointerEvents = "auto";
    }
};

// === Skapa semester-formulär i modalen dynamiskt ===
function setVacationModalContent() {
    const modal = document.getElementById("vacationModal");
    if (modal && modal.innerHTML.trim() === "") {
        modal.innerHTML = `
          <div class="modal-content">
            <button class="close" onclick="closeModal()">×</button>
            <h3>Lägg till semester</h3>
            <select id="employeeSelect"></select>
            <input type="date" id="startDate" placeholder="YYYY-MM-DD">
            <input type="date" id="endDate" placeholder="YYYY-MM-DD">
            <button class="primary-btn" onclick="trySubmitVacation()">Spara</button>
            <p id="warning"></p>
          </div>
        `;
    }
}

// === Fyll select-boxen med anställda ===
function populateEmployeeSelect() {
    if (!window.getEmployees) return;
    const employees = window.getEmployees();
    const select = document.getElementById("employeeSelect");
    if (select) {
        select.innerHTML = "";
        employees.forEach(emp => {
            const opt = document.createElement("option");
            opt.value = emp.id;
            opt.textContent = emp.name;
            select.appendChild(opt);
        });
    }
}

// === Nollställ fält i vacation-modal vid öppning ===
function resetVacationModalFields() {
    const start = document.getElementById("startDate");
    const end = document.getElementById("endDate");
    if (start) start.value = "";
    if (end) end.value = "";
    const warning = document.getElementById("warning");
    if (warning) warning.textContent = "";
}

// === Rätta eventhantering i modal-formuläret ===
function setupVacationModalEventListeners() {
    // Förhindra bubbling
    ["startDate", "endDate", "employeeSelect"].forEach(id => {
        const el = document.getElementById(id);
        if (el && !el._bubblePatched) {
            el.addEventListener("mousedown", (e) => {
                e.stopPropagation();
            });
            el._bubblePatched = true;
        }
    });
    // Autofyll dagens datum vid fokus om tomt
    document.getElementById("startDate")?.addEventListener("focus", (e) => {
        if (!e.target.value) {
            e.target.value = new Date().toISOString().slice(0, 10);
        }
    });
    document.getElementById("endDate")?.addEventListener("focus", (e) => {
        if (!e.target.value) {
            e.target.value = new Date().toISOString().slice(0, 10);
        }
    });
    // Enter för submit
    ["employeeSelect", "startDate", "endDate"].forEach(id => {
        const el = document.getElementById(id);
        if (el && !el._enterHandlerPatched) {
            el.addEventListener("keypress", function (e) {
                if (e.key === "Enter") window.trySubmitVacation();
            });
            el._enterHandlerPatched = true;
        }
    });
}

// Stäng modal om man klickar på overlay
document.getElementById("modalOverlay")?.addEventListener("click", () => {
    window.closeModal();
});

// Stäng modal på Esc-tangent
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        window.closeModal();
    }
});

/* =========================
   VALIDERING FÖR SUBMIT
========================= */
window.trySubmitVacation = function () {
    const emp = document.getElementById("employeeSelect")?.value;
    const start = document.getElementById("startDate")?.value;
    const end = document.getElementById("endDate")?.value;
    const warning = document.getElementById("warning");

    if (!emp || !start || !end) {
        if (warning) warning.textContent = "Fyll i alla fält!";
        return;
    } else {
        if (warning) warning.textContent = "";
        addVacation(); // Din existerande logik!
        closeModal();
    }
};
