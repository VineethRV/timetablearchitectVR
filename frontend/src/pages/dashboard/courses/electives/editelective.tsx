import { CiImport } from "react-icons/ci";
import { IoIosInformationCircleOutline } from "react-icons/io";
import {
  Button,
  Form,
  Input,
  Select,
  Tooltip,
  Upload,
  Modal,
  message,
} from "antd";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ElectiveAddTable, { Elective } from "../../../../components/CoursePage/electiveAddtable";
import { BACKEND_URL } from "../../../../../config";
import axios from "axios";
import { convertTableToString, fetchdept, fetchRooms, fetchTeachers, formItemLayout, stringToTable, timeslots, weekdays } from "../../../../utils/main";
import { toast } from "sonner";
import { statusCodes } from "../../../../types/statusCodes";
import EleTimetable from "../../../../components/TimetableComponents/electiveTT";
import UneditableTimeTable from "../../../../components/TimetableComponents/uneditableTimetable";
  
const EditElectivepage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const { oldname,olddepartment,oldsemester}= useParams();
    const [oldteachers,SetOldTeachers]=useState<string|null>(null)
    const [oldcourses,SetOldCourses]=useState<string|null>(null)
    const [oldrooms,SetOldRooms]=useState<string|null>(null)
    const [eledata,SetEleData]=useState<Elective[]>([])
  const [teacherOptions, setTeacherOptions] = useState<string[]>([]);
  const [editingRecord, setEditingRecord] = useState<Elective | null>(null);
  const [roomOptions, setRoomOptions] = useState<string[]>([]);
  const[displayTT,setDisplayTT]=useState<Boolean>(false)
  const[max,setMax]=useState(-1)
  const[courseName,setCourseName]=useState("")
  const [score, setScore] = useState(
    weekdays.map(() => timeslots.map(() => 0)));
  const [buttonStatus, setButtonStatus] = useState(
    weekdays.map(() => timeslots.map(() => "Free")));
    const [buttonStatusele, setButtonStatusele] = useState(
      weekdays.map(() => timeslots.map(() => "Free")));
    const navigate=useNavigate();
    useEffect(() => {
      if(oldname && olddepartment && oldsemester)
      {
        fetchElectives();
      }
      fetchTeachers(setTeacherOptions);
      fetchRooms(setRoomOptions)
      SetEleData(eledata);
    }, [oldname,olddepartment,oldsemester]);


    const handleOpenModal = () => {
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
      form.resetFields(['course', 'teachers', 'rooms']);
      setDisplayTT(false)
      setEditingRecord(null);
    };

    const fetchElectives = async () => {
      axios
      .post(
        BACKEND_URL + "/electives/peek",
        {
          name: oldname,
          semester:Number(oldsemester),
          department: olddepartment,
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
            console.log(res.data.message)
            form.setFieldsValue({
              clusterName: res.data.message.name,
            });
            SetEleData(
              res.data.message.courses.split(";").map((course: string, index: number) => ({
                course: course,
                teachers: (res.data.message.teachers.split(";"))[index].split(","),
                rooms: (res.data.message.rooms.split(";"))[index]?.split(","),
              }))
            );
            setButtonStatus(stringToTable(res.data.message.timetable));
            SetOldCourses(res.data.message.courses)
            SetOldTeachers(res.data.message.teachers)
            SetOldRooms(res.data.message.rooms)
            toast.success("Course details fetched successfully!");
            break;
          default:
            toast.error("Failed to fetch Course details!");
        }
      });
    }

    
    const handleSubmit = async () => {
      try {
        // Extracting necessary data
        toast.message("Updating Elective Cluster...");
        const courses = eledata.map(e => e.course).join(";");
        const teachers = eledata.map(e => e.teachers?.join(",")).join(";");
        const rooms = eledata.map(e => e.rooms?.join(",")).join(";");
        const name = form.getFieldValue("clusterName");
    
        if (!name || !courses || !teachers || !rooms) {
          message.error("Fill all the required fields");
          return;
        }
    
        const elective = {
          name,
          courses,
          teachers,
          rooms,
          semester: Number(localStorage.getItem("semester")),
          timetable: convertTableToString(buttonStatus),
          department: olddepartment,
        };
    
        // 1. **Update Electives**
        const response = await axios.put(
          `${BACKEND_URL}/electives`,
          {
            originalName: oldname,
            originalDepartment: olddepartment,
            updatedElective: elective,
          },
          {
            headers: { authorization: localStorage.getItem("token") },
          }
        );
    
        if (response.status !== statusCodes.OK) {
          throw new Error("Failed to update elective cluster");
        }
        
        // 2. **Update Old Teachers (Removing old elective from their timetables)**
        if (oldcourses && oldteachers) {
          const courses = oldcourses?.split(";");
          const teachers=oldteachers.split(";").map((teacher)=>teacher.split(","));
          const rooms=oldrooms?.split(";").map((room)=>room.split(","));
          console.log(rooms)
          courses.forEach(async (course, i) => {
          for (const teacher of teachers[i]) {
            const resT = await axios.post(`${BACKEND_URL}/teachers/peek`, { name: teacher }, {
              headers: { authorization: localStorage.getItem("token") },
            });
    
            const teach = resT.data.message;
            const teacherTT = stringToTable(teach.timetable);
    
            teacherTT.forEach((day, i) => day.forEach((hour, j) => {
              if (hour === course) teacherTT[i][j] = "Free";
            }));
    
            teach.timetable = convertTableToString(teacherTT);
            console.log("teach",teach)
            await axios.put(`${BACKEND_URL}/teachers`, {
              originalName: teacher,
              teacher: teach
            }, {
              headers: { authorization: localStorage.getItem("token") }
            });
          }
          if(rooms){
          for (const room of rooms[i])
          {
            if(room=="0"||room=="")
            {
              continue;
            }
            console.log("roomName",room)
            const resR = await axios.post(`${BACKEND_URL}/rooms/peek`, { name: room }, {
              headers: { authorization: localStorage.getItem("token") }
            });
    
            const roomfetch = resR.data.message;
            console.log("room",roomfetch)
            const roomTT = stringToTable(roomfetch.timetable);
    
            roomTT.forEach((day, i) => day.forEach((hour, j) => {
              if (hour === course) roomTT[i][j] = "Free";
            }));
    
            roomfetch.timetable = convertTableToString(roomTT);
    
            await axios.put(`${BACKEND_URL}/rooms`, {
              originalName: room,
              room: roomfetch
            }, {
              headers: { authorization: localStorage.getItem("token") }
            });
          }
        }
        }
       
          );
        }
          
        // 3. **Update New Teachers & Rooms**
        for (const elective of eledata) {
          const course = elective.course;
          const courseTT: { row: number; col: number }[] = [];
    
          buttonStatus.forEach((row, i) => {
            row.forEach((col, j) => {
              if (col === course) courseTT.push({ row: i, col: j });
            });
          });
    
          // 3.1 **Update Teachers**
          for (const teacher of elective.teachers) {
            const resT = await axios.post(`${BACKEND_URL}/teachers/peek`, { name: teacher }, {
              headers: { authorization: localStorage.getItem("token") }
            });
    
            const teach = resT.data.message;
            const teacherTT = stringToTable(teach.timetable);
    
            courseTT.forEach(({ row, col }) => {
              teacherTT[row][col] = course;
            });
    
            teach.timetable = convertTableToString(teacherTT);
    
            await axios.put(`${BACKEND_URL}/teachers`, {
              originalName: teacher,
              teacher: teach
            }, {
              headers: { authorization: localStorage.getItem("token") }
            });
          }
    
          // 3.2 **Update Rooms**
          for (const room of elective.rooms || []) {
            const resR = await axios.post(`${BACKEND_URL}/rooms/peek`, { name: room }, {
              headers: { authorization: localStorage.getItem("token") }
            });
    
            const roomfetch = resR.data.message;
            const roomTT = stringToTable(roomfetch.timetable);
    
            courseTT.forEach(({ row, col }) => {
              roomTT[row][col] = course;
            });
    
            roomfetch.timetable = convertTableToString(roomTT);
    
            await axios.put(`${BACKEND_URL}/rooms`, {
              originalName: room,
              room: roomfetch
            }, {
              headers: { authorization: localStorage.getItem("token") }
            });
          }
        }
    
        toast.success("Updated Elective Cluster Successfully");
    
      } catch (error) {
        toast.error("Failed to update elective cluster. Please try again.");
      }
    };
    
  
    const handleModalSubmit = () => {

      let flag=true;
      for(let i=0;i<buttonStatusele.length;i++)
      {
        for(let j=0;j<buttonStatusele[i].length;j++)
        {
          if (buttonStatusele[i][j]==courseName)
          {
            flag=false;
            buttonStatus[i][j]=courseName;
          }
        }
      }
      if(flag)
      {
        message.error("Select the timeslots")
        return;
      }
      const course = form.getFieldValue("course");
      const teachers = form.getFieldValue("teachers");
      const rooms = form.getFieldValue("rooms");
    
      const newElective: Elective = {
        course: course,
        teachers: teachers,
        rooms: rooms,
      };
      if (editingRecord) {
        SetEleData((prevEleData) =>
          prevEleData.map((item) =>
            item.course === editingRecord.course ? { ...item, ...newElective } : item
          )
        );
        for(let i=0;i<buttonStatus.length;i++)
        {for(let j=0;j<buttonStatus[i].length;j++)
          {
            if(editingRecord)
            {
              if(buttonStatus[i][j]==editingRecord.course)
                buttonStatus[i][j]="Free";
            }
            else {
            if(buttonStatus[i][j]==courseName)
              buttonStatus[i][j]="Free";}
            if(buttonStatusele[i][j]==courseName)
              buttonStatus[i][j]=courseName;
          }
        }
      } else {
        SetEleData((prevEleData) => [...prevEleData, newElective]);
      }

      handleCloseModal(); 
    };

      // const clearFields = () => {
      //   form.setFieldValue("clusterName", "");
      //   SetEleData([])
      //   setButtonStatus(weekdays.map(() => timeslots.map(() => "Free")));
      // };
    
    const getrecommendation=async ()=>{
      setCourseName(form.getFieldValue("course"))
      const teachers = form.getFieldValue("teachers");
      const rooms = form.getFieldValue("rooms");
      if(!teachers || !rooms)
      {
        message.error("Fill all the required details!")
        return;
      }
      console.log(teachers,rooms)
      const response=axios.post(
        BACKEND_URL+"/getIntersection",{
          teachers: teachers,
          rooms: rooms,
        },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      )
    toast.promise(response, {
      loading: "Fetching Recommendation...",
      success: (res) => {
        const statusCode = res.status;
        console.log(res);
        switch (statusCode) {
          case statusCodes.OK:
            setDisplayTT(true);
            const TT=res.data.intersection
            let max = -1;
            for(let i=0;i<TT.length;i++)
            {
              for(let j=0;j<TT[i].length;j++)
              {
                  if(buttonStatus[i][j]!="Free"){
                    if(editingRecord && buttonStatus[i][j]==editingRecord.course)
                    {console.log(i,j)
                      continue;}
                    TT[i][j]=-1;}
                  if(TT[i][j]>max){
                    max=TT[i][j];}
              }
            }
            setScore(TT)
            setMax(max);
            setButtonStatusele(TT)
            return "Fetched Recommendation successfully!";
          case statusCodes.BAD_REQUEST:
            return "Elective already exists!";
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
        return "Failed to fetch recommendation. Please try again!";
      },
    });
    }

  return (
    <div className="text-xl font-bold text-[#171A1F] pl-8 py-6 h-screen overflow-y-scroll">
      <div className="flex px-2 items-center justify-between text-[#636AE8FF] text-xl text-bold">
        <div
          onClick={() => {
            navigate("/dashboard/courses/electives");
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
          <Form.Item name="clusterName" label="Elective Cluster Name" required>
            <Input placeholder="Name" className="w-96 font-normal" />
          </Form.Item>
          <label>
            <div>
              <span className="inline-flex items-center space-x-10">
                Elective courses under this cluster
                <Tooltip title="Select all the teachers that handle the courses offered under the Elective course">
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
                title="Enter the details about course offered under this elective"
                visible={isModalOpen}
                onCancel={handleCloseModal}
                footer={[
                ]}
                width={1000}
              >
                <Form form={form} layout="vertical" >
                <div
                      style={{
                        marginBottom: "16px",
                        padding: "8px 12px",
                        border: "1px solid #d9d9d9",
                        borderRadius: "6px",
                        backgroundColor: "#fafafa",
                      }}
                    >
                  <Form.Item>
                  <div style={{
                          display: "flex",
                          gap: "16px",
                          flexWrap: "wrap",
                          justifyContent:"normal"
                        }}
                      >
                      <Form.Item required
                          label={
                            <span className="text-sm font-medium">Elective Name</span>
                          }
                          name={'course'}
                          style={{ flex: "1 1 30%" }}
                        >
                      <Input placeholder="Course Name" />
                      </Form.Item>
                      <Form.Item required
                          label={
                            <span className="text-sm font-medium">Teachers</span>
                          }
                          name={'teachers'}
                          style={{ flex: "1 1 30%" }}
                        >
                          <Select
                            maxTagCount={2}
                            mode="tags"
                            placeholder="Teachers"
                            options={teacherOptions.map((teacher) => ({
                              label: teacher,
                              value: teacher,
                            }))}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <Form.Item
                          required
                          label={
                            <span className="text-sm font-medium">Rooms</span>
                          }
                          name={'rooms'}
                          style={{ flex: "1 1 30%" }}
                        >
                          <Select
                            maxTagCount={2}
                            mode="tags"
                            placeholder="Rooms"
                            options={roomOptions.map((room) => ({
                              label: room,
                              value: room,
                            }))}
                            style={{ flex: "1 1 30%" }}
                          />
                        </Form.Item>
                        <div className="flex justify-end mr-4 w-full">
                        <Button onClick={()=>{handleCloseModal()}}className="border-[#636AE8FF] mr-4 text-[#636AE8FF]">
                          Cancel
                        </Button>
                        <Button onClick={()=>{getrecommendation()}}className="bg-[#636AE8FF] text-white">
                          Select Timeslot
                        </Button>
                        <br/>
                        </div>
                       {displayTT && <div className="w-full"><Form.Item label="Select the timeslot for the course" className="flex">
                              <Tooltip title="Click on the timeslots where to the teacher is busy to set them to busy">
                                <IoIosInformationCircleOutline className="ml-2 text-[#636AE8FF]" />
                              </Tooltip>
                              <div>
            <EleTimetable
              buttonStatus={buttonStatusele}
              setButtonStatus={setButtonStatusele}
              courseName={courseName}
              score={score}
              max={max}
            />
          </div>       </Form.Item>
          
          <div className=" flex w-full justify-end">
                                <Button onClick={handleModalSubmit} className="bg-[#636AE8FF] w-20 text-white mr-4">
                                  Save
                                </Button>
                              </div>
                              </div>}
                    </div>
                  </Form.Item>
                  </div>
                </Form>
              </Modal>
            </div>
          </label>
          <br/>
          <ElectiveAddTable electiveData={eledata} setElectivesData={SetEleData} 
           onEditClick={(records) => {
              form.setFieldValue(`course`, records.course);
              form.setFieldValue(
                `teachers`,
                records.teachers
              );
            form.setFieldValue('rooms', records.rooms && records.rooms.length > 0 ? records.rooms : null);
              handleOpenModal();
              setEditingRecord(records);
            }
          }
          onDeleteClick={(records)=>{
            SetEleData((prevData) => prevData.filter((item) => item.course !== records.course));
            console.log("Hello")
            const updatedStatus = buttonStatus.map(row =>
              row.map(cell => (cell === records.course ? "Free" : cell))
            );
            setButtonStatus(updatedStatus);
          }}/>
          <br/><br/>
          <label className="flex items-center">
            <span>Timetable for this Cluster</span>
            <Tooltip title="Click on the timeslots where to the teacher is busy to set them to busy">
              <IoIosInformationCircleOutline className="ml-2 text-[#636AE8FF]" />
            </Tooltip>
          </label>
          <div className="flex justify-left">
            <UneditableTimeTable
              buttonStatus={buttonStatus}
              setButtonStatus={setButtonStatus}
              editable={false}
            />
          </div>
          <div className="flex justify-end">
            <div className="flex space-x-4">
              <Form.Item>
                <Button className="border-[#636AE8FF] text-[#636AE8FF]">
                  Clear
                </Button>
              </Form.Item>
              <Form.Item>
                <Button onClick={handleSubmit} className="bg-primary text-[#FFFFFF]">
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

export default EditElectivepage;
