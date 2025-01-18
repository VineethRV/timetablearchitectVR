import { useState, useEffect } from "react";
import { toast } from "sonner";
import { statusCodes } from "../../../types/statusCodes";
import { BACKEND_URL } from "../../../../config";
import axios from "axios";
import SectionTable, { Section } from "../../../components/SectionPage/sectiondisplay";

const SectionTabledisplay = () => {
 const [coreData, setCoreData] = useState<Section[]>([]);
  const [_loading, setLoading] = useState(true);

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


  return (
    <div className="h-screen px-8 py-4 overflow-y-scroll">
      <h1 className="text-3xl font-bold text-primary mt-2">Section</h1>
      <br></br>
      <SectionTable sectionData={coreData} setSectionData={setCoreData} />
    </div>
  );
};

export default SectionTabledisplay;
