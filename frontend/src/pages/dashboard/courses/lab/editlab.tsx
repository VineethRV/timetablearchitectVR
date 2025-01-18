import { useEffect, useState } from "react";
import { CiImport } from "react-icons/ci";
import { IoIosInformationCircleOutline } from "react-icons/io";
import {
  Button,
  message,
  Form,
  Input,
  Select,
  Tooltip,
  Upload,
  InputNumber,
  Modal,
} from "antd";
import { motion } from "framer-motion";
import Timetable from "../../../../components/TimetableComponents/timetable";
import { useNavigate } from "react-router-dom";
import LabAddTable from "../../../../components/CoursePage/Labaddtable";
import axios from "axios";
import { BACKEND_URL } from "../../../../../config";

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
interface BatchField {
  courseSet: string; // Add batchSet here
  name: string;
  course: string;
  teacher: string;
  room: string;
}

const AddLabPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [_numberOfBatches, setNumberOfBatches] = useState(1); // Dynamic batches
  const [formFields, setFormFields] = useState<BatchField[]>([]);
  const [teacherOptions, setTeacherOptions] = useState<string[]>([]);
  const [electiveOptions, setElectiveOptions] = useState<string[]>([]);
  const semester = 5;
  const department = "Computer Science Engineering";
  const [roomOptions, setRoomOptions] = useState<string[]>([]);
  const [buttonStatus, setButtonStatus] = useState(
    weekdays.map(() => timeslots.map(() => "Free"))
  );
  const [tableData, setTableData] = useState<BatchField[]>([]);

  const navigate = useNavigate();

  const handleOpenModal = () => {
    const currentBatches = form.getFieldValue("numberOfBatches");
    setNumberOfBatches(currentBatches || 1);
    setFormFields(
      Array.from({ length: currentBatches || 1 }, (_, i) => ({
        name: `batch${i + 1}`,
        courseSet: "",
        course: "",
        teacher: "",
        room: "",
      }))
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form1.resetFields();
  };

  const handleBatchChange = (
    index: number,
    field: keyof BatchField,
    value: string
  ) => {
    const updatedFields = [...formFields];
    updatedFields[index][field] = value;
    setFormFields(updatedFields);
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(BACKEND_URL + "/teachers", {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });
      setTeacherOptions(response.data.message.map((item: any) => item.name)); // Assume response.data.message is an array of teacher names
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      message.error("Error fetching teacher data.");
    }
  };
  const _fetchElectives = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Authorization token is missing!");
        return;
      }

      const response = await axios.get(BACKEND_URL + "/electives", {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          semester,
          department,
        },
      });
      console.log(response.data)
      if (response.data.status === 200) {
        setElectiveOptions(response.data.message); // Assuming `message` contains the array of electives
      } else {
        message.error(response.data.message || "Failed to fetch electives.");
      }
    } catch (error) {
      message.error("An error occurred while fetching electives.");
      console.error(error);
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
  useEffect(() => {
    fetchTeachers();
    fetchRooms();
    //fetchElectives();
  }, []);
  const handleModalSubmit = () => {
    const validBatches = formFields.filter(
      (field) => field.course && field.teacher && field.room
    );

    console.log(validBatches);
    if (validBatches.length !== formFields.length) {
      messageApi.error("Please fill in all required fields.");
      return;
    }
    const courset = validBatches.map((batch) => batch.course).join("/");

    const updatedBatches = validBatches.map((batch) => ({
      ...batch,
      courseSet: courset, // Set courseSet dynamically as concatenated course names
    }));

    setTableData((prevData) => [...prevData, ...updatedBatches]);
    setIsModalOpen(false);

    handleCloseModal();
  };

  const getRecommendation = async () => {
    try {
      const { courseSets, teachers, rooms } = getCourseData(tableData);
      if (!courseSets.length || !teachers.length || !rooms.length) {
        message.error("Please ensure all fields are filled!");
        return;
      }
      console.log({ courseSets, teachers, rooms });
      const response = await axios.post(
        BACKEND_URL + "/getLabRecommendation",
        {
          courseSets,
          teachers,
          rooms,
        },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.status === 200) {
        message.success("Timetable recommendations fetched successfully!");
        console.log("Timetable:", response.data.timetable);
      } else {
        message.error(
          response.data.message || "Failed to fetch recommendations."
        );
      }
    } catch (error) {
      console.error("Error fetching lab recommendations:", error);
      message.error("An error occurred while fetching recommendations.");
    }
  };
  
  const getCourseData = (tableData: { courseSet: string; teacher: string; room: string }[]) => {
    // Reduce the tableData into a single record
    const courseData = tableData.reduce(
      (acc, item) => {
        const { courseSet, teacher, room } = item;
  
        // Ensure entries exist for this courseSet
        if (!acc.courseSets.includes(courseSet)) {
          acc.courseSets.push(courseSet);
        }
  
        // Add teachers for this courseSet
        if (!acc.teachers[courseSet]) {
          acc.teachers[courseSet] = [];
        }
        acc.teachers[courseSet].push(...teacher.split(",").map((t) => t.trim()));
  
        // Add rooms for this courseSet
        if (!acc.rooms[courseSet]) {
          acc.rooms[courseSet] = [];
        }
        acc.rooms[courseSet].push(...room.split(",").map((r) => r.trim()));
  
        return acc;
      },
      {
        courseSets: [] as string[], // List of unique courseSets
        teachers: {} as Record<string, string[]>, // Teachers grouped by courseSet
        rooms: {} as Record<string, string[]> // Rooms grouped by courseSet
      }
    );
  
    // Convert teachers and rooms to lists of arrays
    const teachers = Object.values(courseData.teachers);
    const rooms = Object.values(courseData.rooms);
  
    return {
      courseSets: courseData.courseSets,
      teachers,
      rooms
    };
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Authorization token is missing!");
      navigate("/signIn");
      return;
    }
    const { courseSets, teachers, rooms } = getCourseData(tableData);
    const response = await axios.post(
      BACKEND_URL + "/labs",
      {
        name: form.getFieldValue("batchSetName"),
        semester: semester,
        batches: courseSets,
        teachers: teachers,
        rooms: rooms,
        timetables: buttonStatus,
        department: "Computer Science Engineering",
      },
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );
    console.log(response.data)
    if (response.data.status === 200) {
      message.success("Added successfully!");
    } else {
      message.error(response.data.message || "Failed to add");
    }
  };

  return (
    <div className="text-xl font-bold text-[#171A1F] pl-8 py-6 h-screen overflow-y-scroll">
      {contextHolder}
      <div className="flex px-2 items-center justify-between text-[#636AE8FF] text-xl text-bold">
        <div
          onClick={() => {
            navigate("/dashboard/courses/labs");
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
        className="flex mt-12 items-center pl-4"
      >
        <Form {...formItemLayout} form={form} layout="vertical" requiredMark>
          <Form.Item name="batchSetName" label="Batch Set Name" required>
            <Input placeholder="Name" className="font-normal w-96" />
          </Form.Item>
          <Form.Item
            label="Number of Batches"
            name="numberOfBatches"
            initialValue={1}
            rules={[
              {
                required: true,
                message: "Please specify the number of batches!",
              },
            ]}
          >
            <InputNumber
              min={1}
              className="font-normal w-96"
              placeholder="Number of Batches"
              onChange={(value) => setNumberOfBatches(value || 1)}
            />
          </Form.Item>
          <label>
            <div>
              <span className="inline-flex items-center space-x-10">
                Lab Courses for the Batch
                <Tooltip title="Click on Add to add the lab courses applicable for the batch">
                  <IoIosInformationCircleOutline className="ml-2 text-[#636AE8FF]" />
                </Tooltip>
              </span>
              <span
                onClick={handleOpenModal}
                className="ml-4 text-[#636AE8FF] space-y-2"
              >
                &#x002B; Add
              </span>
              <Modal
                visible={isModalOpen}
                title="Enter Batch Details"
                onCancel={handleCloseModal}
                onOk={handleModalSubmit}

              >
                <Form form={form1}>
                {formFields.map((_, index) => (
                  <div key={index}>
                    <label className="text-base font-semibold space-y-2">Batch {index+1}</label>
                    <Form.Item label="Course" name={`course-${index}`}>
                      <Input
                        placeholder="Enter course"
                        onChange={(e) =>
                          handleBatchChange(index, "course", e.target.value)
                        }
                      />
                    </Form.Item>
                    <Form.Item label="Teacher" name={`teacher-${index}`}>
                      <Select
                        mode="tags"
                        placeholder="Select Teachers"
                        onChange={(val) =>
                          handleBatchChange(index, "teacher", val.join(","))
                        }
                        options={teacherOptions.map((teacher) => ({
                          label: teacher,
                          value: teacher,
                        }))}
                      />
                    </Form.Item>
                    <Form.Item label="Room" name={`room-${index}`}>
                      <Select
                        mode="tags"
                        placeholder="Enter Room Details"
                        onChange={(val) =>
                          handleBatchChange(index, "room", val.join(","))
                        }
                        options={roomOptions.map((room) => ({
                          label: room,
                          value: room,
                        }))}
                      />
                    </Form.Item>
                  </div>
                ))}
                </Form>
              </Modal>
            </div>
          </label>
          {/* <LabAddTable
            data={tableData.map((batch, index) => ({
              key: `${index}`,
              courseSet: batch.courseSet,
              Course: batch.course,
              teachers: [batch.teacher],
              rooms: [batch.room],
            }))}
          /> */}
          <br />
          <Form.Item label="Electives and Common time courses" className="w-96">
            <Select
              options={electiveOptions.map((elective) => ({
                value: elective,
                label: elective,
              }))}
              placeholder="Electives"
              className="font-normal"
            />
          </Form.Item>
          <label>
            <div className="flex items-center">
              <span>
                Click on the slots you do not want the lab to be allotted
              </span>
            </div>
          </label>
          <Timetable
            buttonStatus={buttonStatus}
            setButtonStatus={setButtonStatus}
          />
          <div className="flex justify-end">
            <div className="flex space-x-4">
                <Button className="border-[#636AE8FF] text-[#636AE8FF]">
                  Clear
                </Button>
                <Button
                  onClick={getRecommendation}
                  className="bg-[#F2F2FDFF] text-[#636AE8FF]"
                >
                  Generate
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-primary text-[#FFFFFF]"
                >
                  Submit
                </Button>
            </div>
          </div>
        </Form>
      </motion.div>
    </div>
  );
};

export default AddLabPage;
