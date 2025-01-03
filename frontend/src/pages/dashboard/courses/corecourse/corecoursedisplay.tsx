import CoreTable from "../../../../components/CoursePage/CoreTable";
import { useEffect, useState } from "react";
import { Course } from "../../../../types/main";
import axios from "axios";
import { BACKEND_URL } from "../../../../../config";
import { statusCodes } from "../../../../types/statusCodes";
import { toast } from "sonner";
import Loading from "../../../../components/Loading/Loading";

export const fetchdept = async (): Promise<string> => {
  try {
    const response = await axios.post(
      BACKEND_URL + "/getPosition",
      {},
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );

    const status = response.status;
    if (status === 200) {
      return response.data.message.department;
    }
    return "";
  } catch (error) {
    console.log(error);
    return "";
  }
};

function page() {
  const [coreData, setCoreData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const department = fetchdept();

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
