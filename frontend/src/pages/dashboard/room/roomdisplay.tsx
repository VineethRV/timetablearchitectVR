"use client";
import { Button } from "antd";
//import RoomsTable from "../../components/RoomsPage/RoomsTable";
import { CiExport, CiImport } from "react-icons/ci";
//import { useEffect, useState } from "react";
//import { Room } from "@/app/types/main";
//import Loading from "./loading";
//import { getRooms } from "@/lib/actions/room";
//import { statusCodes } from "@/app/types/statusCodes";

function RoomPage() {
  //const [roomsData, setRoomsData] = useState<Room[]>([]);
  //const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     getRooms(localStorage.getItem("token") || "").then((res) => {
  //       const statusCode = res.status;
  //       if (statusCode == statusCodes.OK) setRoomsData(res.rooms as Room[]);
  //       console.log(statusCode);
  //       setLoading(false);
  //     });
  //   }, []);

  //   if (loading) return <Loading />;

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

      {/* <RoomsTable 
      setRoomsData={setRoomsData} roomsData={roomsData} 
      /> */}
    </div>
  );
}

export default RoomPage;
