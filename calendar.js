import { getVacations, getEmployees } from "./data.js";

let calendar;

export function renderCalendar() {
  const calendarEl = document.getElementById("calendar");

  if (!calendarEl) return;

  const vacations = getVacations();
  const employees = getEmployees();

  const events = vacations.map(v => {
    const emp = employees.find(e => e.id === v.employeeId);

    return {
      title: emp ? emp.name : "Okänd",
      start: v.start,
      end: v.end,
      backgroundColor: emp?.color || "#888",
      borderColor: emp?.color || "#888"
    };
  });

  if (calendar) {
    calendar.destroy();
  }

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    height: "auto",
    events,

    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek"
    }
  });

  calendar.render();
}
