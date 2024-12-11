"use client";
import { Button } from "antd";
import { CiExport, CiImport } from "react-icons/ci";
import { useEffect, useState } from "react";
import { Teacher } from "../../../types/main";
import axios from "axios";
import { BACKEND_URL } from "../../../../config";
import { statusCodes } from "../../../types/statusCodes";
import TeachersTable from "../../../components/TeachersPage/TeachersTable";
import { toast } from "sonner";

function TeacherPage() {
  const [teachersData, setTeachersData] = useState<Teacher[]>([]);

    useEffect(() => {


      const promise = axios.get(
        BACKEND_URL + "/teachers",
        {
          headers: {
            authorization: localStorage.getItem("token"),
          }
        }
      );
  
      // Use toast.promise to show the loading, success, and error states
      toast.promise(promise, {
        loading: "Fetching teachers...",
        success: (res) => {
          const statusCode = res.status;
          if (statusCode==statusCodes.OK)
          {
            console.log(res.data.message)
            setTeachersData(res.data.message as Teacher[]);
            return "Fetched successfully!" ;
          }
          else
            return "Unexpected status code";
        },
        error: (error) => {
          console.error("Error:", error.response?.data || error.message);
          return "Failed to create teacher. Please try again!";
        },
      });
  

   }, []);
  return (
    <div className="h-screen px-8 py-4 overflow-y-scroll">
      <h1 className="text-3xl font-bold text-primary mt-2">Teachers</h1>
      <div className="flex space-x-3 justify-end py-1">
        <Button className="bg-[#F2F2FDFF] text-primary font-bold">
          <CiImport />
          Import
        </Button>
        <Button className="bg-primary text-white font-bold">
          <CiExport />
          Export
        </Button>
      </div>
       <TeachersTable
        setTeachersData={setTeachersData}
        teachersData={teachersData}
      /> 
    </div>
  );
}

export default TeacherPage;
