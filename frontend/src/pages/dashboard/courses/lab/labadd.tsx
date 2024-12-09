import { useState } from "react";
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
import LabAddTable from "../../../../components/CoursePage/Labaddtable";
import Timetable from "../../../../components/timetable";
import { useNavigate } from "react-router-dom";
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

const AddLabpage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const success = () => {
    message.success("Lab Course Added successfully!", 3);
  };
  const navigate=useNavigate();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields(); // Clear form on modal close
  };

  const [buttonStatus, setButtonStatus] = useState(
    weekdays.map(() => timeslots.map(() => "Free"))
  );

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
        <Form {...formItemLayout} form={form} layout="vertical" requiredMark >
          <Form.Item label="Batch Set Name" required>
            <Input placeholder="Name" className="font-normal w-96" />
          </Form.Item>
          <Form.Item label="Number of Batches" required>
            <InputNumber min={1} className="font-normal w-96" />
          </Form.Item>
          <label>
            <div>
              <span className="inline-flex items-center space-x-10">
                Lab Courses for the Batch
                <Tooltip title="Click on Add to add the lab courses applicable for the batch">
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
                title="Enter details for each Batch"
                visible={isModalOpen}
                onCancel={handleCloseModal}
                okText="Submit"
                cancelText="Cancel"
              >
                <Form form={form} layout="vertical">
                  <Form.Item
                    name="batch1"
                    label="Batch 1"
                    rules={[
                      { required: true, message: "Please input Field 1!" },
                    ]}
                  >
                    <div>
                      <label>Course</label>
                      <Input placeholder="Course" />
                      <label>Teachers</label>
                      <Select placeholder="teacher" />
                      <label>Rooms</label>
                      <Select placeholder="rooms" />
                    </div>
                  </Form.Item>
                  <Form.Item
                    name="batch2"
                    label="Batch 2"
                    rules={[
                      { required: true, message: "Please input Field 1!" },
                    ]}
                  >
                    <label>Course</label>
                    <Input placeholder="Course" />
                    <label>Teachers</label>
                    <Select placeholder="teacher" />
                    <label>Rooms</label>
                    <Select placeholder="rooms" />
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </label>
          <LabAddTable />
          <br></br>
          <Form.Item
            label="Electives and Common time courses"
            className="w-96"
          >
            <Select placeholder="Electives" className="font-normal" />
          </Form.Item>
          <label>
            <div className="flex items-center">
              <span>
                Click on the slots you do not want the lab to be alloted
              </span>
            </div>
          </label>
          <Timetable
            buttonStatus={buttonStatus}
            setButtonStatus={setButtonStatus}
          />
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

export default AddLabpage;
