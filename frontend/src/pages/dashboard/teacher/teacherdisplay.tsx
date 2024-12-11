"use client";
import { Button } from "antd";
import { CiExport, CiImport } from "react-icons/ci";
import { useEffect, useState } from "react";
import { Teacher } from "../../../types/main";
import axios from "axios";
import { BACKEND_URL } from "../../../../config";
import TeachersTable from "../../../components/TeachersPage/TeachersTable";
import Loading from "../../../components/Loading/Loading";
import { statusCodes } from "../../../types/statusCodes";
import { toast } from "sonner";

function TeacherPage() {
  const [teachersData, setTeachersData] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(BACKEND_URL + "/teachers", {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const statusCode = res.data.status;
        if (statusCode == statusCodes.OK) {
          setTeachersData(res.data.message);
        }
        else {
          toast.error("Server error !!")
        }
        setLoading(false);
      });
  }, []);

  if(loading) return <Loading/>

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
