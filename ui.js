/* ==========================================
   🧠 GLOBAL SUCCESS (UPGRADED)
========================================== */

function showSuccess(message, targetId = "warning") {
    const el = document.getElementById(targetId);
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
    const name = document.getElementById("groupName")?.value?.trim();
    const color = document.getElementById("groupColor")?.value;
    const limit = parseInt(document.getElementById("groupLimit")?.value) || 1;
    const warning = document.getElementById("groupWarning");

    if (!name) {
        if (warning) warning.textContent = "Ange gruppnamn";
        return;
    }

    if (typeof addGroup !== "function") {
        console.error("❌ addGroup saknas");
        return;
    }

    addGroup(name, color, limit);

    if (warning) warning.textContent = "";

    showSuccess(`Grupp "${name}" skapad`, "groupWarning");

    document.getElementById("groupName").value = "";
    document.getElementById("groupLimit").value = "";

    closeModal("groupModal");
};

/* ==========================================
   👤 EMPLOYEE ADD (🔥 FIXAD)
========================================== */

window.tryAddEmployee = function () {

    const nameEl = document.getElementById("employeeName");
    const groupEl = document.getElementById("employeeGroupSelect");
    const daysEl = document.getElementById("employeeVacationDays");
    const warning = document.getElementById("employeeWarning");

    const name = nameEl?.value;
    const groupId = groupEl?.value;
    const vacationDays = daysEl?.value || 25;

    console.log("🧪 UI INPUT:", { name, groupId, vacationDays });

    if (!name || !name.trim()) {
        if (warning) warning.textContent = "Du måste ange ett namn!";
        return;
    }

    if (typeof addEmployee !== "function") {
        console.error("❌ addEmployee saknas");
        if (warning) warning.textContent = "Systemfel: kan inte spara";
        return;
    }

    const success = addEmployee(name.trim(), groupId || null, vacationDays);

    console.log("🧪 RESULT:", success);

    if (!success) {
        if (warning) warning.textContent = "❌ Kunde inte spara";
        return;
    }

    if (warning) warning.textContent = "";

    showSuccess(`${name} sparad (${vacationDays} dagar)`, "employeeWarning");

    // reset
    if (nameEl) nameEl.value = "";
    if (daysEl) daysEl.value = "";

    renderEmployeeList?.();
    refreshEmployeeSelect?.();

    closeModal("employeeModal");
};

/* ==========================================
   🔽 GROUP SELECT
========================================== */

window.refreshGroupSelect = function () {
    const select = document.getElementById("employeeGroupSelect");
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
   📊 YEAR
========================================== */

window.getSelectedYear = function () {
    const el = document.getElementById("yearFilter");
    return el ? parseInt(el.value) : new Date().getFullYear();
};

/* ==========================================
   🔄 EMPLOYEE LIST
========================================== */

window.renderEmployeeList = function () {
    const list = document.getElementById("employeeList");
    if (!list) return;

    const employees = getEmployees?.() || [];
    const groups = getGroups?.() || [];
    const year = getSelectedYear();

    list.innerHTML = "";

    employees.forEach(emp => {

        const group = groups.find(g => g.id == emp.group_id);
        const balance = getVacationBalance(emp.id, year);

        const used = balance?.used || 0;
        const total = balance?.total || emp.vacationDays || 25;
        const percent = balance?.percent || 0;

        const color = getVacationStatusColor(percent);

        const li = document.createElement("li");

        li.style.cursor = "pointer";
        li.style.padding = "10px";
        li.style.borderRadius = "10px";
        li.style.marginBottom = "8px";
        li.style.background = "#f9fafb";

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

            <div style="
                margin-top:6px;
                height:6px;
                background:#e5e7eb;
                border-radius:999px;
                overflow:hidden;
            ">
                <div style="
                    width:${percent}%;
                    height:100%;
                    background:${color};
                    transition:0.3s;
                "></div>
            </div>
        `;

        li.onclick = () => openEditEmployee(emp.id);

        list.appendChild(li);
    });
};

/* ==========================================
   📅 VACATION (SAFE)
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

    if (!canAddVacation?.(emp, start, end)) {
        if (warning) warning.textContent = "⚠️ För många semesterdagar!";
        return;
    }

    addVacation?.();

    showSuccess("Semestern sparad", "warning");

    closeModal("vacationModal");
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
        renderEmployeeList();
    }

    if (id === "vacationModal") {
        document.getElementById("employeeSearch")?.value = "";
        refreshEmployeeSelect("");
    }
};

window.closeModal = function (id) {
    if (id) {
        document.getElementById(id)?.classList.remove("active");
    } else {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove("active"));
    }

    document.getElementById("modalOverlay").style.display = "none";
};

/* ==========================================
   🔍 EVENTS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("employeeSearch")?.addEventListener("input", e => {
        refreshEmployeeSelect(e.target.value);
    });

    document.getElementById("employeeSelect")?.addEventListener("change", () => {
        updateVacationBalanceUI?.();
    });

    document.getElementById("modalOverlay")?.addEventListener("click", () => closeModal());

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeModal();
    });

});
