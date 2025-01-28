"use client";
import { Button, Tooltip } from "antd";
import { CiExport, CiImport} from "react-icons/ci";
import Loading from "../../../../components/Loading/Loading";
import { toast } from "sonner";
import { statusCodes } from "../../../../types/statusCodes";
import { BACKEND_URL } from "../../../../../config";
import axios from "axios";
import { useEffect, useState } from "react";
import { Lab } from "../../../../types/main";
import LabTable from "../../../../components/CoursePage/Labtable";
import { FaDownload } from "react-icons/fa";

function page() {
  const [labsData, setLabsData] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);

  const department="Computer Science Engineering"
  useEffect(() => {
    axios
      .get(BACKEND_URL + `/labs`,{
        headers: {
          authorization: localStorage.getItem("token"),
        },
        params: {
          semester: Number(localStorage.getItem("semester")),
          department,
        },
      })
      .then((res) => {
        const statusCode = res.data.status;
        console.log(res.data)
        if (statusCode == statusCodes.OK) {
          setLabsData(res.data.message)
          console.log(res.data.message);
        }
        else {
          toast.error("Server error !!")
        }
        setLoading(false);
      });
  }, []);

  if(loading) return <Loading/>

  function downloadCSVTemplate(): void {
    const headers = ["Teacher initials", "Lab course", "section", "batch number","semester", "Lab course", "section", "batch number","semester", "Lab course", "section", "batch number","semester", "Lab course", "section", "batch number","semester"];
    const csvContent = headers.join(",") + "\n";
    
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    
    // Create a download link
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", "lab_template.csv");
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Template downloaded successfully");
  }

  function createTempLabs(){
    
  }
  return (
    <div className="h-screen px-8 py-4 overflow-y-scroll">
      <h1 className="text-3xl font-bold text-primary mt-2">Lab Sets</h1>
      <LabTable
      setLabsData={setLabsData}
      labData={labsData} />
    </div>
  );
}

export default page;
