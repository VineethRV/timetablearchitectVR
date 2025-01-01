"use client";
import { Button } from "antd";
import { CiExport, CiImport} from "react-icons/ci";
import Loading from "../../../../components/Loading/Loading";
import { toast } from "sonner";
import { statusCodes } from "../../../../types/statusCodes";
import { BACKEND_URL } from "../../../../../config";
import axios from "axios";
import { useEffect, useState } from "react";
import { Lab } from "../../../../types/main";
import LabTable from "../../../../components/CoursePage/Labtable";

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
  return (
    <div className="h-screen px-8 py-4 overflow-y-scroll">
      <h1 className="text-3xl font-bold text-primary mt-2">Lab Sets</h1>
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
      <LabTable
      setLabsData={setLabsData}
      labData={labsData} />
    </div>
  );
}

export default page;
