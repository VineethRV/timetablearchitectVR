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
  Modal,
} from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ElectiveAddTable from "../../../../components/CoursePage/electiveAddtable";
import Timetable from "../../../../components/timetable";


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
  
const AddElectivepage: React.FC = () => {
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
          <Form.Item label="Elective Course Name" required>
            <Input placeholder="Name" className="w-96 font-normal" />
          </Form.Item>
          <label>
            <div>
              <span className="inline-flex items-center space-x-10">
                Teachers handling the Elective Course
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
                okText="Submit"
                cancelText="Cancel"
              >
                <Form form={form} layout="vertical">
                  <Form.Item>
                    <div>
                      <label>Course Name</label>
                      <Input placeholder="Course Name" />
                      <label>Teachers</label>
                      <Select placeholder="teachers" />
                    </div>
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </label>
          <br/>
          <ElectiveAddTable/>
          <br/><br/>
          <label className="flex items-center">
            <span>Select the timeslot for the subject</span>
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

export default AddElectivepage;
