/* ==========================================
   🧩 GROUPS (NYTT SYSTEM)
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
        color,
        maxConcurrent: parseInt(maxConcurrent) || 1
    });

    saveGroups(groups);
};

window.getGroupById = function (id) {
    return getGroups().find(g => g.id == id);
};
