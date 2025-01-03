import { useEffect, useState } from "react";
import { Button, Form, Input, Select, Tooltip, Upload } from "antd";
import { motion } from "framer-motion";
import { CiImport } from "react-icons/ci";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import TimeTable from "../../../components/timetable";
import { BACKEND_URL } from "../../../../config";
import axios from "axios";
import { toast } from "sonner";
import { statusCodes } from "../../../types/statusCodes";
import { DEPARTMENTS_OPTIONS } from "../../../../info";
import { Teacher } from "../../../types/main";
import Loading from "../../../components/Loading/Loading";
import {
  convertTableToString,
  stringToTable,
  timeslots,
  weekdays,
} from "../../../utils/main";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

export function newStringToTable(timetable: string): string[][] {
  const arr: string[][] = timetable
    .split(";")
    .map((row: string) => row.split(","));

  return arr.map((row, i) => {
    return row.map((value, j) => {
      return value == "0" ? "Free" : value;
    });
  });
}

export function newConvertTableToString(timetable: string[][]): string {
  const s = timetable.map((row, i) => {
    return row.map((value, j) => {
      return value == "Free" ? "0" : value;
    });
  });

  return s.map((row) => row.join(",")).join(";");
}

const EditTeacherpage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { oldname, olddepartment } = useParams();
  const clearFields = () => {
    form.setFieldValue("name", "");
    form.setFieldValue("initials", "");
    form.setFieldValue("email", "");
    form.setFieldValue("department", "");
    setButtonStatus(weekdays.map(() => timeslots.map(() => "Free")));
  };

  const [buttonStatus, setButtonStatus] = useState(
    weekdays.map(() => timeslots.map(() => "Free"))
  );

  useEffect(() => {
    if (oldname && olddepartment) {
      fetchTeacherDetails(oldname, olddepartment);
    }
  }, [oldname, olddepartment]);

  const rewriteUrl = (newName: string, newDepartment: string) => {
    navigate(
      `/dashboard/teachers/edit/${encodeURIComponent(
        newName
      )}/${encodeURIComponent(newDepartment)}`
    );
  };

  //fetching the details of the teacher
  const fetchTeacherDetails = async (
    name: string,
    department: string | null
  ) => {
    console.log(localStorage.getItem("token"), name, department);
    axios
      .post(
        BACKEND_URL + "/teachers/peek",
        {
          name: name,
          department: department,
        },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        const status = res.data.status;

        switch (status) {
          case statusCodes.OK:
            const timetableString = res.data.message.timetable
              ? newStringToTable(res.data.message.timetable)
              : Array(6).fill(Array(6).fill("Free"));
            setButtonStatus(timetableString);

            form.setFieldsValue({
              name: res.data.message.name,
              initials: res.data.message.initials,
              email: res.data.message.email,
              department: res.data.message.department,
            });
            break;
          default:
            toast.error("Failed to fetch teacher details!");
        }

        setLoading(false);
      });
  };

  const handleSubmit = async () => {
    const name = form.getFieldValue("name");
    const initials = form.getFieldValue("initials");
    const email = form.getFieldValue("email");
    const department = form.getFieldValue("department");
    const teacherData: Teacher = {
      name,
      initials,
      email,
      department,
      alternateDepartments: null,
      timetable: newConvertTableToString(buttonStatus),
      labtable: null,
      organisation: null,
    };

    const promise = axios.put(
      BACKEND_URL + "/teachers",
      {
        originalName: oldname,
        originalDepartment: olddepartment,
        teacher: teacherData,
      },
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );
    console.log(oldname, olddepartment, teacherData);
    toast.promise(promise, {
      loading: "Updating teacher...",
      success: (res) => {
        const statusCode = res.data.status;
        switch (statusCode) {
          case statusCodes.OK:
            rewriteUrl(name, department);
            return "Teacher Updated successfully!";
          case statusCodes.BAD_REQUEST:
            return "Teacher Not Found!";
          case statusCodes.FORBIDDEN:
            return "Cannot update Teacher!";
          case statusCodes.INTERNAL_SERVER_ERROR:
            return "Internal server error!";
        }
      },
      error: (error) => {
        console.error("Error:", error.response?.data || error.message);
        return "Failed to update teacher. Please try again!";
      },
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="text-xl font-bold text-[#171A1F] pl-8 py-6 w-full h-screen overflow-y-scroll">
      <div className="flex px-2 items-center justify-between text-[#636AE8FF] font-inter text-xl text-bold">
        <div
          onClick={() => {
            navigate("/dashboard/teachers");
          }}
          className="flex text-base w-fit cursor-pointer space-x-2"
        >
          <h1>&#8592;</h1>
          <h1>Back</h1>
        </div>
        <Upload>
          <Button
            icon={<CiImport />}
            className="text-[#636AE8FF] border-[#636AE8FF] "
          >
            Import
          </Button>
        </Upload>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        className="flex mt-12 items-center pl-4 w-full "
      >
        <Form
          {...formItemLayout}
          form={form}
          layout="vertical"
          requiredMark
          className="w-96"
        >
          <Form.Item name="name" label="Teacher Name" required>
            <Input placeholder="Name" className="font-inter font-normal " />
          </Form.Item>
          <Form.Item name="initials" label="Initials" required>
            <Input placeholder="Initials" className="font-inter font-normal" />
          </Form.Item>
          <Form.Item name="email" label="Email Id">
            <Input placeholder="Email Id" className="font-inter font-normal" />
          </Form.Item>
          <Form.Item name="department" label="Department">
            <Select
              showSearch
              placeholder="Select a department"
              optionFilterProp="label"
              options={DEPARTMENTS_OPTIONS}
              className="font-normal w-96"
            />
          </Form.Item>

          <label>
            <div className="flex items-center">
              <span>Schedule</span>
              <Tooltip title="Click on the timeslots where to the teacher  busy to set them to busy">
                <IoIosInformationCircleOutline className="ml-2 w-4 h-4 text-[#636AE8FF]" />
              </Tooltip>
            </div>
          </label>
          <TimeTable
            buttonStatus={buttonStatus}
            setButtonStatus={setButtonStatus}
          />
          <div className="flex justify-end">
            <div className="flex space-x-4">
              <Form.Item>
                <Button
                  onClick={clearFields}
                  className="border-[#636AE8FF] text-[#636AE8FF]"
                >
                  Clear
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  onClick={handleSubmit}
                  className="bg-primary text-[#FFFFFF]"
                >
                  Submit
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </motion.div>
    </div>
  );
};

export default EditTeacherpage;
