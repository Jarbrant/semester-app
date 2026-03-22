/* ==========================================
   📅 EVENTS (STATE DRIVEN PRO MAX+++)
========================================== */

// 🔐 Fallbacks
if (typeof getGroups !== "function") window.getGroups = () => [];
if (typeof getEmployees !== "function") window.getEmployees = () => [];
if (typeof getVacations !== "function") window.getVacations = () => [];

/* ==========================================
   🛠 UTIL
========================================== */

function toISO(date) {
    return date.toISOString().split("T")[0];
}

function iterateDays(start, end, cb) {
    const current = new Date(start);
    while (current <= end) {
        cb(new Date(current));
        current.setDate(current.getDate() + 1);
    }
}

/* ==========================================
   🎨 SAFE COLOR
========================================== */

function getSafeColor(group) {
    const defaultColor = "#3b82f6";

    if (!group?.color) return defaultColor;

    const color = group.color.trim();

    if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) return color;

    const map = {
        blue: "#3b82f6",
        red: "#ef4444",
        green: "#22c55e",
        yellow: "#eab308",
        orange: "#f97316",
        purple: "#8b5cf6",
        pink: "#ec4899",
        gray: "#6b7280"
    };

    return map[color.toLowerCase()] || defaultColor;
}

/* ==========================================
   📊 GROUP LOAD MAP
========================================== */

function buildGroupLoadMap(vacations, empMap) {
    const map = {};

    vacations.forEach(v => {
        const emp = empMap[v.employee_id];
        if (!emp?.group_id) return;

        const start = new Date(v.start);
        const end = new Date(v.end);

        iterateDays(start, end, (d) => {
            const key = `${emp.group_id}_${toISO(d)}`;
            map[key] = (map[key] || 0) + 1;
        });
    });

    return map;
}

/* ==========================================
   🎨 HEATMAP COLOR
========================================== */

function getHeatmapColor(baseColor, load, max = 5) {
    const intensity = Math.min(load / max, 1);

    if (intensity > 0.9) return "#dc2626";

    const hex = baseColor.replace("#", "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const factor = 1 - intensity * 0.7;

    return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
}

/* ==========================================
   🧠 SMART COLOR
========================================== */

function getSmartEventColor(emp, group, year, load, max) {
    const base = getSafeColor(group);

    if (!emp) return base;

    const balance = getVacationBalance?.(emp.id, year);

    if (balance?.percent > 90) return "#ef4444";
    if (balance?.percent > 70) return "#f59e0b";

    return getHeatmapColor(base, load, max);
}

/* ==========================================
   🧠 TOOLTIP
========================================== */

function buildTooltip(emp, group, vac, year, load) {
    const balance = getVacationBalance?.(emp?.id, year);

    return `👤 ${emp?.name || "Okänd"}
🧩 ${group?.name || "Ingen grupp"}
📅 ${vac.start} → ${vac.end}
📊 ${balance ? `${balance.used}/${balance.total} dagar` : ""}
👥 ${load} i gruppen lediga`;
}

/* ==========================================
   📅 EVENTS (🔥 CORE ENGINE)
========================================== */

window.getCalendarEvents = function () {
    try {
        const vacations = getVacations();
        const employees = getEmployees();
        const groups = getGroups();

        const year = (typeof getSelectedYear === "function")
            ? getSelectedYear()
            : new Date().getFullYear();

        const empMap = Object.fromEntries(employees.map(e => [e.id, e]));
        const groupMap = Object.fromEntries(groups.map(g => [g.id, g]));

        const loadMap = buildGroupLoadMap(vacations, empMap);

        const events = [];

        vacations.forEach(vac => {

            const emp = empMap[vac.employee_id];
            const group = emp ? groupMap[emp.group_id] : null;

            const start = new Date(vac.start);
            const end = new Date(vac.end);

            iterateDays(start, end, (day) => {

                const dayStr = toISO(day);
                const key = `${group?.id}_${dayStr}`;
                const load = loadMap[key] || 0;
                const max = group?.maxConcurrent || 5;

                const color = getSmartEventColor(emp, group, year, load, max);

                events.push({
                    id: `${vac.id}_${dayStr}`,

                    title: emp?.name || "Okänd",

                    start: dayStr,
                    end: dayStr,

                    backgroundColor: color,
                    borderColor: color,
                    textColor: "#fff",

                    allDay: true,

                    extendedProps: {
                        tooltip: buildTooltip(emp, group, vac, year, load),
                        groupName: group?.name || null,
                        employeeId: emp?.id || null,
                        groupId: group?.id || null,
                        vacationId: vac.id, // 🔥 NY
                        load
                    }
                });
            });
        });

        return events;

    } catch (err) {
        console.error("❌ getCalendarEvents error:", err);
        return [];
    }
};

/* ==========================================
   ✏️ EDIT HANDLER (🔥 AO-03 FIX)
========================================== */

window.handleEventEdit = function (event) {

    if (!event) return;

    const vacId = event.extendedProps?.vacationId;

    if (!vacId) {
        console.warn("⚠️ Ingen vacationId hittades");
        return;
    }

    const vacations = getVacations?.() || [];
    const vac = vacations.find(v => v.id == vacId);

    if (!vac) {
        console.warn("⚠️ Semester hittades inte");
        return;
    }

    // 🔥 SÄTT EDIT MODE
    window.AppState = window.AppState || {};
    window.AppState.editingVacationId = vac.id;

    console.log("✏️ Edit mode:", vac.id);

    // 🔥 FYLL FORM
    setValue("employeeSelect", vac.employee_id);
    setValue("startDate", vac.start);
    setValue("endDate", vac.end);

    openModal?.("vacationModal");
};
