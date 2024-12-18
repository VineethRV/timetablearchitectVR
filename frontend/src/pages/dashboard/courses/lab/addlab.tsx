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
import Timetable from "../../../../components/timetable";
import { useNavigate } from "react-router-dom";
import LabAddTable from "../../../../components/CoursePage/Labaddtable";

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
  name: string;
  course: string;
  teacher: string;
  room: string;
}

const AddLabpage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [numberOfBatches, setNumberOfBatches] = useState(1); // Dynamic batches
  const [formFields, setFormFields] = useState<BatchField[]>([]);
  const [buttonStatus, setButtonStatus] = useState(
    weekdays.map(() => timeslots.map(() => "Free"))
  );
  const [tableData, setTableData] = useState<BatchField[]>([]);

  const navigate = useNavigate();

  const success = () => {
    message.success("Lab Course Added successfully!", 3);
  };

  const handleOpenModal = () => {
    const currentBatches = form.getFieldValue("numberOfBatches");
    setNumberOfBatches(currentBatches || 1);
    setFormFields(
      Array.from({ length: currentBatches || 1 }, (_, i) => ({
        name: `batch${i + 1}`,
        course: "",
        teacher: "",
        room: "",
      }))
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields(); // Clear form on modal close
  };

  const handleBatchChange = (
    index: number,
    field: keyof BatchField,
    value: string
  ) => {
    const updatedFields = [...formFields];
    updatedFields[index][field] = value;
    setFormFields(updatedFields);
  };


  const handleModalSubmit = () => {
    const validBatches = formFields.filter(
      (field) => field.course && field.teacher && field.room
    );

    if (validBatches.length !== formFields.length) {
      messageApi.error("Please fill in all required fields.");
      return;
    }

    setTableData(validBatches); // Set data for LabAddTable
    setIsModalOpen(false);
    success();
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
          <Form.Item label="Batch Set Name" required>
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
              <Button
                onClick={handleOpenModal}
                className="ml-4 text-[#636AE8FF] hover:underline"
              >
                &#x002B; Add
              </Button>
              <Modal
              visible={isModalOpen}
              title="Enter Batch Details"
              onCancel={handleCloseModal}
              onOk={handleModalSubmit}
            >
              {formFields.map((_, index) => (
                <div key={index}>
                  <Form.Item label="Course">
                    <Input
                      placeholder="Enter course"
                      onChange={(e) => handleBatchChange(index, "course", e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item label="Teacher">
                    <Select
                      mode="tags"
                      placeholder="Select Teachers"
                      onChange={(val) => handleBatchChange(index, "teacher", val.join(","))}
                    />
                  </Form.Item>
                  <Form.Item label="Room">
                    <Select
                      mode="tags"
                      placeholder="Enter Room Details"
                      onChange={(val) => handleBatchChange(index, "room", val.join(","))}
                    />
                  </Form.Item>
                </div>
              ))}
            </Modal>
            </div>
          </label>
          <LabAddTable
            data={tableData.map((batch, index) => ({
              key: `${index}`,
              Course: batch.course,
              teachers: [batch.teacher],
              rooms: [batch.room],
            }))}
          />
          <br />
          <Form.Item
            label="Electives and Common time courses"
            className="w-96"
          >
            <Select placeholder="Electives" className="font-normal" />
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
              <Form.Item>
                <Button className="border-[#636AE8FF] text-[#636AE8FF]">
                  Clear
                </Button>
              </Form.Item>
              <Form.Item>
                <Button className="bg-primary text-[#FFFFFF]">Submit</Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </motion.div>
    </div>
  );
};

export default AddLabpage;
