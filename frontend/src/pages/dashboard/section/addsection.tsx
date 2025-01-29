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
import { motion } from "framer-motion";
import { CiImport } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { IoIosInformationCircleOutline } from "react-icons/io";
import SectionAddTable, {
  courseList,
} from "../../../components/SectionPage/sectionaddtable";
import { convertTableToString, fetchCourse, fetchdept, fetchElectives, fetchlabs, fetchRooms, fetchTeachers, stringToTable, timeslots, weekdays } from "../../../utils/main";
import axios from "axios";
import { BACKEND_URL } from "../../../../config";
import { toast } from "sonner";
import { statusCodes } from "../../../types/statusCodes";
import SimpleSwapTimetable from "../../../components/TimetableComponents/SimpleSwapTT";
import UneditableTimeTable from "../../../components/TimetableComponents/uneditableTimetable";

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
  const [tableData, setTableData] = useState<courseList[]>([]);
  const [teacherOptions, setTeacherOptions] = useState<string[]>([]);
  const [roomOptions, setRoomOptions] = useState<string[]>([]);
  const [courseOptions, setCourseOptions] = useState<string[]>([]);
  const [electiveOptions, setElectiveOptions] = useState<string[]>([]);
  const [labOptions, setLabOptions] = useState<string[]>([]);
  const [showTT, SetshowTT] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [timetable,setTimetable]=useState<string[][]>(new Array(6).fill(0).map(() => new Array(6).fill("Free")));
  const [buttonStatus, setButtonStatus] = useState(
    weekdays.map(() => timeslots.map(() => "Free"))
  );
  const [buttonStatus1, setButtonStatus1] = useState(
    weekdays.map(() => timeslots.map(() => "Free"))
  );
  const [roomTT,setRoomTT]=useState("0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0")


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.setFieldValue("course", "");
    form.setFieldValue("teachers", "");
    form.setFieldValue("rooms", "");
  };

  function clearFields() {
    form.resetFields();
    setButtonStatus(weekdays.map(() => timeslots.map(() => "Free")));
    SetshowTT(false);
  }

  const handleModalSubmit = () => {
    const course = form.getFieldValue("course");
    const teacher = form.getFieldValue("teachers");
    const room = form.getFieldValue("rooms")
      ? form.getFieldValue("rooms")
      : "--";
    const key = form.getFieldValue("key");
    if (!course || !teacher) {
      console.error("Fill Course and corresponding Teacher!");
      return;
    }
    if (key == null) {
      const newEntry: courseList = {
        key: `${Date.now()}`,
        course,
        teacher,
        room,
      };
      setTableData((prevData) => [...prevData, newEntry]);
    } else {
      const updatedData = tableData.map((item) =>
        item.key === key ? { ...item, course, teacher, room } : item
      );

      setTableData(updatedData);
    }
    handleCloseModal();
  };

  useEffect(() => {
    fetchTeachers(setTeacherOptions);
    fetchRooms(setRoomOptions);
    fetchCourse(setCourseOptions);
    fetchElectives(setElectiveOptions);
    fetchlabs(setLabOptions);
  }, []);
  
  async function getRecommendation() {
    const block = buttonStatus.map((row) => [...row]); // Create a deep copy of buttonStatus
    const courses = tableData.map((item) => item.course);
    const teachers = tableData.map((item) => item.teacher);
    const rooms = tableData.map((item) => (item.room === "--" ? "0" : item.room));
    const semester = Number(localStorage.getItem("semester"));
    const Prefrooms = form.getFieldValue("Room");
    const elective = form.getFieldValue("Electives");
    const lab = form.getFieldValue("Labs");
  
    try {
      // Process elective timetable if defined
      if (elective !== undefined) {
        const electiveResponse = await axios.post(
          BACKEND_URL + "/electives/peek",
          {
            name: elective,
            semester,
          },
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        );

        if (electiveResponse.status === 200) {
          const eleTT = stringToTable(electiveResponse.data.message.timetable);
          for (let i = 0; i < eleTT.length; i++) {
            for (let j = 0; j < eleTT[i].length; j++) {
              if (eleTT[i][j] !== "Free") {
                block[i][j] = eleTT[i][j];
              }
            }
          }
        } else {
          console.error("Failed to fetch elective timetable");
          return;
        }
      }
  
      // Process lab timetable if defined
      if (lab !== undefined) {
        const labResponse = await axios.post(
          BACKEND_URL + "/labs/peek",
          {
            name: lab,
            semester,
          },
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        );
  
        if (labResponse.status === 200) {
          const labTT = stringToTable(labResponse.data.message.timetable);
          for (let i = 0; i < labTT.length; i++) {
            for (let j = 0; j < labTT[i].length; j++) {
              if (labTT[i][j] !== "Free") {
                block[i][j] = labTT[i][j];
              }
            }
          }
        } else {
          console.error("Failed to fetch lab timetable");
          return;
        }
      }
  
      // Generate the final timetable
      console.log(courses);
      const promise = axios.post(
        BACKEND_URL + "/suggestTimetable",
        {
          blocks: convertTableToString(block),
          courses: courses,
          teachers: teachers,
          rooms: rooms,
          semester: semester,
          preferredRooms: Prefrooms,
        },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
  
      toast.promise(promise, {
        loading: "Generating timetable...",
        success: (res) => {
          const statusCode = res.status;
          console.log(res.data)
          switch (statusCode) {
            case statusCodes.OK:
              SetshowTT(true);
              const convertedTimetable = res.data.returnVal.display.map(
                (row:any) =>
                  row.map((value:any) =>
                    value === "0" ? "Free" : value === "1" ? "Blocked" : value
                  )
              );
              setRoomTT(convertTableToString(res.data.returnVal.roomtable));
              setButtonStatus1(convertedTimetable);
              setTimetable(res.data.returnVal.timetable);
              return "Generated timetable!!";
            case statusCodes.UNAUTHORIZED:
              return "You are not authorized!";
            case statusCodes.INTERNAL_SERVER_ERROR:
              return "Internal server error";
            default:
              return "Failed to generate timetable";
          }
        },
        error: (error) => {
          console.error("Error:", error.response || error.message);
          return "Failed to generate timetable. Please try again!";
        },
      });
    } catch (error:any) {
      console.error("Error:", error.message);
      toast.error("An error occurred while processing the timetable.");
    }
  }
  
  
  const handleEditClick = (record: courseList) => {
    handleOpenModal();
    form.setFieldValue("course", record.course);
    form.setFieldValue("teachers", record.teacher);
    form.setFieldValue("rooms", record.room);
    form.setFieldValue("key", record.key);
  };

  const handleSubmit=()=>{
      const name=form.getFieldValue("className");
      const courses=tableData.map((item)=>item.course)
      const teachers=tableData.map((item)=>item.teacher)
      const rooms=tableData.map((item)=>item.room==="--"?"0":item.room)
      const defaultRooms=form.getFieldValue("Room")?form.getFieldValue("Room"):null
      const electives=form.getFieldValue("Electives")?form.getFieldValue("Electives"):null
      const labs=form.getFieldValue("Labs")?form.getFieldValue("Labs"):null
      const courseTT=convertTableToString(buttonStatus1);
      console.log(courseTT)
      const timetables= (timetable.map((row=>row.join(',')))).join(';');
      console.log(name,courses,teachers,rooms,timetable)
      const promise= axios.post(
        BACKEND_URL+"/saveTimetable",
        { 
          name:name,
          courses:courses,
          teachers:teachers,
          rooms:rooms,
          electives:electives,
          labs:labs,
          defaultRooms:defaultRooms,
          semester:Number(localStorage.getItem("semester")),
          timetable:timetables,
          roomTimetable: roomTT,
          courseTimetable:courseTT
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
          const statusCode = res.data.status;
          console.log(res.data)
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
    {
      showTT ? <></> : getRecommendation();
    }
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
              Modal.destroyAll();
            }}
          >
            View TimeTable
          </Button>
          <div className="space-x-2">
            <Button onClick={() => Modal.destroyAll()}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => {
                handleSubmit();
                Modal.destroyAll();
              }}
            >
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
        <Form
          {...formItemLayout}
          onValuesChange={() => SetshowTT(false)}
          form={form}
          layout="vertical"
          requiredMark
          className="w-200"
        >
          <Form.Item name="className" label="Class Name" required className="w-96">
            <Input placeholder="Name" className="font-inter font-normal" />
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
                <Form form={form} layout="vertical" >
                  <Form.Item
                  rules={[
                    { required: true, message: "Please input Field 1!" },
                  ]}
                  >
                  <div>
                    <Form.Item
                    name="key"
                    initialValue={null}
                    className="hidden"
                    ></Form.Item>
                    <Form.Item
                    required
                    label="Course"
                    name="course"
                    rules={[
                      {
                      required: true,
                      message: "Please select a Course!",
                      },
                    ]}
                    >
                    <Select
                      className="w-full"
                      options={courseOptions.map((course) => ({
                      label: course,
                      value: course,
                      }))}
                      placeholder="Course"
                    />
                    </Form.Item>
                    <Form.Item
                    required
                    label="Teacher"
                    name="teachers"
                    rules={[
                      {
                      required: true,
                      message: "Please select a teacher!",
                      },
                    ]}
                    >
                    <Select
                      className="w-full"
                      options={teacherOptions.map((teacher) => ({
                      label: teacher,
                      value: teacher,
                      }))}
                      placeholder="teacher"
                    />
                    </Form.Item>
                    <Form.Item
                    label="Any particular room to be used?"
                    name="rooms"
                    >
                    <Select
                      className="w-full"
                      options={roomOptions.map((room) => ({
                      value: room,
                      label: room,
                      }))}
                      placeholder="default room"
                    />
                    </Form.Item>
                  </div>
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </label>
          <SectionAddTable
            sectionData={tableData}
            setSectionsData={setTableData}
            onEditClick={handleEditClick}
          />
          <br></br>
          <Form.Item name="Electives" label="Electives and Common time courses"className="w-96">
            <Select options={electiveOptions.map((ecourse) => ({
                            label: ecourse,
                            value: ecourse,
                          }))} placeholder="Electives" className="font-normal w-96" />
          </Form.Item>
          <Form.Item name="Labs" label="Lab courses applicable for the section" className="w-96">
            <Select options={labOptions.map((lcourse) => ({
                            label: lcourse,
                            value: lcourse,
                          }))} placeholder="Labs" className="font-normal w-96" />
          </Form.Item>
          <Form.Item
            label="Select the default Room for the section"
            name="Room"
            className="w-96"
          >
            <Select
              placeholder="Room"
              options={roomOptions.map((item) => ({
                label: item,
                value: item,
              }))}
              className="font-normal w-96"
            />
          </Form.Item>
          <label className="flex items-center">
            <span>
              Block the timeslots where you do not want the courses to be
              allocated
            </span>
            <Tooltip title="Click on the timeslots where to the teacher is busy to set them to busy">
              <IoIosInformationCircleOutline className="ml-2 text-[#636AE8FF]" />
            </Tooltip>
          </label>
          <div className="flex justify-left">
            <UneditableTimeTable
              buttonStatus={buttonStatus}
              setButtonStatus={setButtonStatus}
              editable={true}
            />
          </div>
            <div className="flex space-x-4 justify-end w-[55vm] mr-4">
            <Form.Item>
              <Button
              onClick={clearFields}
              className="border-[#636AE8FF] text-[#636AE8FF] w-[75px] h-[32px]"
              >
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
                <SimpleSwapTimetable
                  buttonStatus={buttonStatus1}
                  setButtonStatus={setButtonStatus1}
                  courses = {tableData.map((item) => item.course)}
                  teachers = {tableData.map((item) => item.teacher)}
                  rooms = {tableData.map((item) => (item.room === "--" ? form.getFieldValue("Room")?form.getFieldValue("Room"):roomTT.split(';').map((row)=>row.split(',')) .reduce((acc, row) => {
                    const mostFrequent = row.reduce((a, b) =>
                      row.filter(v => v === a).length >= row.filter(v => v === b).length ? a : b
                    );
                    return mostFrequent === "0" ? acc : mostFrequent;
                  }, "0"): item.room))}
                  timetable={timetable}
                  setTimetable={setTimetable}
                  roomTT={roomTT}
                  setRoomTT={setRoomTT}
                  // timetableScore={timetableScore}
                ></SimpleSwapTimetable>
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
