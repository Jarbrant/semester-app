/* ==========================================
   🧠 SAFE DOM HELPERS
========================================== */

function getEl(id) {
    return document.getElementById(id);
}

function setValue(id, value) {
    const el = getEl(id);
    if (el) el.value = value;
}

/* ==========================================
   📊 BALANS UI
========================================== */

function updateVacationBalanceUI() {
    const empId = getEl("employeeSelect")?.value;
    const box = getEl("vacationBalanceInfo");

    if (!empId || !box) return;

    const year = getSelectedYear?.();
    const balance = getVacationBalance?.(empId, year);

    if (!balance) return;

    box.innerHTML = `
        📊 ${balance.used} / ${balance.total} dagar  
        <br>💡 Kvar: ${balance.remaining}
    `;
}

/* ==========================================
   🪟 MODAL SYSTEM (SMART SEARCH FIXED)
========================================== */

window.openModal = function (id) {

    const modal = getEl(id);
    const overlay = getEl("modalOverlay");

    if (!modal || !overlay) {
        console.warn("⚠️ Modal saknas:", id);
        return;
    }

    document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));

    modal.classList.add("active");
    overlay.style.display = "block";

    /* ==========================================
       👤 EMPLOYEE MODAL
    ========================================== */

    if (id === "employeeModal") {
        refreshGroupSelect?.();
        renderEmployeeList?.();
    }

    /* ==========================================
       📅 VACATION MODAL (🔥 FIXAD)
    ========================================== */

    if (id === "vacationModal") {

        const searchInput = getEl("employeeSearch");

        if (!window.AppState?.editingVacationId) {

            // 🔥 reset input
            setValue("employeeSearch", "");

            // 🔥 tvinga initial state
            window.refreshEmployeeSelect?.("");
        }

        // 🔥 säkerställ att input trigger alltid finns
        if (searchInput && !searchInput.dataset.bound) {

            searchInput.addEventListener("input", (e) => {
                window.refreshEmployeeSelect?.(e.target.value);
            });

            searchInput.dataset.bound = "true";
        }

        // 🔥 auto focus för bättre UX
        setTimeout(() => {
            searchInput?.focus();
        }, 50);

        updateVacationBalanceUI?.();
    }
};

/* ==========================================
   ❌ CLOSE MODAL
========================================== */

window.closeModal = function (id) {

    if (id) {
        getEl(id)?.classList.remove("active");
    } else {
        document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
    }

    const overlay = getEl("modalOverlay");
    if (overlay) overlay.style.display = "none";

    if (window.AppState) {
        window.AppState.editingVacationId = null;
    }
};

/* ==========================================
   ⚡ AUTOSAVE
========================================== */

let lastAutoSave = null;

function autoSaveVacation() {

    if (window.AppState?.editingVacationId) return;

    const emp = getEl("employeeSelect")?.value;
    const start = getEl("startDate")?.value;
    const end = getEl("endDate")?.value;

    if (!emp || !start || !end) return;

    const key = `${emp}_${start}_${end}`;
    if (lastAutoSave === key) return;

    if (!canAddVacation?.(emp, start, end)) return;

    lastAutoSave = key;

    console.log("⚡ Autosave");

    addVacation?.();
    refreshCalendar?.();
}

/* ==========================================
   🧠 VALIDATION
========================================== */

function validateVacationInput() {
    const emp = getEl("employeeSelect")?.value;
    const start = getEl("startDate")?.value;
    const end = getEl("endDate")?.value;
    const warning = getEl("warning");

    if (!emp || !start || !end) return;

    if (!canAddVacation?.(emp, start, end)) {
        if (warning) warning.textContent = "⚠️ För många semesterdagar!";
    } else {
        if (warning) warning.textContent = "";
    }
}

/* ==========================================
   🧠 SUCCESS
========================================== */

function showSuccess(message, targetId = "warning") {
    const el = getEl(targetId);
    if (!el) return;

    el.style.color = "#16a34a";
    el.textContent = "✅ " + message;

    setTimeout(() => {
        el.textContent = "";
        el.style.color = "";
    }, 2000);
}

/* ==========================================
   👤 ADD EMPLOYEE
========================================== */

