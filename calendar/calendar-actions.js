/* ==========================================
   🎛 CALENDAR ACTIONS (STATE DRIVEN PRO MAX+++)
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
       ⚡ CACHE ENGINE (SMART 🔥)
    ========================================== */

    _eventCache: {},
    _cacheVersion: 0,

    buildEventCache() {
        try {
            const events = this.getEvents();

            // 🔥 enkel cache invalidation
            const version = events.length;
            if (version === this._cacheVersion) return;

            const cache = {};

            events.forEach(e => {
                const start = new Date(e.start);
                const end = new Date(e.end);

                if (isNaN(start) || isNaN(end)) return;

                let current = new Date(start);

                while (current <= end) {
                    const key = current.toISOString().split("T")[0];

                    if (!cache[key]) cache[key] = [];
                    cache[key].push(e);

                    current.setDate(current.getDate() + 1);
                }
            });

            this._eventCache = cache;
            this._cacheVersion = version;

        } catch (err) {
            console.warn("⚠️ buildEventCache error:", err);
        }
    },

    getEventsForDate(dateStr) {
        this.buildEventCache();
        return this._eventCache[dateStr] || [];
    },

    countEventsForDate(dateStr) {
        return this.getEventsForDate(dateStr).length;
    },

    isOverbooked(dateStr, limit = 3) {
        return this.countEventsForDate(dateStr) > limit;
    },

    /* ==========================================
       🎨 COLOR ENGINE
    ========================================== */

    applyEventColor(info) {
        try {
            const bg = info.event.backgroundColor || "#3b82f6";
            const border = info.event.borderColor || bg;
            const text = info.event.textColor || "#fff";

            info.el.style.setProperty("background-color", bg, "important");
            info.el.style.setProperty("border-color", border, "important");
            info.el.style.setProperty("color", text, "important");

        } catch (err) {
            console.warn("⚠️ applyEventColor error:", err);
        }
    },

    /* ==========================================
       🌡 HEATMAP ENGINE (SMART 🔥)
    ========================================== */

    getHeatColor(count) {
        if (count === 0) return "";

        // 🔥 mjukare gradient
        const intensity = Math.min(count / 5, 1);

        if (count >= 4) {
            return `rgba(239,68,68,${0.15 + intensity * 0.25})`;
        }

        return `rgba(59,130,246,${0.05 + intensity * 0.2})`;
    },

    applyHeatmap(cellEl, count) {
        if (!cellEl) return;

        const color = this.getHeatColor(count);

        // 🔥 reset först (fixar ghost colors)
        cellEl.style.background = "";

        if (color) {
            cellEl.style.background = color;
        }
    },

    /* ==========================================
       📊 DAY UI
    ========================================== */

    addDayCounter(cellEl, count) {
        if (!cellEl || count <= 0) return;

        let el = cellEl.querySelector(".day-counter");

        if (!el) {
            el = document.createElement("div");
            el.className = "day-counter";

            el.style.position = "absolute";
            el.style.top = "4px";
            el.style.right = "6px";
            el.style.fontSize = "11px";
            el.style.opacity = "0.7";
            el.style.fontWeight = "500";

            cellEl.appendChild(el);
        }

        el.innerText = count;
    },

    highlightDay(cellEl, type) {
        if (!cellEl) return;

        // 🔥 reset först
        cellEl.style.boxShadow = "";

        if (type === "overbooked") {
            cellEl.style.boxShadow = "inset 0 0 0 2px #ef4444";
        }
    },

    /* ==========================================
       🧠 MAIN PROCESSOR (IDEMPOTENT 🔥)
    ========================================== */

    processDayCell(cellEl, dateStr) {
        try {
            const count = this.countEventsForDate(dateStr);

            this.applyHeatmap(cellEl, count);
            this.addDayCounter(cellEl, count);

            if (this.isOverbooked(dateStr)) {
                this.highlightDay(cellEl, "overbooked");
            }

        } catch (err) {
            console.warn("⚠️ processDayCell error:", err);
        }
    }

};
