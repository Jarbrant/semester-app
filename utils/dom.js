/* ==========================================
   🧠 DOM + UI HELPERS (PRO CORE)
========================================== */

// 🔥 RULE: Use these helpers instead of raw DOM access

window.UI = {

    /* ==========================================
       📦 BAS
    ========================================== */

    get(id) {
        return document.getElementById(id);
    },

    value(id, val) {
        const el = this.get(id);
        if (!el) return null;

        if (val !== undefined) {
            el.value = val;
        }

        return el.value;
    },

    text(id, val) {
        const el = this.get(id);
        if (!el) return;

        el.textContent = val;
    },

    html(id, val) {
        const el = this.get(id);
        if (!el) return;

        el.innerHTML = val;
    },

    /* ==========================================
       👁 VISIBILITY
    ========================================== */

    show(id) {
        const el = this.get(id);
        if (el) el.style.display = "block";
    },

    hide(id) {
        const el = this.get(id);
        if (el) el.style.display = "none";
    },

    /* ==========================================
       🎯 STATE
    ========================================== */

    disable(id, state = true) {
        const el = this.get(id);
        if (el) el.disabled = state;
    },

    focus(id) {
        const el = this.get(id);
        if (el) el.focus();
    },

    /* ==========================================
       ⚠️ FEEDBACK
    ========================================== */

    warn(id, msg) {
        const el = this.get(id);
        if (!el) return;

        el.textContent = msg || "";
        el.style.display = msg ? "block" : "none";
    },

    clear(id) {
        const el = this.get(id);
        if (el) el.textContent = "";
    }
};
