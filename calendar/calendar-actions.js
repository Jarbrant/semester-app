/* ==========================================
   🎛 CALENDAR ACTIONS (PRO MAX VERSION)
========================================== */

window.calendarActions = {

    /* ==========================================
       🔌 CORE
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
       ⚡ PERFORMANCE CACHE
    ========================================== */

    _eventCache: {},

    buildEventCache() {
        const cache = {};

        this.getEvents().forEach(e => {
            const start = new Date(e.start);
            const end = new Date(e.end);

            let current = new Date(start);

            while (current <= end) {
                const key = current.toISOString().split("T")[0];

                if (!cache[key]) cache[key] = [];
                cache[key].push(e);

                current.setDate(current.getDate() + 1);
            }
        });

        this._eventCache = cache;
    },

    getEventsForDate(dateStr) {
        return this._eventCache[dateStr] || [];
    },

    countEventsForDate(dateStr) {
        return this.getEventsForDate(dateStr).length;
    },

    isOverbooked(dateStr, limit = 3) {
        return this.countEventsForDate(dateStr) > limit;
    },

    /* ==========================================
       🎨 COLOR ENGINE (SMART + SAFE)
    ========================================== */

    applyEventColor(info) {
        try {
            const bg = info.event.backgroundColor || "#3b82f6";
            const border = info.event.borderColor || bg;
            const text = info.event.textColor || "#fff";

            // 🔥 tvinga färg (FullCalendar override fix)
            info.el.style.setProperty("background-color", bg, "important");
            info.el.style.setProperty("border-color", border, "important");
            info.el.style.setProperty("color", text, "important");

        } catch (err) {
            console.warn("⚠️ applyEventColor error:", err);
        }
    },

    /* ==========================================
       🌡 HEATMAP ENGINE (🔥 NY!)
    ========================================== */

    getHeatColor(count) {
        if (count === 0) return "transparent";

        if (count === 1) return "rgba(59,130,246,0.08)";
        if (count === 2) return "rgba(59,130,246,0.15)";
        if (count === 3) return "rgba(59,130,246,0.25)";
        if (count >= 4) return "rgba(239,68,68,0.25)"; // överbelastning

        return "transparent";
    },

    applyHeatmap(cellEl, count) {
        if (!cellEl) return;

        const color = this.getHeatColor(count);

        cellEl.style.background = color;
    },

    /* ==========================================
       📊 DAY UI
    ========================================== */

    addDayCounter(cellEl, count) {
        if (!cellEl || count <= 0) return;

        // 🔥 undvik duplicering
        if (cellEl.querySelector(".day-counter")) return;

        const el = document.createElement("div");
        el.className = "day-counter";
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
       🧠 MAIN PROCESSOR (UPGRADED)
    ========================================== */

    processDayCell(cellEl, dateStr) {
        try {
            const count = this.countEventsForDate(dateStr);

            // 🔥 heatmap först
            this.applyHeatmap(cellEl, count);

            // 🔢 counter
            this.addDayCounter(cellEl, count);

            // 🚨 overbooking
            if (this.isOverbooked(dateStr)) {
                this.highlightDay(cellEl, "overbooked");
            }

        } catch (err) {
            console.warn("⚠️ processDayCell error:", err);
        }
    }

};
