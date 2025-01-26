import axios from "axios";
import { BACKEND_URL } from "../../config";
import { message } from "antd";
import { statusCodes } from "../types/statusCodes";

export function convertTableToString(timetable: string[][]): string {
  const s = timetable.map((row) => {
    return row.map((value) => {
      return value == "Free" ? "0" : value;
    });
  });

  return s.map((row) => row.join(",")).join(";");
}

export function stringToTable(timetable: string): string[][] {
  console.log("given timetable", timetable);
  if(!timetable)
  {
    return Array(6).fill(0).map(() => new Array(6).fill("Free"));
  }
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

  export const colorCombos: Record<string, string>[] = [
    { textColor: "#FFFFFF", backgroundColor: "#000000" },
    { textColor: "#333333", backgroundColor: "#FFFBCC" },
    { textColor: "#1D3557", backgroundColor: "#A8DADC" },
    { textColor: "#F2F2F2", backgroundColor: "#00796B" },
    { textColor: "#FFFFFF", backgroundColor: "#283593" },
    { textColor: "#FFFFFF", backgroundColor: "#2C3E50" },
    { textColor: "#000000", backgroundColor: "#F2F2F2" },
    { textColor: "#F2F2F2", backgroundColor: "#424242" },
    { textColor: "#000000", backgroundColor: "#F4E04D" },
    { textColor: "#2F4858", backgroundColor: "#F8B400" },
  ];

  export const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  
export const fetchdept = ()=> {
  try {
    axios.post(
      BACKEND_URL + "/getPosition",
      {},
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    ).then((res)=>{
    if (res.status === 200) {
      return res.data.message.department;
    } else {
      return ""
    }}
  )
  } catch (error) {
    console.log(error);
    return ""
  }
};
  

export const fetchTeachers = async (setTeacherOptions: (options: string[]) => void) => {
  try {
    const response = await axios.get(BACKEND_URL + "/teachers", {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    });

    if (response.data && response.data.message) {
      const teacherNames = response.data.message.map((item: any) => item.name);
      setTeacherOptions(teacherNames);
    } else {
      console.warn("No teachers found in the response.");
      setTeacherOptions([]);
    }
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
    message.error("Error fetching teacher data.");
  }
};
  
export const fetchRooms = async (setRoomOptions: (options: string[]) => void) => {
  try {
    const response = await axios.get(BACKEND_URL + "/rooms", {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    });
    setRoomOptions(response.data.message.map((item: any) => item.name)); // Assume response.data.message is an array of teacher names
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    message.error("Error fetching room data.");
  }
};

  export const fetchElectives = async (setElectiveOptions: (options: string[]) => void) => {
    try {
      const token = localStorage.getItem("token");
      const semester = localStorage.getItem("semester");
      if (!token) {
        message.error("Authorization token is missing!");
        return;
      }
      const response = await axios.get(BACKEND_URL + "/electives", {
        headers: {
          authorization: token,
        },
        params: {
          semester,
        },
      });
      if (response.data.status === 200) {
        setElectiveOptions(response.data.message.map((elective: { name: string }) => elective.name)); 
      } else {
        message.error(response.data.message || "Failed to fetch electives.");
      }
    } catch (error) {
      message.error("An error occurred while fetching electives.");
      console.error(error);
    }
  };

  
  export const fetchCourse = async (setCourseOptions: (options: string[]) => void) => {
    const department=fetchdept();
    const semester = localStorage.getItem("semester");
    axios
      .get(BACKEND_URL + "/courses", {
        headers: {
          authorization: localStorage.getItem("token"),
        },
        params: {
          semester,
          department,
        },
      })
      .then((res) => {
        const status = res.data.status;
        console.log(res.data.message);
        if (status == statusCodes.OK) {
          setCourseOptions(res.data.message.map((item: any) => item.name));
        } else {
          message.error("Failed to fetch courses !!");
        }
      });
  };

  
  export const fetchlabs = async (setLabOptions: (options: string[]) => void) => {
    try {
      const token = localStorage.getItem("token");
      const semester = localStorage.getItem("semester");
      if (!token) {
        message.error("Authorization token is missing!");
        return;
      }
      const response = await axios.get(BACKEND_URL + "/labs", {
        headers: {
          authorization: token,
        },
        params: {
          semester,
        },
      });
      if (response.data.status === 200) {
        setLabOptions(response.data.message.map((lab: { name: string }) => lab.name)); 
      } else {
        message.error(response.data.message || "Failed to fetch electives.");
      }
    } catch (error) {
      message.error("An error occurred while fetching electives.");
      console.error(error);
    }
  };