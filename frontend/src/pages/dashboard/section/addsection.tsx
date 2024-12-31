"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Tooltip,
  Upload,
  InputNumber,
  Modal,
  message,
} from "antd";
import TimeTable from "../../../components/timetable"
import { motion } from "framer-motion";
import { CiImport } from "react-icons/ci";
import {useNavigate } from "react-router-dom";
import { IoIosInformationCircleOutline } from "react-icons/io";
import SectionAddTable, { courseList } from "../../../components/SectionPage/sectionaddtable";
import { convertTableToString, timeslots, weekdays } from "../../../utils/main";
import axios from "axios";
import { BACKEND_URL } from "../../../../config";
import { buttonConvert } from "../teacher/addteacher";
import { toast } from "sonner";
import { statusCodes } from "../../../types/statusCodes";
import Timetable from "../../../components/timetable";
import { convertToTimetable } from "../courses/lab/addlab";

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


const AddSectionPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData,setTableData]=useState<courseList[]>([]);
  const [teacherOptions, setTeacherOptions] = useState<string[]>([]);
  const [roomOptions, setRoomOptions] = useState<string[]>([]);
  const [showTT, SetshowTT] = useState(false);
  const [buttonStatus, setButtonStatus] = useState(
    weekdays.map(() => timeslots.map(() => "Free"))
  );
  const [buttonStatus1, setButtonStatus1] = useState(
    weekdays.map(() => timeslots.map(() => "Free"))
  );
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.setFieldValue("course","")
    form.setFieldValue("teachers","");
  };

  function clearFields() {
    form.resetFields()
    setButtonStatus(weekdays.map(() => timeslots.map(() => "Free")));
    SetshowTT(false);
  }

  const handleModalSubmit=()=>{
    const course=form.getFieldValue("course")
    const teacher=form.getFieldValue("teachers")
    const key=form.getFieldValue("key")
    if (!course || !teacher) {
      console.error("Course or teacher is missing");
      return;
    }
    if(key==null)
{
    const newEntry: courseList = {
      key: `${Date.now()}`, 
      course,
      teacher,
    };
    setTableData((prevData) => [...prevData, newEntry]);
  }
  else{
    const updatedData = tableData.map((item) =>
      item.key === key ? { ...item, course, teacher } : item
    );

    setTableData(updatedData);
  }
    handleCloseModal();
  }

  useEffect(()=>{
    fetchTeachers();
    fetchRooms();
  })

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(BACKEND_URL + "/teachers", {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });
      setTeacherOptions(response.data.message.map((item: any) => item.name));
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      message.error("Error fetching teacher data.");
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get(BACKEND_URL + "/rooms", {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });
      setRoomOptions(response.data.message.map((item: any) => item.name)); // Assume response.data.message is an array of teacher names
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      message.error("Error fetching room data.");
    }
  };

  function getRecommendation()
  {
    const block=convertTableToString(buttonConvert(buttonStatus));
    const courses=tableData.map((item)=>item.course)
    const teachers=tableData.map((item)=>item.teacher)
    const semester=Number(localStorage.getItem("semester"))
    const rooms=form.getFieldValue("Room")
    console.log(block,courses,teachers,[rooms],semester)
    const promise =axios.post(
    BACKEND_URL+"/suggestTimetable",
    {
      blocks:block,
      courses:courses,
      teachers:teachers,
      rooms:[rooms],
      semester:semester
    },
    {
      headers: {
        authorization: localStorage.getItem("token"),
      }
    });
    toast.promise(promise, {
      loading: "Generating timetable...",
      success: (res) => {
        const statusCode = res.status;
        console.log(res.data.returnVal.timetable)
        switch (statusCode) {
          case statusCodes.OK:
            SetshowTT(true)
            setButtonStatus1(res.data.returnVal.timetable)
            return "Generated timetable!!"
          case statusCodes.UNAUTHORIZED:
            return "You are not authorized!";
          case statusCodes.INTERNAL_SERVER_ERROR:
            return "Internal server error";
          default:
            return "Failed to generate timetable";
        }
      },
      error: (error) => {
        console.error("Error:", error.response?.data || error.message);
        return "Failed to create teacher. Please try again!";
      },
    });
  }

  const handleEditClick = (record: courseList) => {
    handleOpenModal()
    form.setFieldValue("course",record.course)
    form.setFieldValue("teachers",record.teacher)
    form.setFieldValue("key",record.key)
  };

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
                Courses for the Batch
                <Tooltip title="Click on Add to add the courses applicable for the batch">
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
                onOk={handleModalSubmit}
                cancelText="Cancel"
              >
                <Form form={form} layout="vertical">
                  <Form.Item
                    rules={[
                      { required: true, message: "Please input Field 1!" },
                    ]}
                  >
                    <div>
                      <Form.Item name="key" initialValue={null} className="hidden"></Form.Item>
                      <Form.Item label="Course"name="course" rules={[{ required: true, message: "Please select a Course!" }]} >
                      <Input placeholder="Course" />
                      </Form.Item>
                      <Form.Item label="Teacher" name="teachers" rules={[{ required: true, message: "Please select a teacher!" }]}>
                      <Select options={teacherOptions.map((teacher) => ({
                              label: teacher,
                              value: teacher,
                            }))} placeholder="teacher" />
                      </Form.Item>
                    </div>
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </label>
          <SectionAddTable sectionData={tableData} setSectionsData={setTableData} onEditClick={handleEditClick}/>
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
            label="Select default Room" name="Room"
          >
            <Select placeholder="Room" options={roomOptions.map((item)=>({
            label:item,
            value:item}))} className="font-normal w-96" />
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
            <Button
                onClick={getRecommendation}
                className="bg-[#F2F2FDFF] text-[#636AE8FF]"
              >
                Generate
              </Button>
            <Form.Item>
              <Button
                onClick={getRecommendation}
                className="bg-[#636AE8FF] text-[#FFFFFF] w-[75px] h-[32px]"
              >
                Submit
              </Button>
            </Form.Item>
          </div>
          {showTT ? (
            <Timetable
              buttonStatus={buttonStatus1}
              setButtonStatus={setButtonStatus1}
            ></Timetable>
          ) : (
            <></>
          )}
        </Form>
      </motion.div>
    </div>
  );
};

export default AddSectionPage;
