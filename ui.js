// ================================
// MODALLOGIK & FELHANTERING
// ================================

// Öppna rätt modal
window.openModal = function (id) {
    // Stäng alla andra modaler
    document.querySelectorAll('.modal').forEach(m => m.classList.remove("active"));
    const modal = document.getElementById(id);
    const overlay = document.getElementById("modalOverlay");
    if (!modal || !overlay) return;
    modal.classList.add("active");
    overlay.style.display = "block";
    // Nolla fält i modaler
    if (id === "employeeModal") {
        document.getElementById("employeeName").value = "";
        document.getElementById("employeeWarning").textContent = "";
    }
    if (id === "vacationModal") {
        document.getElementById("warning").textContent = "";
        document.getElementById("startDate").value = "";
        document.getElementById("endDate").value = "";
    }
    // Lås kalendern i bakgrunden om FullCalendar används
    const calendar = document.querySelector(".fc");
    if (calendar) calendar.style.pointerEvents = "none";
};

// Stäng alla modaler
window.closeModal = function () {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove("active"));
    const overlay = document.getElementById("modalOverlay");
    if (overlay) overlay.style.display = "none";
    const calendar = document.querySelector(".fc");
    if (calendar) calendar.style.pointerEvents = "auto";
};

// Klicka på overlay = stäng modal
document.getElementById("modalOverlay")?.addEventListener("click", closeModal);

// ESC = stäng
document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
});

// ================================
// SÄKER & ANVÄNDARVÄNLIG Spara-funktion
// ================================

window.tryAddEmployee = function () {
    const name = document.getElementById("employeeName")?.value.trim();
    const warning = document.getElementById("employeeWarning");
    if (!name) {
        if (warning) warning.textContent = "Du måste ange ett namn!";
        return;
    }
    if (warning) warning.textContent = "";
    // Din ursprungliga addEmployee-funktion SKA ta emot namnet!
    addEmployee(name);
    closeModal();
};

window.trySubmitVacation = function () {
    const emp = document.getElementById("employeeSelect")?.value;
    const start = document.getElementById("startDate")?.value;
    const end = document.getElementById("endDate")?.value;
    const warning = document.getElementById("warning");
    if (!emp || !start || !end) {
        if (warning) warning.textContent = "Fyll i alla fält!";
        return;
    }
    warning.textContent = "";
    // Din ursprungliga addVacation-funktion
    addVacation();
    closeModal();
};

// ================================
// ENTER-KORTKOMMANDON FÖR SNABBHET
// ================================

document.getElementById("employeeName")?.addEventListener("keypress", function(e){
    if(e.key === "Enter") window.tryAddEmployee();
});
document.getElementById("startDate")?.addEventListener("keypress", function(e){
    if(e.key === "Enter") window.trySubmitVacation();
});
document.getElementById("endDate")?.addEventListener("keypress", function(e){
    if(e.key === "Enter") window.trySubmitVacation();
});
document.getElementById("employeeSelect")?.addEventListener("keypress", function(e){
    if(e.key === "Enter") window.trySubmitVacation();
});

// ================================
// FYLL ANSTÄLLDA-LISTAN VID ÖPPNING (om ni använder dynamisk personal)
// ================================
window.refreshEmployeeSelect = function () {
    if(!window.getEmployees) return;
    const employees = window.getEmployees();
    const select = document.getElementById("employeeSelect");
    if(select){
        select.innerHTML = "";
        employees.forEach(emp => {
            const opt = document.createElement("option");
            opt.value = emp.id;
            opt.textContent = emp.name;
            select.appendChild(opt);
        });
    }
};

// Kör refreshEmployeeSelect varje gång semester-modalen öppnas
document.querySelectorAll("[onclick*='vacationModal']").forEach(btn =>
    btn.addEventListener("click", window.refreshEmployeeSelect)
);
