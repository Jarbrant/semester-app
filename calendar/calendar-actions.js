/* ==========================================
   🎛 CALENDAR ACTIONS (PRODUCTION CORE)
========================================== */

window.calendarActions = {

    /* ==========================================
       📦 CORE
    ========================================== */

    getCalendar() {
        return window.calendar || null;
    },

    getEvents() {
        return this.getCalendar()?.getEvents?.() || [];
    },

    refresh() {
        window.refreshCalendar?.();
    },

    /* ==========================================
       📊 EVENTS PER DAG
    ========================================== */

    getEventsForDate(dateStr) {
        const events = this.getEvents();

        return events.filter(e =>
            e.startStr <= dateStr && e.endStr >= dateStr
        );
    },

    countEventsForDate(dateStr) {
        return this.getEventsForDate(dateStr).length;
    },

    /* ==========================================
       🚨 OVERBOOKING (BASIC)
    ========================================== */

    isOverbooked(dateStr, limit = 3) {
        return this.countEventsForDate(dateStr) > limit;
    },

    /* ==========================================
       🎨 UI HELPERS
    ========================================== */

    addDayCounter(cellEl, count) {
        if (!cellEl || count <= 0) return;

        const el = document.createElement("div");
        el.innerText = count;
        el.style.position = "absolute";
        el.style.top = "4px";
        el.style.right = "6px";
        el.style.fontSize = "11px";
        el.style.opacity = "0.6";

        cellEl.appendChild(el);
    },

    highlightDay(cellEl, type) {
        if (!cellEl) return;

        if (type === "overbooked") {
            cellEl.style.boxShadow = "inset 0 0 0 2px #ef4444";
        }
    },

    /* ==========================================
       🔥 APPLY LOGIC TO CELL
    ========================================== */

    processDayCell(cellEl, dateStr) {
        const count = this.countEventsForDate(dateStr);

        this.addDayCounter(cellEl, count);

        if (this.isOverbooked(dateStr)) {
            this.highlightDay(cellEl, "overbooked");
        }
    }

};
