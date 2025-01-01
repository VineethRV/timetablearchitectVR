import { useEffect } from "react";

const downloadCSV = (filename: string, headers: string[]) => {
    const csvContent = headers.join(",") + "\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    // Close the tab or window after download
    setTimeout(() => {
      window.close();
    }, 1000); // Delay to ensure the download process starts before closing
  };
  

const TeacherTemplate = () => {
  useEffect(() => {
    downloadCSV("teacher_template.csv", ["name", "initials", "email"]);
  }, []);
  return null; // No UI required as the tab closes automatically
};

const RoomTemplate = () => {
  useEffect(() => {
    downloadCSV("room_template.csv", ["name", "lab"]);
  }, []);
  return null; // No UI required as the tab closes automatically
};

const CoreCoursesTemplate = () => {
  useEffect(() => {
    downloadCSV("core_courses_template.csv", ["name", "code","no_of_hrs"]);
  }, []);
  return null; // No UI required as the tab closes automatically
};


export { TeacherTemplate, RoomTemplate, CoreCoursesTemplate };
