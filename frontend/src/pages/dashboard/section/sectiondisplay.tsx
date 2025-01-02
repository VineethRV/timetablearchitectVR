import { useState, useEffect } from "react";
import { toast } from "sonner";
import { statusCodes } from "../../../types/statusCodes";
import { BACKEND_URL } from "../../../../config";
import axios from "axios";
import SectionTable from "../../../components/SectionPage/sectiondisplay";

interface Section{
  name: string;
  batch : number;
  courses: string[];
  teachers: string[];
  rooms: string[];
  electives: string|null;
  labs: string|null;
  defaultRoom: string|null;
  semester: number;
  orgId:number;
  timeTable:string;
}

const SectionTabledisplay = () => {
 const [coreData, setCoreData] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

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
        if (status == statusCodes.OK) {
          setCoreData(res.data.message);
        } else {
          toast.error("Server error !!");
        }

        setLoading(false);
      });
  }, []);


  return (
    <div className="h-screen px-8 py-4 overflow-y-scroll">
      <h1 className="text-3xl font-bold text-primary mt-2">Section</h1>
      <br></br>
      <SectionTable sectionData={coreData} setSectionData={setCoreData} />
    </div>
  );
};

export default SectionTabledisplay;
