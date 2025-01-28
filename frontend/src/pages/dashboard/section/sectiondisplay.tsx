import { useState, useEffect } from "react";
import { toast } from "sonner";
import { statusCodes } from "../../../types/statusCodes";
import { BACKEND_URL } from "../../../../config";
import axios from "axios";
import SectionTable, { Section } from "../../../components/SectionPage/sectiondisplay";
import { Tooltip, Button } from "antd";
import { CiImport, CiExport } from "react-icons/ci";
import { FaDownload } from "react-icons/fa";
import Papa from "papaparse";
import Loading from "../../../components/Loading/Loading";

const SectionTabledisplay = () => {
 const [coreData, setCoreData] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  console.log("bob")
  useEffect(() => {

    axios
      .get(BACKEND_URL + "/sections", {
        headers: {
          authorization: localStorage.getItem("token"),
        },
        params: {
          semester: Number(localStorage.getItem("semester")),
        },
      })
      .then((res) => {
        const status = res.data.status;
        console.log(res.data.message);
        if (status == statusCodes.OK) {
          setCoreData(res.data.message);
        } else {
          toast.error("Server error !!");
        }

        setLoading(false);
      });
  }, []);


  const downloadCSVTemplate = () => {
    // Define the CSV headers
    const headers = ["Teacher initials", "Section name","semester", "subject code","Section name", "semester", "subject code","Section name", "semester", "subject code","Section name", "semester", "subject code"];
    // Create a sample row
    const sampleRow = ["VIR", "E",2, "HX112A","A",2, "HX112A","E",4, "AI34XX","D",4, "AI34XX"];
    
    // Combine headers and sample row
    const csvContent = [
      headers.join(","),
      sampleRow.join(",")
    ].join("\n");
    
    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", "section_template.csv");
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results: any) {
        const parsedData = results.data;
        console.log(parsedData);

        const data = parsedData.map((row: any) => {
          const sections = [];
          const semesters = [];
          const courseCodes = [];

          // Process each set of section data (up to 4 sets per row)
          for (let i = 1; i <= 10; i += 1) {
            if (row[`Section name_${i}`] && row[`Section name_${i}`] !== '-') {
              sections.push(row[`Section name_${i}`]);
              semesters.push(Number(row[`semester_${i}`]));
              courseCodes.push(row[`subject code_${i}`]);
            }
          }

          return {
            teacherInitials: row['Teacher initials'],
            sections,
            semesters,
            courseCodes
          };
        });

        try {
          const response = await axios.post(
            `${BACKEND_URL}/createTempTable`,
            { data },
            {
              headers: {
                authorization: localStorage.getItem("token"),
                "Content-Type": "application/json",
              }
            }
          );

          if (response.data.status === statusCodes.OK) {
            toast.success("Sections imported successfully!");
          } else {
            throw new Error();
          }
        } catch (error) {
          console.error(error);
          toast.error("Error importing sections");
        }
      },
      error: function(error: any) {
        console.error(error);
        toast.error("Failed to parse CSV file");
      }
    });
  }


  if (loading) return <Loading />;
  return (
    <div className="h-screen px-8 py-4 overflow-y-scroll">
      <h1 className="text-3xl font-bold text-primary mt-2">Section</h1><div className="flex space-x-3 justify-end py-1">
        <Tooltip title="Download template">
          <Button
            onClick={downloadCSVTemplate}
            className="flex bg-[#F2F2FDFF] cursor-pointer items-center"
          >
            <FaDownload size={14} className=" text-primary" />
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
          // onClick={exportToCSV}
          className="bg-primary text-white font-bold"
        >
          <CiExport />
          Export
        </Button>
      </div>
      <SectionTable sectionData={coreData} setSectionData={setCoreData} />
    </div>
  );
};

export default SectionTabledisplay;
