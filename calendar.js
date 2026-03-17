import { getAllVacations } from "./vacations.js";
import { getAllEmployees } from "./employees.js";

let calendar;

export function renderCalendar(filterId = null) {
  const el = document.getElementById("calendar");

  const vacations = getAllVacations();
  const employees = getAllEmployees();

  const events = vacations
    .filter(v => !filterId || v.employeeId == filterId)
    .map(v => {
      const emp = employees.find(e => e.id == v.employeeId);
      return {
        title: emp?.name,
        start: v.start,
        end: v.end
      };
    });

  if (calendar) calendar.destroy();

  calendar = new FullCalendar.Calendar(el, {
    initialView: "dayGridMonth",
    events
  });

  calendar.render();
}
