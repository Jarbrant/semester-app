/* ==========================================
   🧠 HISTORY MANAGER (AO-03 FULL)
========================================== */

window.HistoryManager = {

    stack: [],

    /* ==========================================
       ➕ PUSH
    ========================================== */

    push(action) {
        if (!action || !action.type) return;

        this.stack.push(action);

        console.log("🧠 History push:", action.type);
    },

    /* ==========================================
       ↩️ UNDO (🔥 FULL SUPPORT)
    ========================================== */

    undo() {

        const last = this.stack.pop();

        if (!last) {
            console.warn("⚠️ Nothing to undo");
            return;
        }

        console.log("↩️ Undo:", last.type);

        const vacations = getVacations?.() || [];

        /* ==========================================
           ➕ UNDO ADD
        ========================================== */

        if (last.type === "addVacation") {

            const updated = vacations.filter(v => v.id !== last.payload.id);

            saveVacations?.(updated);
        }

        /* ==========================================
           ✏️ UNDO UPDATE
        ========================================== */

        else if (last.type === "updateVacation") {

            const { before } = last.payload;

            const updated = vacations.map(v =>
                v.id == before.id ? before : v
            );

            saveVacations?.(updated);
        }

        /* ==========================================
           🗑 UNDO DELETE
        ========================================== */

        else if (last.type === "deleteVacation") {

            const restored = last.payload;

            const updated = [...vacations, restored];

            saveVacations?.(updated);
        }

        /* ==========================================
           🔄 REFRESH
        ========================================== */

        refreshCalendar?.();
    }
};
