/* ==========================================
   🧠 SAFE DOM HELPERS
========================================== */

function getEl(id) {
    return document.getElementById(id);
}

function setValue(id, value) {
    const el = getEl(id);
    if (el) el.value = value ?? "";
}

/* ==========================================
   📊 BALANS UI
========================================== */

function updateVacationBalanceUI() {
    try {
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
    } catch (err) {
        console.error("❌ updateVacationBalanceUI error:", err);
    }
}

/* ==========================================
   🪟 MODAL SYSTEM (STABLE++)
========================================== */

window.openModal = function (id) {
    try {
        const modal = getEl(id);
        const overlay = getEl("modalOverlay");

        if (!modal || !overlay) {
            console.warn("⚠️ Modal saknas:", id);
            return;
        }

        document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));

        modal.classList.add("active");
        overlay.style.display = "block";

        if (id === "employeeModal") {
            refreshGroupSelect?.();
            renderEmployeeList?.();
        }

        if (id === "vacationModal") {

            const searchInput = getEl("employeeSearch");

            if (!window.AppState?.editingVacationId) {
                setValue("employeeSearch", "");
                refreshEmployeeSelect("");
            }

            searchInput?.focus();

            updateVacationBalanceUI?.();
        }

    } catch (err) {
        console.error("❌ openModal error:", err);
    }
};

/* ==========================================
   ❌ CLOSE MODAL
========================================== */

window.closeModal = function (id) {
    try {
        if (id) {
            getEl(id)?.classList.remove("active");
        } else {
            document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
        }

        getEl("modalOverlay")?.style && (getEl("modalOverlay").style.display = "none");

        if (window.AppState) {
            window.AppState.editingVacationId = null;
        }

    } catch (err) {
        console.error("❌ closeModal error:", err);
    }
};

/* ==========================================
   ⚡ AUTOSAVE (SAFE)
========================================== */

let lastAutoSave = null;

function autoSaveVacation() {
    try {
        if (window.AppState?.editingVacationId) return;

        const emp = getEl("employeeSelect")?.value;
        const start = getEl("startDate")?.value;
        const end = getEl("endDate")?.value;

        if (!emp || !start || !end) return;

        const key = `${emp}_${start}_${end}`;
        if (lastAutoSave === key) return;

        if (!canAddVacation?.(emp, start, end)) return;

        lastAutoSave = key;

        addVacation?.();
        refreshCalendar?.();

    } catch (err) {
        console.error("❌ autoSaveVacation error:", err);
    }
}

/* ==========================================
   🧠 VALIDATION
========================================== */

function validateVacationInput() {
    try {
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
    } catch (err) {
        console.error("❌ validateVacationInput error:", err);
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
    try {
        const name = getEl("employeeName")?.value?.trim();
        const groupId = getEl("employeeGroupSelect")?.value;
        const vacationDays = getEl("employeeVacationDays")?.value || 25;
        const warning = getEl("employeeWarning");

        if (!name) {
            if (warning) warning.textContent = "Du måste ange ett namn!";
            return;
        }

        const ok = addEmployee?.(name, groupId || null, vacationDays);

        if (!ok) {
            if (warning) warning.textContent = "⚠️ Kunde inte skapa (dubblett?)";
            return;
        }

        if (warning) warning.textContent = "";

        showSuccess(`${name} sparad`, "employeeWarning");

        setValue("employeeName", "");
        setValue("employeeVacationDays", "");

        renderEmployeeList?.();

        closeModal?.("employeeModal");

    } catch (err) {
        console.error("❌ tryAddEmployee error:", err);
    }
};

/* ==========================================
   🔍 FILTER EMPLOYEE LIST (FIXED BEHAVIOR)
========================================== */

window.filterEmployeeList = function (query = "") {

    const list = getEl("employeeList");
    if (!list) return;

    const employees = getEmployees?.() || [];
    const groups = getGroups?.() || [];

    const q = query.trim().toLowerCase();

    list.innerHTML = "";

    // 🔥 NYTT: visa inget om ingen sök
    if (q.length === 0) {
        list.innerHTML = `<li class="muted-text">🔍 Skriv för att söka...</li>`;
        return;
    }

    const filtered = employees.filter(e =>
        e.name?.toLowerCase().includes(q)
    );

    if (!filtered.length) {
        list.innerHTML = `<li class="muted-text">Ingen träff...</li>`;
        return;
    }

    filtered.forEach(emp => {
        const group = groups.find(g => g.id == emp.group_id);

        const li = document.createElement("li");

        li.innerHTML = `
            • <strong>${emp.name}</strong>
            ${group ? `(${group.name})` : ""}
        `;

        li.addEventListener("click", () => {
            openEditEmployee?.(emp.id);
        });

        list.appendChild(li);
    });
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
   📅 EMPLOYEE SELECT
========================================== */

window.refreshEmployeeSelect = function (filter = "") {

    const select = getEl("employeeSelect");
    if (!select) return;

    const employees = getEmployees?.() || [];
    const query = (filter || "").trim().toLowerCase();

    select.innerHTML = "";

    if (query.length < 2) {
        select.innerHTML = `<option>Skriv minst 2 bokstäver...</option>`;
        return;
    }

    const filtered = employees.filter(e =>
        e.name?.toLowerCase().includes(query)
    );

    if (!filtered.length) {
        select.innerHTML = `<option>Ingen träff</option>`;
        return;
    }

    filtered.forEach(emp => {
        const opt = document.createElement("option");
        opt.value = emp.id;
        opt.textContent = emp.name;
        select.appendChild(opt);
    });

    select.selectedIndex = 0;
};

/* ==========================================
   🔄 EMPLOYEE LIST (SEARCH FIXED 🔥)
========================================== */

window.renderEmployeeList = function () {

    const search = getEl("employeeListSearch")?.value || "";

    // 👇 kopplar till filter
    filterEmployeeList(search);
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
   🔍 EVENTS (FIXED ROOT CAUSE)
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const search = getEl("employeeSearch");
    const employeeListSearch = getEl("employeeListSearch");

    if (search) {
        search.addEventListener("input", e => {
            refreshEmployeeSelect(e.target.value);
        });
    }

    // 🔥 NY: koppla din feature korrekt
    if (employeeListSearch) {
        employeeListSearch.addEventListener("input", e => {
            filterEmployeeList(e.target.value);
        });
    }

    getEl("employeeSelect")?.addEventListener("change", autoSaveVacation);
    getEl("startDate")?.addEventListener("change", autoSaveVacation);
    getEl("endDate")?.addEventListener("change", autoSaveVacation);

    getEl("startDate")?.addEventListener("change", validateVacationInput);
    getEl("endDate")?.addEventListener("change", validateVacationInput);

    getEl("modalOverlay")?.addEventListener("click", () => closeModal());

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeModal();
    });
});
