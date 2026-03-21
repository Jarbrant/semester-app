/* ==========================================
   🧩 GROUPS (PRODUCTION SAFE)
========================================== */

const GROUPS_KEY = "groups";

/* ==========================================
   🎨 COLOR VALIDATION
========================================== */

function isValidHex(color) {
    return typeof color === "string" &&
        /^#([0-9A-F]{3}){1,2}$/i.test(color.trim());
}

function normalizeColor(color) {
    if (isValidHex(color)) return color.trim();
    return "#3b82f6"; // 🔵 fallback
}

/* ==========================================
   📦 LOAD GROUPS (AUTO FIX DATA)
========================================== */

window.getGroups = function () {
    try {
        let groups = JSON.parse(localStorage.getItem(GROUPS_KEY)) || [];

        // 🔥 AUTO-FIX gamla trasiga färger
        let updated = false;

        groups = groups.map(g => {
            const fixedColor = normalizeColor(g.color);

            if (g.color !== fixedColor) {
                console.warn("⚠️ Fixar trasig färg:", g);
                updated = true;
            }

            return {
                ...g,
                color: fixedColor,
                maxConcurrent: parseInt(g.maxConcurrent) || 1
            };
        });

        if (updated) {
            saveGroups(groups); // 🔥 självläkning
        }

        return groups;

    } catch (err) {
        console.error("💥 getGroups error:", err);
        return [];
    }
};

/* ==========================================
   💾 SAVE GROUPS
========================================== */

window.saveGroups = function (groups) {
    try {
        localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
    } catch (err) {
        console.error("💥 saveGroups error:", err);
    }
};

/* ==========================================
   ➕ ADD GROUP (SAFE)
========================================== */

window.addGroup = function (name, color, maxConcurrent) {
    try {
        const groups = getGroups();

        const safeColor = normalizeColor(color);

        const newGroup = {
            id: Date.now(),
            name: name?.trim() || "Namnlös grupp",
            color: safeColor,
            maxConcurrent: parseInt(maxConcurrent) || 1,
            createdAt: new Date().toISOString()
        };

        groups.push(newGroup);

        saveGroups(groups);

        console.log("✅ Grupp skapad:", newGroup);

    } catch (err) {
        console.error("💥 addGroup error:", err);
    }
};

/* ==========================================
   ❌ REMOVE GROUP (NICE TO HAVE)
========================================== */

window.removeGroup = function (id) {
    try {
        let groups = getGroups();
        groups = groups.filter(g => g.id != id);

        saveGroups(groups);

        console.log("🗑 Grupp borttagen:", id);

    } catch (err) {
        console.error("💥 removeGroup error:", err);
    }
};

/* ==========================================
   🔄 UPDATE GROUP (NICE TO HAVE)
========================================== */

window.updateGroup = function (id, updates) {
    try {
        let groups = getGroups();

        groups = groups.map(g => {
            if (g.id != id) return g;

            return {
                ...g,
                name: updates.name?.trim() || g.name,
                color: normalizeColor(updates.color),
                maxConcurrent: parseInt(updates.maxConcurrent) || g.maxConcurrent
            };
        });

        saveGroups(groups);

        console.log("✏️ Grupp uppdaterad:", id);

    } catch (err) {
        console.error("💥 updateGroup error:", err);
    }
};
