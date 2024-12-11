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
import Loading from "../../../components/Loading/Loading";

function RoomPage() {
  const [roomsData, setRoomsData] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(BACKEND_URL + "/rooms", {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const status = res.data.status;

        if (status == statusCodes.OK) {
          setRoomsData(res.data.message);
        } else {
          toast.error("Server error !!");
        }

        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;

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
      <RoomsTable setRoomsData={setRoomsData} roomsData={roomsData} />
    </div>
  );
}

export default RoomPage;
