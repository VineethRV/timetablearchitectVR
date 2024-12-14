"use client";
import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Tooltip,
  Upload,
  InputNumber,
  Modal,
} from "antd";
import TimeTable from "../../../components/timetable"
import { motion } from "framer-motion";
import { CiImport } from "react-icons/ci";
import {useNavigate } from "react-router-dom";
import { IoIosInformationCircleOutline } from "react-icons/io";
import SectionAddTable from "../../../components/SectionPage/sectionaddtable";
//import { DEPARTMENTS_OPTIONS } from "@/info";
//import { createRoom } from "@/lib/actions/room";
//import { toast } from "sonner";
//import { statusCodes } from "@/app/types/statusCodes";

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

const AddSectionPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonStatus, setButtonStatus] = useState(
    weekdays.map(() => timeslots.map(() => "Free"))
  );

  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields(); // Clear form on modal close
  };

  function clearFields() {
    form.setFieldValue('className', "");
    form.setFieldValue('lab', "");
    form.setFieldValue('department', "");
    setButtonStatus(weekdays.map(() => timeslots.map(() => "Free")));
  }

//   function addClassRoom() {
//     const className = form.getFieldValue('className');
//     const lab = form.getFieldValue('lab')
//     const dept = form.getFieldValue('department')
//     // lab -> 1 is Yes 2 is No

   /* const res = createRoom(localStorage.getItem('token') || "", className, lab == 1, buttonStatus, dept).then((res) => {
      const statusCode = res.status;

      switch (statusCode) {
        case statusCodes.CREATED:
          toast.success("Added room successfully !!");
          clearFields();
          break;
        case statusCodes.BAD_REQUEST:
          toast.error("You are not authorized");
          clearFields();
          break;
        case statusCodes.INTERNAL_SERVER_ERROR:
          toast.error("Server error");
          break;
      }
    })

    toast.promise(res, {
      loading: "Adding room ...."
    })
  }*/

  return (
    <div className="text-xl font-bold text-[#171A1F] pl-8 py-6 h-screen overflow-y-scroll">
      <div className="flex px-2 items-center justify-between text-[#636AE8FF] font-inter text-xl text-bold">
        <div
          onClick={() => {
            navigate("/dashboard/section");
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
          <Form.Item name="className" label="Class Name" required>
            <Input placeholder="Name" className="font-inter font-normal" />
          </Form.Item>
          <Form.Item name="classBatch" label="Class Batch(Year of Admission)" required>
            <InputNumber placeholder="Year of Admission" min={2020} className="font-inter font-normal w-96" />
          </Form.Item>
          <label>
            <div>
              <span className="inline-flex items-center space-x-10">
                Lab Courses for the Batch
                <Tooltip title="Click on Add to add the lab courses applicable for the batch">
                  <IoIosInformationCircleOutline className="ml-2 text-[#636AE8FF]" />
                </Tooltip>
              </span>
              <Button
                color="primary"
                variant="link"
                onClick={handleOpenModal}
                className="text-purple"
              >
                &#x002B; Add
              </Button>
              <Modal
                title="Add course and corresponding teacher"
                visible={isModalOpen}
                onCancel={handleCloseModal}
                okText="Submit"
                cancelText="Cancel"
              >
                <Form form={form} layout="vertical">
                  <Form.Item
                    rules={[
                      { required: true, message: "Please input Field 1!" },
                    ]}
                  >
                    <div>
                      <label>Course</label>
                      <Input placeholder="Course" />
                      <label>Teacher</label>
                      <Select placeholder="teacher" />
                    </div>
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </label>
          <SectionAddTable />
          <br></br>
          <Form.Item
            label="Electives and Common time courses"
          >
            <Select placeholder="Electives" className="font-normal w-96" />
          </Form.Item>
          <Form.Item
            label="Lab courses applicable for the section"
          >
            <Select placeholder="Labs" className="font-normal w-96" />
          </Form.Item>
          <Form.Item
            label="Select default Room"
          >
            <Select placeholder="Room" className="font-normal w-96" />
          </Form.Item>
          <Form.Item
            label="Department from which room will be selected if default room is not available"
          >
            <Select placeholder="Department" className="font-normal w-96" />
          </Form.Item>
          <label className="flex items-center">
            <span>Block</span>
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
                //onClick={addClassRoom}
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

export default AddSectionPage;
