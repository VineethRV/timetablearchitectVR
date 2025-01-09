import axios from "axios";
import { BACKEND_URL } from "../../config";

export function convertTableToString(timetable: string[][]): string {
  const s = timetable.map((row) => {
    return row.map((value) => {
      return value == "Free" ? "0" : value;
    });
  });

  return s.map((row) => row.join(",")).join(";");
}

export function stringToTable(timetable: string): string[][] {
  const arr: string[][] = timetable
    .split(";")
    .map((row: string) => row.split(","));

  return arr.map((row) => {
    return row.map((value) => {
      return value == "0" ? "Free" : value;
    });
  });
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

  export const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
  };


  export async function getPosition(
    setDepartment: (options: string) => void,
    setAdmin: (options: Boolean) => void
  ) {
    const response = await axios.post(
      BACKEND_URL + "/getPosition",
      {},
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );
    if (response.status == 200) {
      if (response.data.message.role == "admin") setAdmin(true);
      else setAdmin(false);
      setDepartment(response.data.message.department);
    } else {
      return null;
    }
  }