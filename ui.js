window.openModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("show");
};

window.closeModal = function() {
    document.querySelectorAll(".modal")
        .forEach(m => m.classList.remove("show"));
};
