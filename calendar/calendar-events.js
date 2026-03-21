/* ==========================================
   📅 EVENTS MED GROUP COLORS (FINAL PRO)
========================================== */

// 🔐 Fallbacks
if (typeof getGroups !== "function") window.getGroups = () => [];
if (typeof getEmployees !== "function") window.getEmployees = () => [];
if (typeof getVacations !== "function") window.getVacations = () => [];

/* ==========================================
   🎨 SAFE COLOR (UPGRADED)
========================================== */

function getSafeColor(group) {
    const defaultColor = "#3788d8";

    if (!group) return defaultColor;

    let color = group.color;

    if (!color || typeof color !== "string") {
        return defaultColor;
    }

    color = color.trim();

    // ✅ HEX direkt
    if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
        return color;
    }

    // ✅ NAMED COLORS → HEX
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

    if (map[color.toLowerCase()]) {
        return map[color.toLowerCase()];
    }

    // ❗ fallback men logga (viktigt för debug)
    console.warn("⚠️ Unknown color format:", color);

    return defaultColor;
}

/* ==========================================
   🧑‍🦰 TOOLTIP
========================================== */

function buildTooltip(emp, group, vac) {
    return `👤 ${emp?.name || "Okänd"}
🦩 ${group?.name || "Ingen grupp"}
📅 ${vac.start} → ${vac.end}`;
}

/* ==========================================
   📅 EVENTS
========================================== */

window.getCalendarEvents = function () {
    try {
        const vacations = getVacations() || [];
        const employees = getEmployees() || [];
        const groups = getGroups() || [];

        console.log("📊 DATA DEBUG", {
            vacations,
            employees,
            groups
        });

        return vacations.map(vac => {

            const emp = employees.find(e => e.id == vac.employee_id);

            if (!emp) {
                console.warn("⚠️ Employee not found for vacation:", vac);
            }

            const group = emp
                ? groups.find(g => g.id == emp.group_id)
                : null;

            if (!group && emp?.group_id) {
                console.warn("⚠️ Group not found:", emp.group_id);
            }

            const color = getSafeColor(group);

            console.log("🎨 EVENT COLOR:", {
                employee: emp?.name,
                group: group?.name,
                rawColor: group?.color,
                finalColor: color
            });

            return {
                id: vac.id ?? Date.now(),

                title: emp?.name || "Okänd",

                start: vac.start,
                end: addOneDaySafe(vac.end),

                display: "block",

                backgroundColor: color,
                borderColor: color,
                textColor: "#ffffff",

                allDay: true,

                extendedProps: {
                    tooltip: buildTooltip(emp, group, vac),
                    groupName: group?.name || null,
                    employeeId: emp?.id || null,
                    groupId: group?.id || null
                }
            };
        });

    } catch (err) {
        console.error("❌ getCalendarEvents error:", err);
        return [];
    }
};

/* ==========================================
   🛠 DATE FIX
========================================== */

function addOneDaySafe(dateStr) {
    if (!dateStr) return null;

    try {
        const date = new Date(dateStr);

        if (isNaN(date)) {
            console.warn("⚠️ Invalid date:", dateStr);
            return dateStr;
        }

        date.setDate(date.getDate() + 1);

        return date.toISOString().split("T")[0];

    } catch (err) {
        console.warn("⚠️ date parsing failed:", dateStr);
        return dateStr;
    }
}
