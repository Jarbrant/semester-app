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
   🪟 MODAL SYSTEM (🔥 SAKNADES)
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
};

window.closeModal = function (id) {
    if (id) {
        getEl(id)?.classList.remove("active");
    } else {
        document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
    }

    const overlay = getEl("modalOverlay");
    if (overlay) overlay.style.display = "none";
};

/* ==========================================
   ⚡ AUTOSAVE STATE
========================================== */

let lastAutoSave = null;

/* ==========================================
   ⚡ AUTOSAVE
========================================== */

function autoSaveVacation() {

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
   🧠 UNDO
========================================== */

function handleUndo() {
    window.HistoryManager?.undo();
    lastAutoSave = null;
}

/* ==========================================
   📅 EMPLOYEE LIST (🔥 FIXAD)
========================================== */

window.renderEmployeeList = function () {
    const list = getEl("employeeList");
    if (!list) return;

    const employees = getEmployees?.() || [];
    const groups = getGroups?.() || [];
    const year = getSelectedYear();

    list.innerHTML = "";

    employees.forEach(emp => {

        const group = groups.find(g => g.id == emp.group_id);
        const balance = getVacationBalance?.(emp.id, year);

        const used = balance?.used || 0;
        const total = balance?.total || emp.vacationDays || 25;
        const percent = balance?.percent || 0;

        const color = getVacationStatusColor?.(percent) || "#22c55e";

        const li = document.createElement("li");

        li.style.cssText = `
            cursor:pointer;
            padding:10px;
            border-radius:10px;
            margin-bottom:8px;
            background:#f9fafb;
        `;

        // 🔥 FULL FIX
        li.innerHTML = `
            <div style="display:flex; justify-content:space-between;">
                <div>
                    <strong>${emp.name}</strong>
                    ${group ? `<small style="color:#6b7280"> (${group.name})</small>` : ""}
                </div>
                <div style="font-size:12px; color:#6b7280;">
                    ${used} / ${total}
                </div>
            </div>
            <div style="margin-top:6px;height:6px;background:#e5e7eb;border-radius:999px;">
                <div style="width:${percent}%;height:100%;background:${color};"></div>
            </div>
        `;

        li.onclick = () => openEditEmployee?.(emp.id);

        list.appendChild(li);
    });
};

/* ==========================================
   📅 VACATION
========================================== */

window.trySubmitVacation = function () {
    const emp = getEl("employeeSelect")?.value;
    const start = getEl("startDate")?.value;
    const end = getEl("endDate")?.value;
    const warning = getEl("warning");

    if (!emp || !start || !end) {
        if (warning) warning.textContent = "Fyll i alla fält!";
        return;
    }

    if (!canAddVacation?.(emp, start, end)) {
        if (warning) warning.textContent = "⚠️ För många semesterdagar!";
        return;
    }

    addVacation?.();
    refreshCalendar?.();

    showSuccess("Semestern sparad", "warning");

    closeModal?.("vacationModal");
};

/* ==========================================
   🔍 EVENTS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    getEl("employeeSearch")?.addEventListener("input", e => {
        window.refreshEmployeeSelect?.(e.target.value);
    });

    getEl("employeeSelect")?.addEventListener("change", autoSaveVacation);
    getEl("startDate")?.addEventListener("change", autoSaveVacation);
    getEl("endDate")?.addEventListener("change", autoSaveVacation);

    getEl("startDate")?.addEventListener("change", validateVacationInput);
    getEl("endDate")?.addEventListener("change", validateVacationInput);

    getEl("startDate")?.addEventListener("change", () => {
        const start = getEl("startDate")?.value;
        const endEl = getEl("endDate");

        if (!start || !endEl) return;

        if (!endEl.value) {
            const d = new Date(start);
            d.setDate(d.getDate() + 5);
            endEl.value = d.toISOString().split("T")[0];
        }
    });

    getEl("employeeSelect")?.addEventListener("change", () => {
        updateVacationBalanceUI?.();
    });

    getEl("undoBtn")?.addEventListener("click", handleUndo);

    getEl("modalOverlay")?.addEventListener("click", () => closeModal());

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeModal();
    });

});
