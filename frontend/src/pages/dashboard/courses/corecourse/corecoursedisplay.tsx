import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../../../../config";
import { statusCodes } from "../../../../types/statusCodes";
import { toast } from "sonner";
import Loading from "../../../../components/Loading/Loading";
import { fetchdept } from "../../../../utils/main";
import CoreTable, { CoreType } from "../../../../components/CoursePage/coreTable";


function page() {
  const [coreData, setCoreData] = useState<CoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [department, _setDepartment] = useState(fetchdept());
  useEffect(() => {

    axios
      .get(BACKEND_URL + "/courses", {
        headers: {
          authorization: localStorage.getItem("token"),
        },
        params: {
          semester: Number(localStorage.getItem("semester")),
          department,
        },
      })
      .then((res) => {
        const status = res.data.status;
        console.log(res.data.message)
        if (status == statusCodes.OK) {
          setCoreData(res.data.message);
        } else {
          toast.error("Server error !!");
        }

        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="h-screen px-8 py-4 overflow-y-scroll">
      <h1 className="text-3xl font-bold text-primary mt-2">Core Courses</h1>
      <CoreTable CoreData={coreData} setCoreData={setCoreData} />
    </div>
  );
}

export default page;
