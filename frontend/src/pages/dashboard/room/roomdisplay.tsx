"use client";
import { Button } from "antd";
import { CiExport, CiImport } from "react-icons/ci";
import { useEffect, useState } from "react";
import { Room } from "../../../types/main";
import axios from "axios";
import { BACKEND_URL } from "../../../../config";
import { toast } from "sonner";
import { statusCodes } from "../../../types/statusCodes";
import RoomsTable from "../../../components/RoomsPage/RoomsTable";

function RoomPage() {
  const [roomsData, setRoomsData] = useState<Room[]>([]);

  useEffect(() => {


    const promise = axios.get(
      BACKEND_URL + "/rooms",
      {
        headers: {
          authorization: localStorage.getItem("token"),
        }
      }
    );

    toast.promise(promise, {
      loading: "Fetching rooms...",
      success: (res) => {
        const statusCode = res.status;
        if (statusCode==statusCodes.OK)
        {
          console.log(res.data.message)
          setRoomsData(res.data.message as Room[]);
          return "Fetched successfully!" ;
        }
        else
          return "Unexpected status code";
      },
      error: (error) => {
        console.error("Error:", error.response?.data || error.message);
        return "Failed to fetch rooms. Please try again!";
      },
    });


 }, []);

  return (
    <div className="h-screen px-8 py-4 overflow-y-scroll">
      <h1 className="text-3xl font-bold text-primary mt-2">ClassRooms</h1>
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
       <RoomsTable 
      setRoomsData={setRoomsData} roomsData={roomsData} 
      /> 
    </div>
  );
}

export default RoomPage;