window.tryAddEmployee = function () {

    const name = getEl("employeeName")?.value?.trim();
    const groupId = getEl("employeeGroupSelect")?.value;
    const vacationDays = getEl("employeeVacationDays")?.value || 25;
    const warning = getEl("employeeWarning");

    if (!name) {
        if (warning) warning.textContent = "Du måste ange ett namn!";
        return;
    }

    addEmployee?.(name, groupId || null, vacationDays);

    if (warning) warning.textContent = "";

    showSuccess(`${name} sparad`, "employeeWarning");

    setValue("employeeName", "");
    setValue("employeeVacationDays", "");

    renderEmployeeList?.();
    refreshEmployeeSelect?.();

    closeModal?.("employeeModal");
};

/* ==========================================
   🔽 GROUP SELECT
========================================== */

window.refreshGroupSelect = function () {
    const select = getEl("employeeGroupSelect");
    if (!select) return;

    const groups = getGroups?.() || [];

    select.innerHTML = `<option value="">Ingen grupp</option>`;

    groups.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g.id;
        opt.textContent = `${g.name} (max ${g.maxConcurrent})`;
        select.appendChild(opt);
    });
};

/* ==========================================
   📅 EMPLOYEE SELECT (FINAL FIXED)
========================================== */

window.refreshEmployeeSelect = function (filter = "") {

    const select = document.getElementById("employeeSelect");
    if (!select) {
        console.warn("⚠️ employeeSelect saknas i DOM");
        return;
    }

    const employees = getEmployees?.() || [];

    const query = (filter || "").trim().toLowerCase();

    select.innerHTML = "";

    // 🔥 visa inget innan 2 tecken
    if (query.length < 2) {

        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "Skriv minst 2 bokstäver...";
        select.appendChild(opt);

        return;
    }

    const filtered = employees.filter(e =>
        e.name?.toLowerCase().includes(query)
    );

    // ❌ ingen träff
    if (!filtered.length) {

        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "Ingen träff";
        select.appendChild(opt);

        return;
    }

    // ✅ resultat
    filtered.forEach(emp => {
        const opt = document.createElement("option");
        opt.value = emp.id;
        opt.textContent = emp.name;
        select.appendChild(opt);
    });

    select.selectedIndex = 0;
};

/* ==========================================
   🔄 EMPLOYEE LIST (🔥 PATCHED)
========================================== */

window.renderEmployeeList = function () {
    const list = getEl("employeeList");
    if (!list) return;

    const employees = getEmployees?.() || [];
    const groups = getGroups?.() || [];
    const year = (typeof getSelectedYear === "function")
    ? getSelectedYear()
    : new Date().getFullYear();

    list.innerHTML = "";

    employees.forEach(emp => {

        const group = groups.find(g => g.id == emp.group_id);
        const balance = getVacationBalance?.(emp.id, year);

        const used = balance?.used || 0;
        const total = balance?.total || emp.vacationDays || 25;
        const percent = balance?.percent || 0;

        const color = getVacationStatusColor?.(percent) || "#22c55e";

        const li = document.createElement("li");

        li.className = "employee-item";

        li.innerHTML = `
            <div class="employee-row">
                <div class="employee-name">
                    <strong>${emp.name}</strong>
                    ${group ? `<small> (${group.name})</small>` : ""}
                </div>

                <div class="employee-meta">
                    ${used} / ${total}
                </div>
            </div>

            <div class="employee-bar">
                <div class="employee-bar-fill" style="width:${percent}%; background:${color};"></div>
            </div>

            <div class="employee-edit-icon">✏️</div>
        `;

        /* 🔥 STABIL CLICK */
        li.addEventListener("click", () => {
            openEditEmployee?.(emp.id);
        });

        list.appendChild(li);
    });
};

/* ==========================================
   📅 VACATION
========================================== */

window.trySubmitVacation = function () {

    addVacation?.();

    showSuccess("Semestern sparad", "warning");

    closeModal?.("vacationModal");
};

/* ==========================================
   🔍 EVENTS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    getEl("employeeSearch")?.addEventListener("input", e => {
        refreshEmployeeSelect?.(e.target.value);
    });

    getEl("employeeSelect")?.addEventListener("change", autoSaveVacation);
    getEl("startDate")?.addEventListener("change", autoSaveVacation);
    getEl("endDate")?.addEventListener("change", autoSaveVacation);

    getEl("startDate")?.addEventListener("change", validateVacationInput);
    getEl("endDate")?.addEventListener("change", validateVacationInput);

    getEl("undoBtn")?.addEventListener("click", () => {
        window.HistoryManager?.undo();
    });

    getEl("modalOverlay")?.addEventListener("click", () => closeModal());

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeModal();
    });

});
