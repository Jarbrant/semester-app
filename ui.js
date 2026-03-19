/* ==========================================
   🪟 MODAL & UI-HANTERING (Produktion)
========================================== */

// Öppna vald modal
window.openModal = function (id) {
    // Stäng alla eventuella öppna modaler
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove("active");
    });

    const modal = document.getElementById(id);
    const overlay = document.getElementById("modalOverlay");
    if (!modal || !overlay) return;

    // Aktivera modal + overlay
    modal.classList.add("active");
    overlay.style.display = "block";

    // Lås kalendern i bakgrunden så den ej får klick
    const calendar = document.querySelector(".fc");
    if (calendar) {
        calendar.style.pointerEvents = "none";
    }

    // Om modal är vacationModal, fyll select-box dynamiskt om du har employee-data på global nivå
    if (id === "vacationModal") {
        populateEmployeeSelect();
        resetVacationModalFields();
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


// Hjälpfunktion: fyll select-boxen med aktuella anställda
function populateEmployeeSelect() {
    // Antag att du har window.getEmployees() eller liknande funktion för att hämta personal
    if (!window.getEmployees) return;
    const employees = window.getEmployees();
    const select = document.getElementById("employeeSelect");
    if (select) {
        select.innerHTML = ""; // Töm ev. gamla alternativ
        employees.forEach(emp => {
            const opt = document.createElement("option");
            opt.value = emp.id;
            opt.textContent = emp.name;
            select.appendChild(opt);
        });
    }
}

// Hjälpfunktion: nollställ fält i vacation-modal vid varje öppning
function resetVacationModalFields() {
    const start = document.getElementById("startDate");
    const end = document.getElementById("endDate");
    if (start) start.value = "";
    if (end) end.value = "";
    // Nollställ varningsmeddelanden också om du vill
    const warning = document.getElementById("warning");
    if (warning) warning.textContent = "";
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


// Fokusstyrning: lägg inte fokus på något direkt när modal öppnas.
// Det gör browsern naturligt när användaren klickar/tabbar in själv.

// Förhindra så att inga onödiga event-bubbling sker mellan datuminfälten/select
["startDate", "endDate", "employeeSelect"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener("mousedown", (e) => {
            e.stopPropagation();
        });
    }
});

// Extra: Fyll dagens datum automatiskt när datuminfälten får fokus (om tomt)
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


/* =========================
   VALIDERING (lika för både button och enter)
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

// Support: Enter ska även submitta om du står i formuläret
["employeeSelect", "startDate", "endDate"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener("keypress", function (e) {
            if (e.key === "Enter") window.trySubmitVacation();
        });
    }
});
