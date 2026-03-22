/* ==========================================
   🧩 GROUP UI (PRO MAX++)
========================================== */

/* ==========================================
   🧠 HELPERS
========================================== */

function setWarning(el, msg = "") {
    if (el) el.textContent = msg;
}

function resetInput(id) {
    const el = document.getElementById(id);
    if (el) el.value = "";
}

/* ==========================================
   ➕ ADD GROUP (UPGRADED UX)
========================================== */

window.tryAddGroup = function () {
    const nameEl = document.getElementById("groupName");
    const colorEl = document.getElementById("groupColor");
    const limitEl = document.getElementById("groupLimit");
    const warning = document.getElementById("groupWarning");

    const name = nameEl?.value?.trim();
    const color = colorEl?.value;
    const limit = parseInt(limitEl?.value) || 1;

    if (!name) {
        setWarning(warning, "Ange gruppnamn");
        nameEl?.focus();
        return;
    }

    addGroup?.(name, color, limit);

    setWarning(warning);

    resetInput("groupName");
    resetInput("groupLimit");

    closeModal("groupModal");
};

/* ==========================================
   🔽 GROUP SELECT (STABIL + SORT)
========================================== */

window.refreshGroupSelect = function () {
    const select = document.getElementById("employeeGroupSelect");
    if (!select) return;

    const groups = (getGroups?.() || []).sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    select.innerHTML = "";

    const defaultOpt = new Option("Ingen grupp", "");
    select.appendChild(defaultOpt);

    groups.forEach(g => {
        const opt = new Option(
            `${g.name} (max ${g.maxConcurrent})`,
            g.id
        );
        select.appendChild(opt);
    });
};

/* ==========================================
   👤 ADD EMPLOYEE (SMART)
========================================== */

window.tryAddEmployee = function () {
    const nameEl = document.getElementById("employeeName");
    const groupEl = document.getElementById("employeeGroupSelect");
    const daysEl = document.getElementById("employeeVacationDays");
    const warning = document.getElementById("employeeWarning");

    const name = nameEl?.value?.trim();
    const groupId = groupEl?.value;
    const vacationDays = parseInt(daysEl?.value) || 25;

    if (!name) {
        setWarning(warning, "Du måste ange ett namn!");
        nameEl?.focus();
        return;
    }

    addEmployee?.(name, groupId || null, vacationDays);

    setWarning(warning);

    resetInput("employeeName");
    resetInput("employeeVacationDays");

    renderEmployeeList();
    refreshEmployeeSelect();

    closeModal("employeeModal");
};

/* ==========================================
   📊 YEAR
========================================== */

window.getSelectedYear = function () {
    const el = document.getElementById("yearFilter");
    return el ? parseInt(el.value) : new Date().getFullYear();
};

/* ==========================================
   🔄 EMPLOYEE LIST (OPTIMIZED)
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

        li.className = "employee-item";

        li.innerHTML = `
            <div class="emp-row">
                <div>
                    <strong>${emp.name}</strong>
                    ${group ? `<small> (${group.name})</small>` : ""}
                </div>

                <div class="emp-days">
                    ${used} / ${total}
                </div>
            </div>

            <div class="emp-bar">
                <div class="emp-bar-fill"
                     style="width:${percent}%; background:${color}">
                </div>
            </div>
        `;

        li.onclick = () => openEditEmployee(emp.id);

        list.appendChild(li);
    });
};

/* ==========================================
   ✏️ EDIT EMPLOYEE (SMART UI)
========================================== */

window.openEditEmployee = function (id) {
    const emp = getEmployees().find(e => e.id == id);
    if (!emp) return;

    const year = getSelectedYear();
    const balance = getVacationBalance(emp.id, year);

    document.getElementById("editEmployeeName").value = emp.name;
    document.getElementById("editEmployeeId").value = emp.id;
    document.getElementById("editEmployeeVacationDays").value = emp.vacationDays || 25;

    const box = document.getElementById("employeeBalanceBox");

    if (box && balance) {
        box.innerHTML = `
            📊 ${balance.used} / ${balance.total}
            <br>💡 Kvar: ${balance.remaining}
        `;
    }

    openModal("editEmployeeModal");
};

window.saveEmployeeEdit = function () {
    const id = document.getElementById("editEmployeeId").value;
    const name = document.getElementById("editEmployeeName").value?.trim();
    const vacationDays = document.getElementById("editEmployeeVacationDays")?.value;

    if (!name) return;

    updateEmployee(id, name, undefined, vacationDays);

    closeModal("editEmployeeModal");

    renderEmployeeList();
    refreshEmployeeSelect();
    refreshCalendar?.();
};

window.deleteEmployee = function () {
    const id = document.getElementById("editEmployeeId").value;

    if (!confirm("Ta bort denna person?")) return;

    deleteEmployeeById(id);

    closeModal("editEmployeeModal");

    renderEmployeeList();
    refreshEmployeeSelect();
    refreshCalendar?.();
};

/* ==========================================
   📅 EMPLOYEE SELECT
========================================== */

window.refreshEmployeeSelect = function (filter = "") {
    const select = document.getElementById("employeeSelect");
    if (!select) return;

    const employees = getEmployees?.() || [];

    const filtered = employees.filter(e =>
        e.name.toLowerCase().includes(filter.toLowerCase())
    );

    select.innerHTML = "";

    if (!filtered.length) {
        select.appendChild(new Option("Ingen match", ""));
        return;
    }

    filtered.forEach(emp => {
        select.appendChild(new Option(emp.name, emp.id));
    });

    select.selectedIndex = 0;

    updateVacationBalanceUI();
};

/* ==========================================
   📊 LIVE BALANS
========================================== */

function updateVacationBalanceUI() {
    const empId = document.getElementById("employeeSelect")?.value;
    const box = document.getElementById("vacationBalanceInfo");

    if (!empId || !box) return;

    const year = getSelectedYear();
    const balance = getVacationBalance(empId, year);

    if (!balance) return;

    box.innerHTML = `
        📊 ${balance.used} / ${balance.total}
        <br>💡 Kvar: ${balance.remaining}
    `;
}

/* ==========================================
   📅 VACATION (VALIDATION BOOST)
========================================== */

window.trySubmitVacation = function () {
    const emp = document.getElementById("employeeSelect")?.value;
    const start = document.getElementById("startDate")?.value;
    const end = document.getElementById("endDate")?.value;
    const warning = document.getElementById("warning");

    if (!emp || !start || !end) {
        setWarning(warning, "Fyll i alla fält!");
        return;
    }

    if (end < start) {
        setWarning(warning, "Slutdatum kan inte vara före startdatum");
        return;
    }

    if (!canAddVacation?.(emp, start, end)) {
        setWarning(warning, "⚠️ För många semesterdagar!");
        return;
    }

    setWarning(warning);

    addVacation?.();

    closeModal("vacationModal");
};

/* ==========================================
   🪟 MODAL SYSTEM (SMART)
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
        resetInput("employeeSearch");
        refreshEmployeeSelect("");
        updateVacationBalanceUI();

        // 🔥 UX FIX (det du bad om tidigare)
        document.getElementById("startDate")?.focus();
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
   🔍 SEARCH + UX EVENTS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("employeeSearch")?.addEventListener("input", e => {
        refreshEmployeeSelect(e.target.value);
    });

    document.getElementById("employeeSelect")?.addEventListener("change", () => {
        updateVacationBalanceUI();
    });

    document.getElementById("modalOverlay")?.addEventListener("click", closeModal);

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeModal();
    });

});
