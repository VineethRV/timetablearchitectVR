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
// @ts-ignore
import Papa from "papaparse";

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
        } else {
          toast.error("Server error!");
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

        const validTeachers = parsedData.filter((teacher: any) => teacher.name);
        const names = validTeachers.map((teacher: any) => teacher.name);
        const initials = validTeachers.map((teacher: any) => teacher.initials);
        const emails = validTeachers.map((teacher: any) => teacher.email);

        try {
          const response = await axios.post(
            `${BACKEND_URL}/teachers/many`,
            { name: names, initials: initials, email: emails },
            {
              headers: {
                authorization: localStorage.getItem("token"),
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.status === statusCodes.CREATED) {
            toast.success("Teachers imported successfully!");
            setTeachersData((prev) => [...prev, ...validTeachers]); // Update the table
          } else {
            toast.error("Error importing teachers!");
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
    const header = [
      "name",
      "initials",
      "email",
      "department",
      "alternateDepartments",
      "timetable",
      "labtable",
      "organisation",
    ];

    const rows = teachersData.map((teacher: Teacher) => [
      teacher.name,
      teacher.initials ?? "",
      teacher.email ?? "",
      teacher.department ?? "",
      teacher.alternateDepartments ?? "",
      teacher.timetable ?? "",
      teacher.labtable ?? "",
      teacher.organisation ?? "",
    ]);

    const csvContent = [
      header.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "teachersData.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <Loading />;

  return (
    <div className="h-screen px-8 py-4 overflow-y-scroll">
      <h1 className="text-3xl font-bold text-primary mt-2">Teachers</h1>
      <div className="flex space-x-3 justify-end py-1">
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
      <TeachersTable
        setTeachersData={setTeachersData}
        teachersData={teachersData}
      />
    </div>
  );
}

export default TeacherPage;
