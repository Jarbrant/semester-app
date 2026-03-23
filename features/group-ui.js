/* ==========================================
   🧩 GROUP UI (STEP 1 - CREATE GROUP)
========================================== */

(function () {

    console.log("🧩 Group UI loaded");

    let selectedColor = "#3b82f6";

    /* ==========================================
       🎨 INIT COLOR PICKER
    ========================================== */

    function initColorPicker() {

        const dots = document.querySelectorAll(".color-dot");
        const preview = document.getElementById("groupPreview");

        dots.forEach(dot => {

            dot.addEventListener("click", () => {

                dots.forEach(d => d.classList.remove("active"));

                dot.classList.add("active");

                selectedColor = dot.dataset.color;

                if (preview) {
                    preview.style.background = selectedColor;
                }
            });
        });
    }

    /* ==========================================
       💾 SAVE GROUP
    ========================================== */

    function handleSaveGroup() {

        const name = document.getElementById("groupName")?.value?.trim();
        const max = document.getElementById("groupMax")?.value;

        if (!name) {
            alert("Ange gruppnamn");
            return;
        }

        if (typeof addGroup !== "function") {
            console.error("❌ addGroup saknas");
            return;
        }

        // 🔥 KORREKT ANROP
        addGroup(name, selectedColor, max);

        // 🔄 UI refresh
        window.refreshGroupSelect?.();
        refreshCalendar?.();

        // 🧼 reset UI
        document.getElementById("groupName").value = "";
        document.getElementById("groupMax").value = "";

        closeModal?.("groupModal");
    }

    /* ==========================================
       🚀 INIT
    ========================================== */

    function init() {

        initColorPicker();

        document.getElementById("saveGroupBtn")
            ?.addEventListener("click", handleSaveGroup);
    }

    document.addEventListener("DOMContentLoaded", init);

})();
