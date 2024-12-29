import { CiImport } from "react-icons/ci";
import { IoIosInformationCircleOutline } from "react-icons/io";
import {
  Button,
  Form,
  Input,
  Select,
  Tooltip,
  Upload,
  InputNumber,
} from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { semesterOptions } from "../../../../components/semester/semester";
import RoomOptions from "../../../../components/general/roomoption";
import { statusCodes } from "../../../../types/statusCodes";
import { toast } from "sonner";
import { BACKEND_URL } from "../../../../../config";
import axios from "axios";
import { useEffect, useState } from "react";
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

const AddCoursepage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  function clearFields() {
    form.setFieldValue('coursename', "");
    form.setFieldValue('coursecode', "");
    form.setFieldValue('selectSem', "");
    form.setFieldValue('credits',"");
    form.setFieldValue('hours',"");
    form.setFieldValue('bfactor',"");
    form.setFieldsValue({rooms:null});
  }

  const [department, setDepartment] = useState(""); // State for department

  const fetchdept = async () => {
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
      console.log(response.status, response.data);
      if (response.status === 200) {
        setDepartment(response.data.message.department); // Set the department
      } else {
        setDepartment(""); // Reset to empty string if not successful
      }
    } catch (error) {
      console.log(error);
      setDepartment(""); // Reset to empty string in case of error
    }
  };

  useEffect(() => {
    fetchdept();
    console.log(department) // Fetch department on component mount
  }, []);
  
  
  function addCourse() {
    const coursename = form.getFieldValue('coursename');
    const coursecode = form.getFieldValue('coursecode');
    const credits = form.getFieldValue('Hpc');
     const sem = form.getFieldValue('selectSem');
     const dept=department;
     console.log(dept)
    // const credits = form.getFieldValue('credits');
    // const hours = form.getFieldValue('hours');
    const bfactor = form.getFieldValue('bfactor');
    const promise = axios.post(
      BACKEND_URL + "/courses",
      {
        name: coursename,
        code: coursecode,
        semester: sem,
        bfactor: bfactor,
        credits:credits,
        department: dept,
        
      },
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );

    toast.promise(promise, {
      loading: "Creating Course...",
      success: (res) => {
        const statusCode = res.status;
        console.log("message",res.status);
        switch (statusCode) {
          case statusCodes.OK:
            clearFields();
            return "Course added successfully!";
          case statusCodes.BAD_REQUEST:
            return "Course already exists!";
          case statusCodes.UNAUTHORIZED:
            return "You are not authorized!";
          case statusCodes.INTERNAL_SERVER_ERROR:
            return "Internal server error";
          default:
            return "Unexpected status code";
        }
      },
      error: (error: { response: { data: any; }; message: any; }) => {
        console.error("Error:", error.response?.data || error.message);
        return "Failed to create course. Please try again!";
      },
    });
  }


  return (
    <div className="text-xl font-bold text-[#171A1F] pl-8 py-6 h-screen overflow-y-scroll">
      <div className="flex px-2 items-center justify-between text-[#636AE8FF] text-xl text-bold">
        <div
          onClick={() => {
            navigate("/dashboard/courses/core-courses");
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
        <Form {...formItemLayout} form={form} layout="vertical" requiredMark className="w-96">
          <Form.Item name="coursename" label="Course Name" required>
            <Input placeholder="Name" className="w-full font-normal" />
          </Form.Item>
          <Form.Item name="coursecode" label="Course Code" required>
            <Input placeholder="Course Code" className="font-normal" />
          </Form.Item>
          <Form.Item label="Semester" name="selectSem" required>
            <Select
              placeholder="Select a semester"
              options={semesterOptions}
              className="font-normal"
            />
          </Form.Item>
          <Form.Item name="credits" label="Number of Credits" required>
            <InputNumber
              min={0}
              placeholder="Credits"
              className="w-full font-normal"
            />
          </Form.Item>
          <Form.Item label="Hours per week" name="Hpc" required>
            <InputNumber
              min={0}
              placeholder="Hours per week"
              className="w-full font-normal"
            />
          </Form.Item>
          <Form.Item name="rooms"
            label={
              <span className="inline-flex items-center">
                Any particular room to be used?
                <Tooltip title="Select one or more rooms to indicate specific room preferences for this session.">
                  <IoIosInformationCircleOutline className="ml-2 text-[#636AE8FF]" />
                </Tooltip>
              </span>
            }
          >
            <Form.Item name="rooms" >
  <RoomOptions
    multiple={true}
    value={form.getFieldValue("rooms")} 
    onChange={(value) => form.setFieldsValue({ rooms: value })} 
  />
</Form.Item>
          </Form.Item>
          <Form.Item name="bfactor"label="Rate the subject from 1 to 5 based on the exhaustiveness of the subject">
            <InputNumber
              min={0}
              placeholder="Rating"
              className="w-full font-normal"
            />
          </Form.Item>
          <div className="flex justify-end">
            <div className="flex space-x-4">
              <Form.Item>
                <Button onClick={clearFields} className="border-[#636AE8FF] text-[#636AE8FF]">
                  Clear
                </Button>
              </Form.Item>
              <Form.Item>
                <Button onClick={addCourse} className="bg-primary text-[#FFFFFF]">
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

export default AddCoursepage;
