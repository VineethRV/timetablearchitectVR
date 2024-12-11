"use client";
import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Tooltip,
  Upload,
  Radio,
} from "antd";
import TimeTable from "../../../components/timetable"
import { motion } from "framer-motion";
import { CiImport } from "react-icons/ci";
import {useNavigate } from "react-router-dom";
import { IoIosInformationCircleOutline } from "react-icons/io";
import axios from "axios";
import { BACKEND_URL } from "../../../../config";
import { toast } from "sonner";
import { statusCodes } from "../../../types/statusCodes";
import { DEPARTMENTS_OPTIONS } from "../../../../info";

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

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const timeslots = [
  "9:00-10:00",
  "10:00-11:00",
  "11:30-12:30",
  "12:30-1:30",
  "2:30-3:30",
  "3:30-4:30",
];

const AddRoomPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [buttonStatus, setButtonStatus] = useState(
    weekdays.map(() => timeslots.map(() => "Free"))
  );

  function clearFields() {
    form.setFieldValue('className', "");
    form.setFieldValue('lab', "");
    form.setFieldValue('department', "");
    setButtonStatus(weekdays.map(() => timeslots.map(() => "Free")));
  }

  function addClassRoom() {
    const className = form.getFieldValue('className');
    const lab = form.getFieldValue('lab')
    const dept = form.getFieldValue('department')
    const promise = axios.post(
      BACKEND_URL + "/rooms",
      {
        name: className,
        lab: lab==1,
        timetable: buttonStatus,
        department: dept,
      },
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );

    toast.promise(promise, {
      loading: "Creating Room...",
      success: (res) => {
        const statusCode = res.status;
        console.log(statusCode);
        switch (statusCode) {
          case statusCodes.OK:
            clearFields();
            return "Room added successfully!";
          case statusCodes.BAD_REQUEST:
            return "Room already exists!";
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
        return "Failed to create room. Please try again!";
      },
    });
  }

  return (
    <div className="text-xl font-bold text-[#171A1F] pl-8 py-6 h-screen overflow-y-scroll">
      <div className="flex px-2 items-center justify-between text-[#636AE8FF] font-inter text-xl text-bold">
        <div
          onClick={() => {
            navigate("/dashboard/rooms");
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
        className="flex justify-left items-center mt-12 ml-4"
      >
        <Form {...formItemLayout} form={form} layout="vertical" requiredMark className="w-96">
          <Form.Item name="className" label="Classroom Name" required>
            <Input placeholder="Name" className="font-inter font-normal" />
          </Form.Item>
          <Form.Item name="lab" label="Is it a Lab?" required>
            <Radio.Group>
              <Radio value={1}>Yes</Radio>
              <Radio value={2} className="ml-4 color-[#636AE8FF]">
                No
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Department" name="department">
            <Select options={DEPARTMENTS_OPTIONS}  className="font-inter font-normal" />
          </Form.Item>
          <label className="flex items-center">
            <span>Schedule</span>
            <Tooltip title="Click on the timeslots where to the teacher is busy to set them to busy">
              <IoIosInformationCircleOutline className="ml-2 text-[#636AE8FF]" />
            </Tooltip>
          </label>
          <div className="flex justify-left">
            <TimeTable
              buttonStatus={buttonStatus}
              setButtonStatus={setButtonStatus}
            />
          </div>
          <div className="flex space-x-4 justify-end w-[55vm]">
            <Form.Item>
              <Button onClick={clearFields} className="border-[#636AE8FF] text-[#636AE8FF] w-[75px] h-[32px]">
                Clear
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                onClick={addClassRoom}
                className="bg-[#636AE8FF] text-[#FFFFFF] w-[75px] h-[32px]"
              >
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </motion.div>
    </div>
  );
};

export default AddRoomPage;
