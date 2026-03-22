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
   🧠 GLOBAL SUCCESS
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
   🧩 GROUP UI
========================================== */

window.tryAddGroup = function () {
    const name = getEl("groupName")?.value?.trim();
    const color = getEl("groupColor")?.value;
    const limit = parseInt(getEl("groupLimit")?.value) || 1;
    const warning = getEl("groupWarning");

    if (!name) {
        if (warning) warning.textContent = "Ange gruppnamn";
        return;
    }

    if (typeof addGroup !== "function") return console.error("❌ addGroup saknas");

    addGroup(name, color, limit);

    if (warning) warning.textContent = "";

    showSuccess(`Grupp "${name}" skapad`, "groupWarning");

    setValue("groupName", "");
    setValue("groupLimit", "");

    closeModal?.("groupModal");
};

/* ==========================================
   🔽 GROUP SELECT
========================================== */

window.refreshGroupSelect = function () {
    const select = getEl("employeeGroupSelect");
    if (!select) return;

    const groups = getGroups?.() || [];

    select.innerHTML = "";

    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "Ingen grupp";
    select.appendChild(defaultOpt);

    groups.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g.id;
        opt.textContent = `${g.name} (max ${g.maxConcurrent})`;
        select.appendChild(opt);
    });
};

/* ==========================================
   📅 EMPLOYEE SELECT (🔥 FIX)
========================================== */

window.refreshEmployeeSelect = function (filter = "") {
    const select = getEl("employeeSelect");
    if (!select) return;

    const employees = getEmployees?.() || [];

    const filtered = employees.filter(e =>
        e.name?.toLowerCase().includes(filter.toLowerCase())
    );

    select.innerHTML = "";

    if (!filtered.length) {
        const opt = document.createElement("option");
        opt.textContent = "Ingen personal";
        opt.value = "";
        select.appendChild(opt);
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
   👤 EMPLOYEE ADD
========================================== */

window.tryAddEmployee = function () {

    const nameEl = getEl("employeeName");
    const groupEl = getEl("employeeGroupSelect");
    const daysEl = getEl("employeeVacationDays");
    const warning = getEl("employeeWarning");

    const name = nameEl?.value?.trim();
    const groupId = groupEl?.value;
    const vacationDays = daysEl?.value || 25;

    if (!name) {
        if (warning) warning.textContent = "Du måste ange ett namn!";
        return;
    }

    if (typeof addEmployee !== "function") return console.error("❌ addEmployee saknas");

    addEmployee(name, groupId || null, vacationDays);

    if (warning) warning.textContent = "";

    showSuccess(`${name} sparad (${vacationDays} dagar)`, "employeeWarning");

    setValue("employeeName", "");
    setValue("employeeVacationDays", "");

    renderEmployeeList?.();
    window.refreshEmployeeSelect?.(); // 🔥 FIX

    closeModal?.("employeeModal");
};

/* ==========================================
   📊 YEAR
========================================== */

window.getSelectedYear = function () {
    const el = getEl("yearFilter");
    return el ? parseInt(el.value) : new Date().getFullYear();
};

/* ==========================================
   🔄 EMPLOYEE LIST
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

    if (typeof addVacation !== "function") return console.error("❌ addVacation saknas");

    addVacation();

    showSuccess("Semestern sparad", "warning");

    closeModal?.("vacationModal");
};

/* ==========================================
   🪟 MODAL
========================================== */

window.openModal = function (id) {

    const modals = document.querySelectorAll('.modal');
    if (!modals.length) return;

    modals.forEach(m => m.classList.remove("active"));

    const modal = getEl(id);
    const overlay = getEl("modalOverlay");

    if (!modal || !overlay) return;

    modal.classList.add("active");
    overlay.style.display = "block";

    if (id === "employeeModal") {
        refreshGroupSelect?.();
        renderEmployeeList?.();
    }

    if (id === "vacationModal") {
        setValue("employeeSearch", "");
        window.refreshEmployeeSelect?.(""); // 🔥 FIX
        updateVacationBalanceUI?.();
    }
};

window.closeModal = function (id) {
    if (id) {
        getEl(id)?.classList.remove("active");
    } else {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove("active"));
    }

    const overlay = getEl("modalOverlay");
    if (overlay) overlay.style.display = "none";
};

/* ==========================================
   📊 BALANS
========================================== */

function updateVacationBalanceUI() {
    const empId = getEl("employeeSelect")?.value;
    const box = getEl("vacationBalanceInfo");

    if (!empId || !box) return;

    const year = getSelectedYear();
    const balance = getVacationBalance?.(empId, year);

    if (!balance) return;

    box.innerHTML = `
        📊 ${balance.used} / ${balance.total} dagar  
        <br>💡 Kvar: ${balance.remaining}
    `;
}

/* ==========================================
   🔍 EVENTS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    getEl("employeeSearch")?.addEventListener("input", e => {
        window.refreshEmployeeSelect?.(e.target.value); // 🔥 FIX
    });

    getEl("employeeSelect")?.addEventListener("change", () => {
        updateVacationBalanceUI?.();
    });

    getEl("modalOverlay")?.addEventListener("click", () => closeModal());

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeModal();
    });

});
