"use client";
import { Button } from "antd";
//import TeachersTable from "../../components/TeachersPage/TeachersTable";
import { CiExport, CiImport } from "react-icons/ci";
//import { useEffect, useState } from "react";
//import { getTeachers } from "@/lib/actions/teacher";

//import Loading from "./loading";
//import { Teacher } from "@/app/types/main";
//import { statusCodes } from "@/app/types/statusCodes";

function TeacherPage() {
 // const [loading, setLoading] = useState(true);
  // const [teachersData, setTeachersData] = useState<Teacher[]>([]);

  //   useEffect(() => {
  //     getTeachers(localStorage.getItem("token") || "").then((res) => {
  //       const statusCode = res.status;
  //       console.log(statusCode)

  //       setTeachersData(res.teachers as Teacher[]);
  //       if (res.status == statusCodes.OK) setLoading(false);
  //     });
  //   }, []);

  //   if (loading) {
  //     return <Loading />;
  //   }

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
      {/* <TeachersTable
      //  setTeachersData={setTeachersData}
        //teachersData={teachersData}
      /> */}
    </div>
  );
}

export default TeacherPage;
