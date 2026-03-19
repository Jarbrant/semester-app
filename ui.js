/* ==========================================
   🪟 MODAL & UI-HANTERING (PRODUKTIONSKLAR)
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

    // === PATCH: Rendera innehåll vid behov ===
    if (id === "vacationModal") {
        setVacationModalContent();
        populateEmployeeSelect();
        resetVacationModalFields();
        setupVacationModalEventListeners();
    }
    if (id === "employeeModal") {
        setEmployeeModalContent();
        resetEmployeeModalFields();
        setupEmployeeModalEventListeners();
    }

    modal.classList.add("active");
    overlay.style.display = "block";

    // Lås kalender-klick
    const calendar = document.querySelector(".fc");
    if (calendar) {
        calendar.style.pointerEvents = "none";
    }
};

// Stäng alla modaler
window.closeModal = function () {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove("active");
    });
    const overlay = document.getElementById("modalOverlay");
    if (overlay) overlay.style.display = "none";

    // Aktivera kalender-klick
    const calendar = document.querySelector(".fc");
    if (calendar) {
        calendar.style.pointerEvents = "auto";
    }
};

/* ==========================================
   📅 SEMESTER-MODAL (dynamic content)
========================================== */
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
function resetVacationModalFields() {
    const start = document.getElementById("startDate");
    const end = document.getElementById("endDate");
    if (start) start.value = "";
    if (end) end.value = "";
    const warning = document.getElementById("warning");
    if (warning) warning.textContent = "";
}
function setupVacationModalEventListeners() {
    ["startDate", "endDate", "employeeSelect"].forEach(id => {
        const el = document.getElementById(id);
        if (el && !el._bubblePatched) {
            el.addEventListener("mousedown", (e) => {
                e.stopPropagation();
            });
            el._bubblePatched = true;
        }
    });
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
    addVacation(); // Din existerande logik!
    closeModal();
};

/* ==========================================
   👥 PERSONAL-MODAL (dynamic content)
========================================== */
function setEmployeeModalContent() {
    const modal = document.getElementById("employeeModal");
    if (modal && modal.innerHTML.trim() === "") {
        modal.innerHTML = `
          <div class="modal-content">
            <button class="close" onclick="closeModal()">×</button>
            <h3>Lägg till personal</h3>
            <p id="employeeWarning" style="color:#e11d48;font-size:15px"></p>
            <input type="text" id="employeeName" placeholder="Namn">
            <button class="primary-btn" onclick="tryAddEmployee()">Spara</button>
          </div>
        `;
    }
}
function resetEmployeeModalFields() {
    const name = document.getElementById("employeeName");
    if (name) name.value = "";
    const warning = document.getElementById("employeeWarning");
    if (warning) warning.textContent = "";
}
function setupEmployeeModalEventListeners() {
    const name = document.getElementById("employeeName");
    if (name && !name._enterHandlerPatched) {
        name.addEventListener("keypress", function (e) {
            if (e.key === "Enter") window.tryAddEmployee();
        });
        name._enterHandlerPatched = true;
    }
}
window.tryAddEmployee = function () {
    const name = document.getElementById("employeeName")?.value.trim();
    const warning = document.getElementById("employeeWarning");
    if (!name) {
        if (warning) warning.textContent = "Du måste ange ett namn!";
        return;
    }
    if (warning) warning.textContent = "";
    addEmployee(name); // Funktion för att lägga till personal
    closeModal();
};

/* ==========================================
   ÖVRIG MODAL-HANTERING
========================================== */

// Klicka på overlay = stäng
document.getElementById("modalOverlay")?.addEventListener("click", () => {
    window.closeModal();
});
// ESC = stäng
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        window.closeModal();
    }
});
