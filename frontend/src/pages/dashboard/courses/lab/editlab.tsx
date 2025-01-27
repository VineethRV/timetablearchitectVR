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
import { useNavigate, useParams } from "react-router-dom";
import LabAddTable, { Labs } from "../../../../components/CoursePage/Labaddtable";
import axios from "axios";
import { BACKEND_URL } from "../../../../../config";
import { convertTableToString, fetchdept, fetchRooms, fetchTeachers, fetchElectives,formItemLayout, timeslots, weekdays, stringToTable } from "../../../../utils/main";
import { toast } from "sonner";
import SwapTimetable from "../../../../components/TimetableComponents/SwapTimetable";
import UneditableTimeTable from "../../../../components/TimetableComponents/uneditableTimetable";
import { statusCodes } from "../../../../types/statusCodes";
import { Lab } from "../../../../types/main";

const EditLabPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [department, _setDepartment] = useState(fetchdept());
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
    const [loading, setLoading] = useState(true);
  const [_numberOfBatches, setNumberOfBatches] = useState(1); // Dynamic batches
  const [formFields, setFormFields] = useState<Labs[]>([]);
  const [teacherOptions, setTeacherOptions] = useState<string[]>([]);
  const [electiveOptions, setElectiveOptions] = useState<string[]>([]);
  const [showTT, SetshowTT] = useState(false);
  const [roomOptions, setRoomOptions] = useState<string[]>([]);
  const [buttonStatus, setButtonStatus] = useState(
    weekdays.map(() => timeslots.map(() => "Free"))
  );
  const [buttonStatus1, setButtonStatus1] = useState(
    weekdays.map(() => timeslots.map(() => "Free"))
  );
  const [tableData, setTableData] = useState<Labs[]>([]);
  const [editingRecord, setEditingRecord] = useState<Labs[] | null>(null);
  const [_timetableScore, setTimetableScore] = useState(
    weekdays.map(() => timeslots.map(() => 0))
  );
  const { oldname, olddepartment,oldsemester } = useParams();
  const navigate = useNavigate();

  const rewriteUrl = (newName: string, newDepartment: string,newSemester:string) => {
    navigate(
      `/dashboard/courses/labs/edit/${encodeURIComponent(
        newName
      )}/${encodeURIComponent(newDepartment)}/${encodeURIComponent(newSemester)}`
    );
  };


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
    field: keyof Labs,
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


  useEffect(() => {
    if (oldname && olddepartment && oldsemester) {
      fetchLabDetails(oldname, olddepartment,oldsemester);
    }
    fetchTeachers(setTeacherOptions);
    fetchRooms(setRoomOptions);
    fetchElectives(setElectiveOptions);
    setTableData(tableData);
  }, [oldname, olddepartment,oldsemester]);

  const handleModalSubmit = () => {
    const currentBatches = form.getFieldValue("numberOfBatches");
    const newFormFields = Array.from(
      { length: currentBatches || 1 },
      (_, index) => ({
        key: `${index}`,
        course: form1.getFieldValue(`course-${index}`),
        teachers: form1.getFieldValue(`teacher-${index}`),
        rooms: [form1.getFieldValue(`room-${index}`)],
      })
    );

    for (const field of newFormFields) {
      if (!field.course || !field.teachers || !field.rooms) {
        message.error("Fill all the required Fields");
        return;
      }
    }

    const courset = newFormFields.map((batch) => batch.course).join("/");

    const updatedBatches:Labs[] = newFormFields.map((batch) => ({
      ...batch,
      courseSet: courset,
    }));
    setTableData((prevData) => {
      if (editingRecord) {
        return prevData
          .filter((data) => data.courseSet !== editingRecord[0].courseSet)
          .concat(updatedBatches); // Add the updated batches
      }
      return [...prevData, ...updatedBatches];
    });

    setIsModalOpen(false);
    setEditingRecord(null);
    handleCloseModal();
  };

  const getRecommendation = async () => {
    try {
      const { courseSets, teachers, rooms } = getCourseData(tableData);
      const elective=form.getFieldValue("Electives")
      const block=buttonStatus
      if (elective !== undefined) {
        try {
          const res = await axios.post(
            BACKEND_URL + "/electives/peek",
            {
              name: elective,
              semester: Number(localStorage.getItem("semester")),
            },
            {
              headers: {
                authorization: localStorage.getItem("token"),
              },
            }
          );
          if (res.status === 200) {
            const eleTT = stringToTable(res.data.message.timetable);
    
            for (let i = 0; i < eleTT.length; i++) {
              for (let j = 0; j < eleTT[i].length; j++) {
                if (eleTT[i][j] !== "Free") {
                  block[i][j] = eleTT[i][j];
                }
              }
            }
          } else {
            return statusCodes.BAD_REQUEST;
          }
        } catch (error) {
          console.error("Error fetching elective data:", error);
          return "Failed to fetch elective data";
        }
      }
      if (!courseSets.length || !teachers.length || !rooms.length) {
        message.error("Please ensure all fields are filled!");
        return;
      }
      // console.log(courseSets,teachers,rooms,convertTableToString(buttonStatus))
      const promise = axios.post(
        BACKEND_URL + "/getLabRecommendation",
        {
          courses: courseSets,
          teachers: teachers,
          rooms: rooms,
          blocks: convertTableToString(block),
        },
        {
          headers: {
        authorization: localStorage.getItem("token"),
          },
        }
      );

      toast.promise(promise, {
        loading: "Generating lab timetable...",
        success: (response) => {
          if (response.data.status === 200) {
        SetshowTT(true);
        setButtonStatus1(stringToTable(response.data.timetable))
        return "Timetable generated successfully!";
          } else {
        return "Failed to generate timetable.";
          }
        },
        error: "Failed to generate lab timetable. Please try again!"
      });

      const response = await promise;
      const flattenedTeachers = teachers.flat();
      const flattenedRooms = rooms.flat();

      // here is the get scores of the slot endpoint
      const { data: scoreResponse } = await axios.post(
        BACKEND_URL + "/recommendLab",
        {
          Lteachers: flattenedTeachers,
          Lrooms: flattenedRooms,
          blocks: convertTableToString(buttonStatus),
        },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );

      const parsedScores = scoreResponse.timetable
        .split(";")
        .map((row: string) =>
          row.split(",").map((score: string) => parseInt(score, 10) * 100)
        );
      setTimetableScore(parsedScores);
      if (response.data.status === 200) {
        message.success("Timetable recommendations fetched successfully!");
        SetshowTT(true);
        setButtonStatus1(stringToTable(response.data.timetable))
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
    tableData: Labs[]
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

  const getCourseDataF = (
    tableData: Labs[]
  ): { courseSets: string[]; teachers: string; rooms: string[][] } => {
    const courseData = tableData.reduce(
      (lab, item) => {
        const { courseSet, teachers, rooms } = item;
  
        // Ensure entries exist for this courseSet
        if (!lab.courseSets.includes(courseSet)) {
          lab.courseSets.push(courseSet);
        }
        if (!lab.rooms[courseSet]) {
          lab.rooms[courseSet] = [];
        }
        if (!lab.teachers[courseSet]) {
          lab.teachers[courseSet] = "";
        }

        const teacherList=teachers.join(",");
        if(lab.teachers[courseSet].length>0){
          lab.teachers[courseSet]=[lab.teachers[courseSet],teacherList].join("/");
        }
        else
          lab.teachers[courseSet]=teacherList;

        lab.rooms[courseSet].push(...rooms);
        console.log("lab",lab);
        return lab;
      },
      {
        courseSets: [] as string[], // List of unique courseSets
        teachers: {} as Record<string,string>, // Teachers grouped by courseSet
        rooms: {} as Record<string, string[]>, // Rooms grouped by courseSet
      }
    );
    return {
      courseSets: courseData.courseSets,
      teachers: Object.values(courseData.teachers).flat().join(";"),
      rooms: Object.values(courseData.rooms),
    };
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Authorization token is missing!");
        navigate("/signIn");
        return;
      }
      const toastId = toast.loading(`Updating lab...`);
      const name = form.getFieldValue("batchSetName");
      const { courseSets, teachers, rooms } = getCourseDataF(tableData);
        
      const teacherlist = teachers.split(";").map((teacher) => teacher.split(/[,/]/));
      console.log("teacherlist", teacherlist);
      const labo= {
        name: name,
        department: olddepartment ? olddepartment : null,
        semester: Number(localStorage.getItem("semester")),
        batches: courseSets.join(";"),
        teachers: teachers,
        rooms: rooms.map((room) => room.join(",")).join(";"),
        timetable: convertTableToString(buttonStatus1),
      };
  
      const response = await axios.put(
        BACKEND_URL + "/labs",
        {
          originalName: oldname,
          originalSemester: Number(oldsemester),
          lab: labo,
          originalDepartment: olddepartment,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );
  
      if (response.data.status === 200) {
        const teacherResponse = await axios.get(BACKEND_URL + "/teachers", {
          headers: {
            authorization: token,
          },
        });
  
        if (teacherResponse.data.status === statusCodes.OK) {
          const teachers = teacherResponse.data.message;
          for (const teacher of teachers) {
            const TT = stringToTable(teacher.timetable);
            const labTT = stringToTable(teacher.labtable);
  
            for (let i = 0; i < buttonStatus1.length; i++) {
              for (let j = 0; j < buttonStatus1[i].length; j++) {
                if (TT[i][j] === oldname || labTT[i][j] === oldname) {
                  TT[i][j] = "Free";
                  labTT[i][j] = "Free";
                }
              }
            }
  
            teacher.timetable = convertTableToString(TT);
            teacher.labtable = convertTableToString(labTT);
  
            await axios.put(
              BACKEND_URL + "/teachers",
              {
                originalName: teacher.name,
                teacher: teacher,
              },
              {
                headers: {
                  authorization: token,
                },
              }
            );
          }
        } else {
          toast.error("Server error!");
        }
        const roomResponse = await axios.get(BACKEND_URL + "/rooms", {
          headers: {
            authorization: token,
          },
        });
        if (roomResponse.data.status === statusCodes.OK) {
          const rooms = roomResponse.data.message;
          for (const room of rooms) {
            console.log("room",room)
            const TT = stringToTable(room.timetable);
            console.log(TT)
            for (let i = 0; i < buttonStatus1.length; i++) {
              for (let j = 0; j < buttonStatus1[i].length; j++) {
                if (TT[i][j] === oldname) {
                  TT[i][j] = "Free";
                }
              }
            }
            console.log(3)
            room.timetable = convertTableToString(TT);
            console.log("room",room)
            await axios.put(
              BACKEND_URL + "/rooms",
              {
                originalName: room.name,
                room: room,
              },
              {
                headers: {
                  authorization: token,
                },
              }
            );
          }
        } else {
          toast.error("Server error!");
        }
        for (let i = 0; i < courseSets.length; i++) {
          const courseSet = courseSets[i];
  
          // Update each teacher for the current courseSet sequentially
          for (const teacher of teacherlist[i]) {
  
            const resT = await axios.post(
              BACKEND_URL + "/teachers/peek",
              {
                name: teacher,
                department: department,
              },
              {
                headers: {
                  authorization: token,
                },
              }
            );
  
            const teach = resT.data.message;
            const teacherTT = stringToTable(teach.timetable);
            const teacherlabTT = stringToTable(teach.labtable);
  
            for (let j = 0; j < buttonStatus1.length; j++) {
              for (let k = 0; k < buttonStatus1[j].length; k++) {
                if (buttonStatus1[j][k] === courseSet) {
                  teacherlabTT[j][k] = name;
                  teacherTT[j][k] = name;
                }
              }
            }
  
            teach.labtable = convertTableToString(teacherlabTT);
            teach.timetable = convertTableToString(teacherTT);
  
            await axios.put(
              BACKEND_URL + "/teachers",
              {
                originalName: teacher,
                teacher: teach,
              },
              {
                headers: {
                  authorization: token,
                },
              }
            );
          }
  
          // Update each room for the current courseSet sequentially
          for (const room of rooms[i]) {
  
            const resR = await axios.post(
              BACKEND_URL + "/rooms/peek",
              {
                name: room,
              },
              {
                headers: {
                  authorization: token,
                },
              }
            );
  
            const roomfetch = resR.data.message;
            const roomTT = stringToTable(roomfetch.timetable);
  
            for (let j = 0; j < buttonStatus1.length; j++) {
              for (let k = 0; k < buttonStatus1[j].length; k++) {
                if (buttonStatus1[j][k] === courseSet) {
                  roomTT[j][k] = name;
                }
              }
            }
  
            roomfetch.timetable = convertTableToString(roomTT);
  
            await axios.put(
              BACKEND_URL + "/rooms",
              {
                originalName: room,
                originalDepartment: department,
                room: roomfetch,
              },
              {
                headers: {
                  authorization: token,
                },
              }
            );
  
          }
        }
        toast.dismiss(toastId);
        message.success("Lab updated successfully!");
      } else {
        message.error(response.data.message || "Failed to update");
      }
    } catch (error) {
      message.error("Failed to update lab!");
    }
  };

  const fetchLabDetails = async (name: string, department: string | null,semester:string) => {
    axios
      .post(
        BACKEND_URL + "/labs/peek",
        {
          name: name,
          semester: Number(semester),
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
              ? stringToTable(res.data.message.timetable)
              : Array(6).fill(Array(6).fill("Free"));
              SetshowTT(true);
            setButtonStatus1(timetableString);

             form.setFieldsValue({
              batchSetName: res.data.message.name,
              numberOfBatches: (res.data.message.batches.split(";"))[0].split("/").length,
            });
            const coursesSet = res.data.message.batches.split(";");
            const courses = coursesSet.map((course: string) => course.split("/"));
            console.log("rooms",res.data.message.rooms)
            const teachers = res.data.message.teachers.split(/[;/]/).map((teacher: string) => teacher.split(","));
            const rooms = res.data.message.rooms.split(/[;,]/);
            const labs: Labs[] = [];
            console.log("teachers",teachers,"rooms",rooms)
            coursesSet.forEach((batch: string, index: number) => {
              courses[index].forEach((course: string, courseIndex: number) => {
                console.log(index,courseIndex)
                console.log(rooms[2*index+courseIndex])
                labs.push({
                  key: `${courseIndex}`,
                  courseSet: batch,
                  course: course,
                  teachers: teachers[2*index+courseIndex],
                  rooms: [rooms[2*index+courseIndex]],
                });
              });
            });
            setTableData(labs);
            toast.success("Lab details fetched successfully!");
            break;
          default:
            toast.error("Failed to fetch Lab details!");
        }

        setLoading(false);
      });
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
            LabData={tableData}
            setLabData={setTableData}
            onEditClick={(records) => {
              for (let index = 0; index < records.length; index++) {
                form1.setFieldValue(`course-${index}`, records[index].course);
                form1.setFieldValue(
                  `teacher-${index}`,
                  records[index].teachers
                );
                form1.setFieldValue(`room-${index}`, records[index].rooms[0]);
                handleOpenModal();
              }
              setEditingRecord(
                records.map((record: Labs) => ({
                  ...record,
                  teachers: record.teachers.flatMap((teacher: string) => {
                    // console.log(teacher); // Inspect each teacher value
                    return teacher.split(",").map((t) => t.trim());
                  }),
                }))
              );
            }}
          />
          <br />
          <Form.Item name="Electives" label="Electives and Common time courses" className="w-96">
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
          <UneditableTimeTable
            buttonStatus={buttonStatus}
            setButtonStatus={setButtonStatus}
            editable={true}
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
              course={getCourseData(tableData).courseSets}
              teachers= {getCourseData(tableData).teachers}
              rooms= {getCourseData(tableData).rooms}
            ></SwapTimetable>
          ) : (
            <></>
          )}
        </Form>
      </motion.div>
    </div>
  );
};

export default EditLabPage;
