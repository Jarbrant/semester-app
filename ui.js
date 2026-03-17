// ==========================================
// 🪟 UI / MODALS (PRO + DEBUG)
// ==========================================

window.openModal = function (id) {
    const modal = document.getElementById(id);

    if (!modal) {
        console.error("Modal hittades inte:", id);
        return;
    }

    console.log("Öppnar modal:", id);

    modal.classList.add("show");
};

window.closeModal = function () {
    document.querySelectorAll(".modal").forEach(m => {
        m.classList.remove("show");
    });
};
