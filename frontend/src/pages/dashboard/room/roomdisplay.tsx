"use client";
import { Button, Tooltip } from "antd";
import { CiExport, CiImport } from "react-icons/ci";
import { useEffect, useState } from "react";
import { Room } from "../../../types/main";
import axios from "axios";
import { BACKEND_URL } from "../../../../config";
import { toast } from "sonner";
import { statusCodes } from "../../../types/statusCodes";
import RoomsTable from "../../../components/RoomsPage/RoomsTable";
import Loading from "../../../components/Loading/Loading";
// @ts-ignore
import Papa from "papaparse";
import { FaDownload } from "react-icons/fa6";

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

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results: any) {
        const parsedData = results.data;

        const validRooms = parsedData.filter((room: any) => room.name);
        const names = validRooms.map((room: any) => room.name);
        const labs = validRooms.map((room: any) =>
          room.lab == "1" ? true : false
        );

        const finalRooms = validRooms.map((room: any) => ({
          ...room,
          lab: room.lab == "1" ? true : false,
        }));

        try {
          const response = await axios.post(
            `${BACKEND_URL}/rooms/many`,
            { name: names, lab: labs },
            {
              headers: {
                authorization: localStorage.getItem("token"),
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.status === statusCodes.CREATED) {
            toast.success("Rooms imported successfully!");
            setRoomsData((prev) => [...prev, ...finalRooms]); // Update the table
          } else {
            toast.error("Error importing rooms!");
          }
        } catch (error) {
          console.error(error);
          toast.error("An error occurred during import.");
        }
      },
      error: function (error: any) {
        console.error(error);
        toast.error("Failed to parse the CSV file.");
      },
    });
  };

  const exportToCSV = () => {
    const header = ["name", "organisation", "department", "lab", "timetable"];

    const rows = roomsData.map((room: Room) => [
      room.name,
      room.organisation ?? "",
      room.department ?? "",
      room.lab ? "Yes" : "No", // Converting `lab` boolean to "Yes" or "No"
      room.timetable ?? "",
    ]);

    const csvContent = [
      header.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "roomsData.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadCSVTemplate = () => {
    const header = ["name", "lab"];
    const rows = [
      ["Room1", true],
      ["Room2", false],
    ];

    const csvContent = [
      header.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "roomTemplate.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <Loading />;

  return (
    <div className="h-screen px-8 py-4 overflow-y-scroll">
      <h1 className="text-3xl font-bold text-primary mt-2">ClassRooms</h1>
      <div className="flex space-x-3 justify-end py-1">
        <Tooltip title="Download template">
          <Button
            onClick={downloadCSVTemplate}
            className="flex cursor-pointer bg-[#F2F2FDFF] items-center"
          >
            <FaDownload size={14} className="text-primary" />
          </Button>
        </Tooltip>
        <Button className="bg-[#F2F2FDFF] text-primary font-bold">
          <CiImport />
          <label htmlFor="import-file" className="cursor-pointer">
            Import
          </label>
        </Button>

        <input
          id="import-file"
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={handleImport}
        />
        <Button
          onClick={exportToCSV}
          className="bg-primary text-white font-bold"
        >
          <CiExport />
          Export
        </Button>
      </div>
      <RoomsTable setRoomsData={setRoomsData} roomsData={roomsData} />
    </div>
  );
}

export default RoomPage;
