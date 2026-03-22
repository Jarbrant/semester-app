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

    addGroup?.(name, color, limit);

    if (warning) warning.textContent = "";

    document.getElementById("groupName").value = "";
    document.getElementById("groupLimit").value = "";

    closeModal("groupModal");
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
   👤 EMPLOYEE ADD
========================================== */

window.tryAddEmployee = function () {
    const name = document.getElementById("employeeName")?.value?.trim();
    const groupId = document.getElementById("employeeGroupSelect")?.value;
    const vacationDays = document.getElementById("employeeVacationDays")?.value;
    const warning = document.getElementById("employeeWarning");

    if (!name) {
        if (warning) warning.textContent = "Du måste ange ett namn!";
        return;
    }

    addEmployee?.(name, groupId || null, vacationDays || 25);

    if (warning) warning.textContent = "";

    document.getElementById("employeeName").value = "";
    document.getElementById("employeeVacationDays").value = "";

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
   ✏️ EDIT EMPLOYEE
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
            📊 ${balance.used} använda / ${balance.total} totalt  
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
   📅 EMPLOYEE SELECT + SEARCH
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
        const opt = document.createElement("option");
        opt.textContent = "Ingen match";
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
    updateVacationBalanceUI();
};

/* ==========================================
   📊 BALANS
========================================== */

function updateVacationBalanceUI() {
    const empId = document.getElementById("employeeSelect")?.value;
    const box = document.getElementById("vacationBalanceInfo");

    if (!empId || !box) return;

    const year = getSelectedYear();
    const balance = getVacationBalance(empId, year);

    if (!balance) return;

    box.innerHTML = `
        📊 ${balance.used} / ${balance.total} dagar  
        <br>💡 Kvar: ${balance.remaining}
    `;
}

/* ==========================================
   📅 VACATION
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

    if (warning) warning.textContent = "";

    addVacation?.();
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
        const search = document.getElementById("employeeSearch");
        if (search) search.value = "";

        refreshEmployeeSelect("");
        updateVacationBalanceUI();
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
   🔍 EVENTS + FIX DATUM
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("employeeSearch")?.addEventListener("input", e => {
        refreshEmployeeSelect(e.target.value);
    });

    document.getElementById("employeeSelect")?.addEventListener("change", () => {
        updateVacationBalanceUI();
    });

    // ✅ FIX: kalender öppnas korrekt på rätt fält
    document.getElementById("startDate")?.addEventListener("click", function () {
        this.showPicker?.();
    });

    document.getElementById("endDate")?.addEventListener("click", function () {
        this.showPicker?.();
    });

    document.getElementById("modalOverlay")?.addEventListener("click", () => closeModal());

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeModal();
    });

});
