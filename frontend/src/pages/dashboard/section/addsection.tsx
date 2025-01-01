"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { fetchdept } from "../courses/corecourse/corecoursedisplay";

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
  const [courseOptions, setCourseOptions] = useState<string[]>([]);
  const [showTT, SetshowTT] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
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
    form.setFieldValue("rooms","");
  };

  function clearFields() {
    form.resetFields()
    setButtonStatus(weekdays.map(() => timeslots.map(() => "Free")));
    SetshowTT(false);
  }

  const handleModalSubmit=()=>{
    const course=form.getFieldValue("course")
    const teacher=form.getFieldValue("teachers")
    const room=form.getFieldValue("rooms")?form.getFieldValue("rooms"):"--"
    const key=form.getFieldValue("key")
    if (!course || !teacher) {
      console.error("Fill Course and corresponding Teacher!");
      return;
    }
    if(key==null)
{
    const newEntry: courseList = {
      key: `${Date.now()}`, 
      course,
      teacher,
      room,
    };
    setTableData((prevData) => [...prevData, newEntry]);
  }
  else{
    const updatedData = tableData.map((item) =>
      item.key === key ? { ...item, course, teacher,room } : item
    );

    setTableData(updatedData);
  }
    handleCloseModal();
  }

  useEffect(()=>{
    fetchTeachers();
    fetchRooms();
    fetchCourse();
  },[])

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
      setRoomOptions(response.data.message.map((item: any) => item.name));
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      message.error("Error fetching room data.");
    }
  };

  const fetchCourse = async () => {
    const department =fetchdept();
    const semester=localStorage.getItem("semester");
    axios
      .get(BACKEND_URL + "/courses", {
        headers: {
          authorization: localStorage.getItem("token"),
        },
        params: {
          semester,
          department,
        },
      })
      .then((res) => {
        const status = res.data.status;
        console.log(res.data.message)
        if (status == statusCodes.OK) {
          setCourseOptions(res.data.message.map((item: any) => item.name));
        } else {
          message.error("Failed to fetch courses !!");
        }
      });
  };

  function getRecommendation()
  {
    const block=convertTableToString(buttonConvert(buttonStatus));
    const courses=tableData.map((item)=>item.course)
    const teachers=tableData.map((item)=>item.teacher)
    const rooms=tableData.map((item)=>item.room==="--"?"0":item.room)
    const semester=Number(localStorage.getItem("semester"))
    const Prefrooms=form.getFieldValue("Room")
    console.log(block,courses,teachers,rooms,semester)
    const promise =axios.post(
    BACKEND_URL+"/suggestTimetable",
    {
      blocks:block,
      courses:courses,
      teachers:teachers,
      rooms:rooms,
      semester:semester,
      preferredRooms:Prefrooms
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
            const convertedTimetable = res.data.returnVal.timetable.map((row: any[]) =>
              row.map(value => (value === "0" ? "Free" : value === "1" ? "Blocked" : value))
            );
            setButtonStatus1(convertedTimetable);
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
        return "Failed to generate timetable. Please try again!";
      },
    });
  }

  const handleEditClick = (record: courseList) => {
    handleOpenModal()
    form.setFieldValue("course",record.course)
    form.setFieldValue("teachers",record.teacher)
    form.setFieldValue("rooms",record.room)
    form.setFieldValue("key",record.key)
  };

  const handleSubmit=()=>{
      const name=form.getFieldValue("className");
      const batch=form.getFieldValue("classBatch");
      const courses=tableData.map((item)=>item.course)
      const teachers=tableData.map((item)=>item.teacher)
      const rooms=tableData.map((item)=>item.room==="--"?"0":item.room)
      const semester=Number(localStorage.getItem("semester"))
      const defaultRooms=form.getFieldValue("Room")
      const timetable= convertTableToString(buttonStatus1)
      const promise= axios.post(
        BACKEND_URL+"/saveTimetable",
        { 
          name:name,
          batch:batch,
          courses:courses,
          teachers:teachers,
          rooms:rooms,
          defaultRooms:defaultRooms,
          semester:semester,
          timetable:timetable
        },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          }
        }
      );
      toast.promise(promise, {
        loading: "Saving timetable...",
        success: (res) => {
          const statusCode = res.status;
          switch (statusCode) {
            case statusCodes.OK:
              form.resetFields();
              SetshowTT(false)
              return "Saved timetable!!"
            case statusCodes.UNAUTHORIZED:
              return "You are not authorized!";
            case statusCodes.INTERNAL_SERVER_ERROR:
              return "Internal server error";
            default:
              return "Failed to save timetable";
          }
        },
        error: (error) => {
          console.error("Error:", error.response?.data || error.message);
          return "Failed to save timetable. Please try again!";
        },
      });
  }


  const handleSaveTimetable = () => {
    {showTT?<></>:getRecommendation();}
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you want to save the generated timetable?",
      onOk: () => {
        handleSubmit();
      },
      onCancel: () => {
        message.info("Action cancelled. The timetable was not saved.");
      },
      footer: (
        <div className="flex justify-between">
         <Button
          onClick={() => {
            handleViewTimetable();
            Modal.destroyAll(); }}>
          View TimeTable
        </Button>
          <div className="space-x-2">
            <Button onClick={() => Modal.destroyAll()}>Cancel</Button>
            <Button type="primary" onClick={() => {
              handleSubmit();
              Modal.destroyAll();
            }}>
              Save
            </Button>
          </div>
        </div>
      ),
    });
  };

  const handleViewTimetable = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
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
        <Form {...formItemLayout} onValuesChange={()=>SetshowTT(false)} form={form} layout="vertical" requiredMark className="w-96">
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
                      <Form.Item required label="Course"name="course" rules={[{ required: true, message: "Please select a Course!" }]} >
                      <Select options={courseOptions.map((course) => ({
                              label: course,
                              value: course,
                            }))} placeholder="Course" />
                      </Form.Item>
                      <Form.Item required label="Teacher" name="teachers" rules={[{ required: true, message: "Please select a teacher!" }]}>
                      <Select options={teacherOptions.map((teacher) => ({
                              label: teacher,
                              value: teacher,
                            }))} placeholder="teacher" />
                      </Form.Item>
                      <Form.Item label="Any particular room to be used?" name="rooms">
                      <Select options={roomOptions.map((room) => ({
                        value: room,
                        label: room,
                            }))} placeholder="default room" />
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
            label="Select the default Room for the section" name="Room"
          >
            <Select placeholder="Room" options={roomOptions.map((item)=>({
            label:item,
            value:item}))} className="font-normal w-96" />
          </Form.Item>
          <label className="flex items-center">
            <span>Block the timeslots where you do not want the courses to be allocated</span>
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
                onClick={handleSaveTimetable}
                className="bg-[#636AE8FF] text-[#FFFFFF] w-[75px] h-[32px]"
              >
                Save
              </Button>
            </Form.Item>
          </div>
          <div ref={bottomRef}>
          {showTT ? (
            <div>
              <label>Generated Timetable</label>
            <Timetable
              buttonStatus={buttonStatus1}
              setButtonStatus={setButtonStatus1}
            ></Timetable>
            </div>
          ) : (
            <></>
          )}
          </div>
        </Form>
      </motion.div>
    </div>
  );
};

export default AddSectionPage;
