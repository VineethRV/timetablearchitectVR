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
} from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
//import { semesterOptions } from "@/app/components/semester/semester";
//import RoomOptions from "@/app/components/general/roomoption";
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
  const success = () => {
    message.success("Course Added successfully!", 3);
  };
  const navigate = useNavigate();

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
          <Form.Item label="Course Name" required>
            <Input placeholder="Name" className="w-full font-normal" />
          </Form.Item>
          <Form.Item label="Course Code" required>
            <Input placeholder="Course Code" className="font-normal" />
          </Form.Item>
          <Form.Item label="Semester" name="selectSem" required>
            <Select
              placeholder="Select a semester"
              //options={semesterOptions}
              className="font-normal"
            />
          </Form.Item>
          <Form.Item label="Number of Credits" required>
            <InputNumber
              min={0}
              placeholder="Credits"
              className="w-full font-normal"
            />
          </Form.Item>
          <Form.Item label="Hours per week" required>
            <InputNumber
              min={0}
              placeholder="Hours per week"
              className="w-full font-normal"
            />
          </Form.Item>
          <Form.Item
            label={
              <span className="inline-flex items-center">
                Any particular room to be used?
                <Tooltip title="Select one or more rooms to indicate specific room preferences for this session.">
                  <IoIosInformationCircleOutline className="ml-2 text-[#636AE8FF]" />
                </Tooltip>
              </span>
            }
          >
            {/*<RoomOptions multiple={true}/>*/}
          </Form.Item>
          <Form.Item label="Rate the subject from 1 to 5 based on the exhaustiveness of the subject">
            <InputNumber
              min={0}
              placeholder="Rating"
              className="w-full font-normal"
            />
          </Form.Item>
          <div className="flex justify-end">
            <div className="flex space-x-4">
              <Form.Item>
                <Button className="border-[#636AE8FF] text-[#636AE8FF]">
                  Clear
                </Button>
              </Form.Item>
              <Form.Item>
                <Button onClick={success} className="bg-primary text-[#FFFFFF]">
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
