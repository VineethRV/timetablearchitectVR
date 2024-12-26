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
import Timetable from "../../../../components/timetable";
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
  key:string,
  courseSet: string;
  course: string;
  teachers: string[];
  rooms: string[];
}

const AddLabPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [numberOfBatches, setNumberOfBatches] = useState(1); // Dynamic batches
  const [formFields, setFormFields] = useState<BatchField[]>([]);
  const [teacherOptions, setTeacherOptions] = useState<string[]>([]);
  const [electiveOptions, setElectiveOptions] = useState<string[]>([]);
  const [showTT,SetshowTT]=useState(0)
  const semester = 5;
  const [roomOptions, setRoomOptions] = useState<string[]>([]);
  const [buttonStatus, setButtonStatus] = useState(
    weekdays.map(() => timeslots.map(() => "Free"))
  );
  const [buttonStatus1, setButtonStatus1] = useState(
    weekdays.map(() => timeslots.map(() => "Free"))
  );
  const [tableData, setTableData] = useState<BatchField[]>([]);
  const [editingRecord, setEditingRecord] = useState<BatchField[]|null>(null);

  const navigate = useNavigate();

  const handleOpenModal = () => {
    const currentBatches = form.getFieldValue("numberOfBatches");
    setNumberOfBatches(currentBatches || 1);
    setFormFields(
      Array.from({ length: currentBatches || 1 }, (_, i) => ({
        key: `${i}`,
        courseSet: "",
        course: "",
        teachers: [""],
        rooms: [""],
      }))
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form1.resetFields();
  };

  const handleEditBatch = (records: BatchField[]) => {
    // Update formFields dynamically with the edited records
    setFormFields((prevFields) => {
      return prevFields.map((batch, index) => {
        const updatedBatch = records[index];
  
        return {
          ...batch,
          courseSet: updatedBatch.courseSet,
          course: updatedBatch.course,
          // Split teachers string into individual tags and trim spaces
          teachers: updatedBatch.teachers
            .flatMap((teacher) => teacher.split(",").map((t) => t.trim())),
          rooms: updatedBatch.rooms,
        };
      });
    });
  };

  const fetchdept = async (): Promise<string> => {
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
        return response.data.message.department; // Returns the department if status is 200
      }
      return ""; // Return an empty string if the status is not 200
    } catch (error) {
      console.log(error);
      return ""; // Return an empty string in case of an error
    }
  };
  
  const handleBatchChange = (
    index: number,
    field: keyof BatchField,
    value: string
  ) => {
    const updatedFields = [...formFields];
  
    if (field === "teachers"||field==="rooms") {
      updatedFields[index][field] = [value];
    } else {
      updatedFields[index][field] = value;
    }
  
    setFormFields(updatedFields);
  };

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
  const fetchElectives = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Authorization token is missing!");
        return;
      }
      const department: string = await fetchdept();
      const response = await axios.get(BACKEND_URL + "/electives", {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          semester,
          department,
        },
      });
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
    fetchElectives();
    setTableData(tableData);
  }, [tableData]);

  function convertTableToString(timetable: string[][] | null): string {
    if (timetable) {
      return timetable.map((row) =>row.map((cell) => (cell === "Free" ? "0" : cell)).join(",")).join(";");
    }
    return "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0";
  }

    const handleModalSubmit = () => {
      const courset = formFields.map((batch) => batch.course).join("/");
    
      const updatedBatches = formFields.map((batch) => ({
        ...batch,
        courseSet: courset, // Set courseSet dynamically as concatenated course names
      }));
      setTableData((prevData) => {
        if (editingRecord) {
          // If editingRecord exists, update the corresponding record
          return prevData.map((data) =>
            data.courseSet === editingRecord[0].courseSet // Match the unique identifier (e.g., `key`)
              ? { ...data, ...updatedBatches[0] } // Update the matching record
              : data
          );
        }
        // If no editingRecord, add new records
        return [...prevData, ...updatedBatches];
      });
    setIsModalOpen(false);
    setEditingRecord(null)
    handleCloseModal();
  };

  const convertToTimetable=(time:string)=>{
    setButtonStatus1(time.split(";").map((row) => row.split(",").map((value)=>(value==="0"?"Free":value))))
  }

  const getRecommendation = async () => {
    try {
      const { courseSets, teachers, rooms } = getCourseData(tableData);
      if (!courseSets.length || !teachers.length || !rooms.length) {
        message.error("Please ensure all fields are filled!");
        return;
      }
      const response = await axios.post(
        BACKEND_URL + "/getLabRecommendation",
        {
          courses:courseSets,
          teachers:teachers,
          rooms:rooms,
          blocks:convertTableToString(buttonStatus)
        },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.status === 200) {
        message.success("Timetable recommendations fetched successfully!");
        SetshowTT(1);
        convertToTimetable(response.data.timetable)
        
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
 
const getCourseData = (tableData: BatchField[]): { courseSets: string[]; teachers: string[][]; rooms: string[][] } => {
  // Reduce the tableData into a single record
  const courseData = tableData.reduce(
    (acc, item) => {
      const { courseSet, teachers, rooms } = item;
      console.log(2)
      // Ensure entries exist for this courseSet
      if (!acc.courseSets.includes(courseSet)) {
        acc.courseSets.push(courseSet);
      }
        console.log(3)
      if (!acc.teachers[courseSet]) {
        acc.teachers[courseSet] = [];
      }
      const teacherList:string[]=[];
      teachers.forEach((teacher) => {
        teacher.split(",").forEach((t) => {
          teacherList.push(t.trim());
        });
      });
      console.log(1)
      console.log("teacherlsit",teacherList)
      acc.teachers[courseSet].push(...teacherList);

      // Add rooms for this courseSet
      if (!acc.rooms[courseSet]) {
        acc.rooms[courseSet] = [];
      }
      acc.rooms[courseSet].push(...rooms);

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
        timetables: buttonStatus1,
        department: "Computer Science Engineering",
      },
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );
    if (response.data.status === 200) {
      message.success("Added successfully!");
    } else {
      message.error(response.data.message || "Failed to add");
    }
  };

  return (
    <div className="text-xl font-bold text-[#171A1F] pl-8 py-6 h-screen overflow-y-scroll">
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
                    <Form.Item label="course" name={`course-${index}`}>
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
                          handleBatchChange(index, "teachers", val.join(","))
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
                          handleBatchChange(index, "rooms", val.join(","))
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
          <br></br>
          <LabAddTable
            data={tableData.map((batch, index) => ({
              key: `${index}`,
              courseSet: batch.courseSet,
              course: batch.course,
              teachers: batch.teachers,
              rooms: batch.rooms,
            }))}
            batchsize={numberOfBatches}
            onEditClick={(records) => {
              for(let index=0;index<records.length;index++){
              form1.setFieldValue(`course-${index}`,records[index].course)
              form1.setFieldValue(`teacher-${index}`,records[index].teachers)
              form1.setFieldValue(`room-${index}`,records[index].rooms)
              handleOpenModal()
              }
              setEditingRecord(
                records.map((record: BatchField) => ({
                  ...record,
                  teachers: record.teachers.flatMap((teacher: string) => {
                    console.log(teacher);  // Inspect each teacher value
                    return teacher.split(",").map((t) => t.trim());
                  }),
                }))
              );
            }}
          />
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
            
            {(showTT)?<Timetable 
            buttonStatus={buttonStatus1}
            setButtonStatus={setButtonStatus1}></Timetable>:<></>}
        </Form>
      </motion.div>
    </div>
  );
};

export default AddLabPage;
