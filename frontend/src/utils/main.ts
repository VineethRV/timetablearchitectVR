export function convertTableToString(timetable: string[][]): string {
  return timetable.map((row) => row.join(",")).join(";");
}

export function stringToTable(timetable: string): string[][] {
  return timetable.split(";").map((row: string) => row.split(","));
}

export const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
export const timeslots = [
    "9:00-10:00",
    "10:00-11:00",
    "11:30-12:30",
    "12:30-1:30",
    "2:30-3:30",
    "3:30-4:30",
  ];