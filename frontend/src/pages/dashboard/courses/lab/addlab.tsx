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
import { timeslots, weekdays } from "../../../../utils/main";
import { toast } from "sonner";
import SwapTimetable from "../../../../components/TimetableComponents/SwapTimetable";

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

interface BatchField {
  key: string;
  courseSet: string;
  course: string;
  teachers: string[];
  rooms: string[];
}
export const convertToTimetable = (setButtonStatus1:(value: React.SetStateAction<string[][]>) => void,time: string) => {
  setButtonStatus1(
    time
      .split(";")
      .map((row) =>
        row.split(",").map((value) => (value === "0" ? "Free" : value))
      )
  );
};


const AddLabPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [numberOfBatches, setNumberOfBatches] = useState(1); // Dynamic batches
  const [formFields, setFormFields] = useState<BatchField[]>([]);
  const [teacherOptions, setTeacherOptions] = useState<string[]>([]);
  const [electiveOptions, setElectiveOptions] = useState<string[]>([]);
  const [showTT, SetshowTT] = useState(false);
  const semester = Number(localStorage.getItem("semester"));
  const [roomOptions, setRoomOptions] = useState<string[]>([]);
  const [buttonStatus, setButtonStatus] = useState(
    weekdays.map(() => timeslots.map(() => "Free"))
  );
  const [buttonStatus1, setButtonStatus1] = useState(
    weekdays.map(() => timeslots.map(() => "Free"))
  );
  const [tableData, setTableData] = useState<BatchField[]>([]);
  const [editingRecord, setEditingRecord] = useState<BatchField[] | null>(null);

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

  const handleBatchChange = (
    index: number,
    field: keyof BatchField,
    value: string
  ) => {
    const updatedFields = [...formFields];

    if (field === "teachers" || field === "rooms") {
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
      const response = await axios.get(BACKEND_URL + "/electives", {
        headers: {
          authorization: token,
        },
        params: {
          semester,
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
      return timetable
        .map((row) =>
          row.map((cell) => (cell === "Free" ? "0" : cell)).join(",")
        )
        .join(";");
    }
    return "0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0;0,0,0,0,0,0";
  }

  const handleModalSubmit = () => {
    const currentBatches = form.getFieldValue("numberOfBatches");
    const newFormFields = Array.from(
      { length: currentBatches || 1 },
      (_, index) => ({
        key: `${index}`,
        courseSet: "",
        course: form1.getFieldValue(`course-${index}`),
        teachers: form1.getFieldValue(`teacher-${index}`),
        rooms: [form1.getFieldValue(`room-${index}`)],
      })
    );

    for (const field of newFormFields) {
      console.log(field);
      if (!field.course || !field.teachers || !field.rooms) {
        toast.info("Please enter all fields to continue");
        return;
      }
    }

    const courset = newFormFields.map((batch) => batch.course).join("/");

    const updatedBatches = newFormFields.map((batch) => ({
      ...batch,
      courseSet: courset,
    }));
    console.log(updatedBatches)
    setFormFields(newFormFields);
    setTableData((prevData) => {
      if (editingRecord) {
        return prevData
          .filter((data) => data.courseSet !== editingRecord[0].courseSet) // Remove old batches for the edited courseSet
          .concat(updatedBatches); // Add the updated batches
      }

      // If no editingRecord, add new records
      return [...prevData, ...updatedBatches];
    });

    setIsModalOpen(false);
    setEditingRecord(null);
    handleCloseModal();
  };

  const getRecommendation = async () => {
    try {
      const { courseSets, teachers, rooms } = getCourseData(tableData);
      if (!courseSets.length || !teachers.length || !rooms.length) {
        message.error("Please ensure all fields are filled!");
        return;
      }
      console.log(courseSets,teachers,rooms,convertTableToString(buttonStatus))
      const response = await axios.post(
        BACKEND_URL + "/getLabRecommendation",
        {
          courses: courseSets,
          teachers: teachers,
          rooms: rooms,
          blocks: convertTableToString(buttonStatus),
        },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      
      // here is the get scores of the slot endpoint
      const scoreResponse = await axios.post(BACKEND_URL + '/recommendLab', {
        Lteachers: teachers,
        Lrooms: rooms,
        blocks: convertTableToString(buttonStatus),
      },
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
      )

      console.log("score ...")
      console.log(scoreResponse)
      console.log("score ...")

      console.log(response.status,response.data)
      if (response.data.status === 200) {
        message.success("Timetable recommendations fetched successfully!");
        SetshowTT(true);
        convertToTimetable(setButtonStatus1,response.data.timetable);
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

  const getCourseData = (
    tableData: BatchField[]
  ): { courseSets: string[]; teachers: string[][]; rooms: string[][] } => {
    // Reduce the tableData into a single record
    const courseData = tableData.reduce(
      (lab, item) => {
        const { courseSet, teachers, rooms } = item;
        // Ensure entries exist for this courseSet
        if (!lab.courseSets.includes(courseSet)) {
          lab.courseSets.push(courseSet);
        }
        if (!lab.teachers[courseSet]) {
          lab.teachers[courseSet] = [];
        }
        const teacherList: string[] = [];
        teachers.forEach((teacher) => {
          teacher.split(",").forEach((t) => {
            teacherList.push(t.trim());
          });
        });
        lab.teachers[courseSet].push(...teacherList);
        // Add rooms for this courseSet
        if (!lab.rooms[courseSet]) {
          lab.rooms[courseSet] = [];
        }
        lab.rooms[courseSet].push(...rooms);

        return lab;
      },
      {
        courseSets: [] as string[], // List of unique courseSets
        teachers: {} as Record<string, string[]>, // Teachers grouped by courseSet
        rooms: {} as Record<string, string[]>, // Rooms grouped by courseSet
      }
    );

    // Convert teachers and rooms to lists of arrays
    const teachers = Object.values(courseData.teachers);
    const rooms = Object.values(courseData.rooms);

    return {
      courseSets: courseData.courseSets,
      teachers,
      rooms,
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
    if (response.data.status === 201) {
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
                className="ml-4 cursor-pointer text-[#636AE8FF] space-y-2"
              >
                Add &#x002B;
              </span>
              <Modal
                visible={isModalOpen}
                title="Enter Batch Details"
                onCancel={handleCloseModal}
                onOk={handleModalSubmit}
                width={1000} // Keep modal wide for better layout
              >
                <Form form={form1} layout="vertical">
                  {formFields.map((_, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "16px",
                        padding: "8px 12px",
                        border: "1px solid #d9d9d9",
                        borderRadius: "6px",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <h3 className="text-md font-medium mb-2">
                        Batch {index + 1}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          flexWrap: "wrap",
                        }}
                      >
                        <Form.Item
                          label={
                            <span className="text-sm font-medium">Course</span>
                          }
                          name={`course-${index}`}
                          style={{ flex: "1 1 30%" }}
                          required
                          rules={[
                            {
                              required: true,
                              message: "Please enter a course name!",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Enter course"
                            onChange={(e) =>
                              handleBatchChange(index, "course", e.target.value)
                            }
                          />
                        </Form.Item>
                        <Form.Item
                          label={
                            <span className="text-sm font-medium">Teacher</span>
                          }
                          name={`teacher-${index}`}
                          style={{ flex: "1 1 30%" }}
                        >
                          <Select
                            maxTagCount={2}
                            mode="tags"
                            placeholder="Select Teachers"
                            onChange={(val) =>
                              handleBatchChange(
                                index,
                                "teachers",
                                val.join(",")
                              )
                            }
                            options={teacherOptions.map((teacher) => ({
                              label: teacher,
                              value: teacher,
                            }))}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <Form.Item
                          label={
                            <span className="text-sm font-medium">Room</span>
                          }
                          name={`room-${index}`}
                          style={{ flex: "1 1 30%" }}
                        >
                          <Select
                            placeholder="Enter Room Details"
                            onChange={(val) =>
                              handleBatchChange(index, "rooms", val.join(","))
                            }
                            options={roomOptions.map((room) => ({
                              label: room,
                              value: room,
                            }))}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </div>
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
              for (let index = 0; index < records.length; index++) {
                form1.setFieldValue(`course-${index}`, records[index].course);
                form1.setFieldValue(
                  `teacher-${index}`,
                  records[index].teachers
                );
                form1.setFieldValue(`room-${index}`, records[index].rooms);
                handleOpenModal();
              }
              setEditingRecord(
                records.map((record: BatchField) => ({
                  ...record,
                  teachers: record.teachers.flatMap((teacher: string) => {
                    console.log(teacher); // Inspect each teacher value
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

          {showTT ? (
            <SwapTimetable
              buttonStatus={buttonStatus1}
              setButtonStatus={setButtonStatus1}
            ></SwapTimetable>
          ) : (
            <></>
          )}
        </Form>
      </motion.div>
    </div>
  );
};

export default AddLabPage;
