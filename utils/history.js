window.HistoryManager = {
    stack: [],

    push(action) {
        this.stack.push(action);
        console.log("🧠 History push:", action.type);
    },

    undo() {
        const last = this.stack.pop();
        if (!last) return;

        console.log("↩️ Undo:", last.type);

        if (last.type === "addVacation") {
            const vacations = getVacations?.() || [];
            const updated = vacations.filter(v => v.id !== last.payload.id);
            saveVacations?.(updated);
        }

        refreshCalendar?.();
    }
};
