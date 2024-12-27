import { Button, ConfigProvider, Input, Select } from "antd";
import { TbTrash } from "react-icons/tb";
import { CiExport, CiImport, CiSearch } from "react-icons/ci";
import CoreTable from "../../../../components/CoursePage/coreTable";
import { useEffect, useState } from "react";
import { Course } from "../../../../types/main";
import axios from "axios";
import { BACKEND_URL } from "../../../../../config";
import { statusCodes } from "../../../../types/statusCodes";
import { toast } from "sonner";
import Loading from "../../../../components/Loading/Loading";

function page() {

  const [coreData, setCoreData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(BACKEND_URL + "/Core", {
        headers: {
          authorization: localStorage.getItem("token"),
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
      <div className="flex space-x-8 justify-between py-4">
        <Input
          className="w-fit"
          addonBefore={<CiSearch />}
          placeholder="Course"
        />

        {/* this config to set background color of the selectors | did as specified in antd docs */}
        <ConfigProvider
          theme={{
            components: {
              Select: {
                selectorBg: "#F3F4F6FF",
              },
            },
          }}
        >
          <div className="flex space-x-3">
            <Select
              defaultValue="Sort By"
              style={{ width: 120 }}
              options={[]}
            />
            <Select defaultValue="Number of credits" options={[]} />
            <Select defaultValue="Hours per week" options={[]} />
          </div>
        </ConfigProvider>
        <div className="flex space-x-2">
          <Button className="bg-red-500 text-white font-bold">
            <TbTrash />Delete
          </Button>
          <Button>Clear filters</Button>
        </div>
      </div>

      <CoreTable />

    </div>
  );
}

export default page;
