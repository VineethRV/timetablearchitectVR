"use client";
import { Button } from "antd";
//import TeachersTable from "../../components/TeachersPage/TeachersTable";
import { CiExport, CiImport } from "react-icons/ci";
import Loading from "../../../components/Loading/Loading";
import { useEffect, useState } from "react";
import { Teacher } from "../../../types/main";
import axios from "axios";
import { BACKEND_URL } from "../../../../config";
import { statusCodes } from "../../../types/statusCodes";
//import { getTeachers } from "@/lib/actions/teacher";

//import Loading from "./loading";
//import { Teacher } from "@/app/types/main";
//import { statusCodes } from "@/app/types/statusCodes";

function TeacherPage() {
  const [loading, setLoading] = useState(true);
  const [teachersData, setTeachersData] = useState<Teacher[]>([]);

    useEffect(() => {
      axios
      .post(
              BACKEND_URL + "/getTeachers",
              {},
              {
                headers: {
                  authorization: localStorage.getItem("token"),
                },
              }
            )
        .then((res) => {
        const status = res.data.status;
        console.log(status)


         setTeachersData(res.data.teachers as Teacher[]);
         if (res.status == statusCodes.OK) setLoading(false);
      })
   }, []);

     if (loading) {
       return <Loading />;
     }
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
