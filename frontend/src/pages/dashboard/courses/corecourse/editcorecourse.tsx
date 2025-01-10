import { CiImport } from "react-icons/ci";
import {
  Button,
  Form,
  Input,
  Upload,
  InputNumber,
  message,
} from "antd";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { statusCodes } from "../../../../types/statusCodes";
import { toast } from "sonner";
import { BACKEND_URL } from "../../../../../config";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../../../../components/Loading/Loading";
import { formItemLayout } from "../../../../utils/main";

const EditCoursepage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
  const { oldname, department } = useParams();
  function clearFields() {
    form.setFieldValue('coursename', "");
    form.setFieldValue('coursecode', "");
    form.setFieldValue('Hpc',"");
    form.setFieldValue('bfactor',"");
    form.setFieldsValue({Courses:null});
  }

  useEffect(() => {
    if(oldname && department){
    fetchCourseDetails(oldname,department);
    }
  }, [oldname,department]);
  
  const rewriteUrl = (newName: string, department: string) => {
    navigate(
      `/dashboard/courses/core-courses/edit/${encodeURIComponent(
        newName
      )}/${encodeURIComponent(department)}`
    );
  };

  const fetchCourseDetails = async (name: string, department: string | null) => {
    axios
      .post(
        BACKEND_URL + "/courses/peek",
        {
          name: name,
          semester:Number(localStorage.getItem("semester")),
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
            form.setFieldsValue({
              coursename: res.data.message.name,
              coursecode: res.data.message.code,
              Hpc: res.data.message.credits,
              bfactor: res.data.message.bFactor,
            });
            toast.success("Course details fetched successfully!");
            break;
          default:
            toast.error("Failed to fetch Course details!");
        }

        setLoading(false);
      });
  };


  const handleSubmit = async () => {
    const coursename = form.getFieldValue('coursename');
    const coursecode = form.getFieldValue('coursecode');
    const credits = form.getFieldValue('Hpc');
    const bfactor=form.getFieldValue("bfactor");
    if(!coursename||!coursecode|| !credits) {
      message.error("Fill all the required Fields");
      return;
    }
    const CoreData= {
      name:coursename,
      code:coursecode,
      bFactor: bfactor,
      credits: credits,
    };

    const promise = axios.put(
      BACKEND_URL + "/courses",
      {
        originalName: oldname,
        originalDepartment: department,
        originalSemester:Number(localStorage.getItem("semester")),
        course: CoreData
      },
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );
    toast.promise(promise, {
      loading: "Updating Course...",
      success: (res) => {
        const statusCode = res.status;
        switch (statusCode) {
          case statusCodes.OK:
            console.log(res.data)
            rewriteUrl(coursename,department||"");
            return "Course Updated successfully!";
          case statusCodes.BAD_REQUEST:
            return "Course Not Found!";
          case statusCodes.FORBIDDEN:
            return "Cannot Update Course!";
          case statusCodes.INTERNAL_SERVER_ERROR:
            return "Internal server error!";
        }
      },
      error: (error) => {
        console.error("Error:", error.response?.data || error.message);
        return "Failed to update Course. Please try again!";
      },
    });
  };

  if (loading) return <Loading />;

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
          <Form.Item label="Hours per week" name="Hpc" required>
            <InputNumber
              min={0}
              placeholder="Hours per week"
              className="w-full font-normal"
            />
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

export default EditCoursepage;
