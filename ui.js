// ==========================================
// 🪟 UI / MODALS (PRO VERSION)
// ==========================================

window.openModal = function(id) {
    const modal = document.getElementById(id);

    if (!modal) {
        console.error("Modal saknas:", id);
        return;
    }

    modal.classList.add("show");
};

window.closeModal = function() {
    document.querySelectorAll(".modal").forEach(modal => {
        modal.classList.remove("show");
    });
};
