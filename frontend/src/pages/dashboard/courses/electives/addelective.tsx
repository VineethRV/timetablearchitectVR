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
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ElectiveAddTable, { Elective } from "../../../../components/CoursePage/electiveAddtable";
import Timetable from "../../../../components/TimetableComponents/timetable";
import { BACKEND_URL } from "../../../../../config";
import axios from "axios";
import { convertTableToString, fetchdept, fetchRooms, fetchTeachers, formItemLayout, timeslots, weekdays } from "../../../../utils/main";
import { toast } from "sonner";
import { statusCodes } from "../../../../types/statusCodes";
import EleTimetable from "../../../../components/TimetableComponents/electiveTT";

  
const AddElectivepage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [eledata,SetEleData]=useState<Elective[]>([])
  const [teacherOptions, setTeacherOptions] = useState<string[]>([]);
  const [editingRecord, setEditingRecord] = useState<Elective | null>(null);
  const [roomOptions, setRoomOptions] = useState<string[]>([]);
  const[displayTT,setDisplayTT]=useState<Boolean>(false)
  const[courseName,setCourseName]=useState("")
  const [score, setScore] = useState(
    weekdays.map(() => timeslots.map(() => 0)));
  const [buttonStatus, setButtonStatus] = useState(
    weekdays.map(() => timeslots.map(() => "Free")));
    const [buttonStatusele, setButtonStatusele] = useState(
      weekdays.map(() => timeslots.map(() => "Free")));
    const navigate=useNavigate();
  
    useEffect(() => {
      fetchTeachers(setTeacherOptions);
      fetchRooms(setRoomOptions)
      SetEleData(eledata);
    }, [eledata]);


    const handleOpenModal = () => {
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
      form.resetFields(); 
      setDisplayTT(false)
      setEditingRecord(null);
    };

    const handleSubmit=async ()=>{
      //name, courses, teachers, rooms, semester, timetable, department 
     const courses = eledata.map((elective) => elective.course).join(";");
      const teachers = eledata.map((elective) => elective.teachers.map((teacher)=>teacher).join(',')).join(";");
      const rooms = eledata.map((elective) => elective.rooms?.map((room)=>room).join(',')).join(";");
      const department= await fetchdept()
      const response=axios.post(
        BACKEND_URL+"/electives",{
          name: form.getFieldValue("clusterName"),
          courses: courses,
          teachers: teachers,
          rooms: rooms,
          semester:Number(localStorage.getItem("semester")),
          timetable: convertTableToString(buttonStatus),
          department: department
        },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      )
      
    toast.promise(response, {
      loading: "Adding Electives...",
      success: (res) => {
        const statusCode = res.status;
        console.log(res);
        switch (statusCode) {
          case statusCodes.OK:
            setDisplayTT(true);
            const TT=res.data.intersection
            console.log(TT)
            setButtonStatusele(TT)
            return "Saved Elective Cluster Successfully";
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
        return "Failed to add elective cluster. Please try again!";
      },
    });
    }
  
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
      //name, courses, teachers, rooms, semester, timetable, department 
     // const courses = eledata.map((elective) => elective.course).join(";");
      // const teachers = eledata.map((elective) => elective.teachers.map((teacher)=>teacher).join(',')).join(";");
      // const rooms = eledata.map((elective) => elective.rooms?.map((room)=>room).join(',')).join(";");
      //const department= await fetchdept()
      // const response=axios.post(
      //   BACKEND_URL+"/electives",{
      //     name: form.getFieldValue("clusterName"),
      //     courses: courses,
      //     teachers: teachers,
      //     rooms: rooms,
      //     semester:Number(localStorage.getItem("semester")),
      //     timetable: convertTableToString(buttonStatus),
      //     department: department
      //   },
      //   {
      //     headers: {
      //       authorization: localStorage.getItem("token"),
      //     },
      //   }
      // )
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
      loading: "Adding Electives...",
      success: (res) => {
        const statusCode = res.status;
        console.log(res);
        switch (statusCode) {
          case statusCodes.OK:
            setDisplayTT(true);
            const TT=res.data.intersection
            console.log(TT)
            const scoreTT=res.data.intersection.map((ele:any)=>{ele.map((tt:string)=>{Number(tt)})})
            console.log(scoreTT)
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
        return "Failed to add elective cluster. Please try again!";
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
          }/>
          <br/><br/>
          <label className="flex items-center">
            <span>Timetable for this Cluster</span>
            <Tooltip title="Click on the timeslots where to the teacher is busy to set them to busy">
              <IoIosInformationCircleOutline className="ml-2 text-[#636AE8FF]" />
            </Tooltip>
          </label>
          <div className="flex justify-left">
            <Timetable
              buttonStatus={buttonStatus}
              setButtonStatus={setButtonStatus}
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
                <Button onClick={getrecommendation} className="bg-primary text-[#FFFFFF]">
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

export default AddElectivepage;
