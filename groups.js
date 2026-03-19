/* ==========================================
   🧩 GROUPS
========================================== */

const GROUPS_KEY = "groups";

window.getGroups = function () {
    return JSON.parse(localStorage.getItem(GROUPS_KEY)) || [];
};

window.saveGroups = function (groups) {
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
};

window.addGroup = function (name, color, maxConcurrent) {
    const groups = getGroups();

    groups.push({
        id: Date.now(),
        name,
        color: color || "#3b82f6",
        maxConcurrent: parseInt(maxConcurrent) || 1
    });

    saveGroups(groups);
};
