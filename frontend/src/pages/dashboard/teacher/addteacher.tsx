import { useState } from "react";
import { Button, Form, Input, Select, Tooltip, Upload } from "antd";
import { motion } from "framer-motion";
import { CiImport } from "react-icons/ci";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import TimeTable from "../../../components/timetable";
import { DEPARTMENTS_OPTIONS } from "../../../../info";
import axios from "axios";
import { statusCodes } from "../../../types/statusCodes";
import { toast } from "sonner";
import { BACKEND_URL } from "../../../../config";
import { timeslots, weekdays } from "../../../utils/main";

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

const AddTeacherpage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

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

  function teacherAdd() {
    const name = form.getFieldValue("name");
    const initials = form.getFieldValue("initials");
    const email = form.getFieldValue("email");
    const department = form.getFieldValue("department");

    const promise = axios.post(
      BACKEND_URL + "/teachers",
      {
        name: name,
        initials: initials,
        email: email,
        department: department,
        alternateDepartments: "",
        timetable: buttonStatus,
        labtable: null,
      },
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );

    // Use toast.promise to show the loading, success, and error states
    toast.promise(promise, {
      loading: "Creating teacher...",
      success: (res) => {
        const statusCode = res.status;
        console.log(statusCode);
        switch (statusCode) {
          case statusCodes.OK:
            clearFields();
            return "Teacher added successfully!";
          case statusCodes.BAD_REQUEST:
            return "Teacher already exists!";
          case statusCodes.UNAUTHORIZED:
            return "You are not authorized!";
          case statusCodes.INTERNAL_SERVER_ERROR:
            return "Internal server error";
          default:
            return "Unexpected status code";
        }
      },
      error: (error) => {
        console.error("Error:", error.response?.data || error.message);
        return "Failed to create teacher. Please try again!";
      },
    });
  }

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
                  onClick={teacherAdd}
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

export default AddTeacherpage;