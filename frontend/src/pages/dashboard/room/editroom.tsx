"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Tooltip, Upload, Radio } from "antd";
import TimeTable from "../../../components/timetable";
import { motion } from "framer-motion";
import { CiImport } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosInformationCircleOutline } from "react-icons/io";
import axios from "axios";
import { BACKEND_URL } from "../../../../config";
import { toast } from "sonner";
import { statusCodes } from "../../../types/statusCodes";
import { Room } from "../../../types/main";
import Loading from "../../../components/Loading/Loading";
import {
  convertTableToString,
  stringToTable,
  timeslots,
  weekdays,
} from "../../../utils/main";

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

const EditRoomPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { oldname, olddepartment } = useParams();

  const [buttonStatus, setButtonStatus] = useState(
    weekdays.map(() => timeslots.map(() => "Free"))
  );

  function clearFields() {
    form.setFieldValue("className", "");
    form.setFieldValue("lab", "");
    form.setFieldValue("department", "");
    setButtonStatus(weekdays.map(() => timeslots.map(() => "Free")));
  }

  useEffect(() => {
    if (oldname && olddepartment) {
      fetchRoomDetails(oldname, olddepartment);
    }
  }, [oldname, olddepartment]);

  const rewriteUrl = (newName: string, newDepartment: string) => {
    navigate(
      `/dashboard/rooms/edit/${encodeURIComponent(
        newName
      )}/${encodeURIComponent(newDepartment)}`
    );
  };

  //fetching the details of the Room
  const fetchRoomDetails = async (name: string, department: string | null) => {
    axios
      .post(
        BACKEND_URL + "/rooms/peek",
        {
          name: name,
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
            setButtonStatus(timetableString);

            form.setFieldsValue({
              className: res.data.message.name,
              lab: res.data.message.lab ? 1 : 2,
              department: res.data.message.department,
            });
            toast.success("Room details fetched successfully!");
            break;
          default:
            toast.error("Failed to fetch room details!");
        }

        setLoading(false);
      });
  };

  const handleSubmit = async () => {
    const name = form.getFieldValue("className");
    const lab = form.getFieldValue("lab") === 1 ? true : false;
    const department = form.getFieldValue("department");
    const RoomData: Room = {
      name,
      organisation: null,
      department,
      lab,
      timetable: convertTableToString(buttonStatus),
    };

    const promise = axios.put(
      BACKEND_URL + "/rooms",
      {
        originalName: oldname,
        originalDepartment: olddepartment,
        room: RoomData,
      },
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );
    toast.promise(promise, {
      loading: "Updating room...",
      success: (res) => {
        const statusCode = res.status;
        switch (statusCode) {
          case statusCodes.OK:
            rewriteUrl(name, department);
            return "Room Updated successfully!";
          case statusCodes.BAD_REQUEST:
            return "Room Not Found!";
          case statusCodes.FORBIDDEN:
            return "Cannot Update Room!";
          case statusCodes.INTERNAL_SERVER_ERROR:
            return "Internal server error!";
        }
      },
      error: (error) => {
        console.error("Error:", error.response?.data || error.message);
        return "Failed to update Room. Please try again!";
      },
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="text-xl font-bold text-[#171A1F] pl-8 py-6 h-screen overflow-y-scroll">
      <div className="flex px-2 items-center justify-between text-[#636AE8FF] font-inter text-xl text-bold">
        <div
          onClick={() => {
            navigate("/dashboard/rooms");
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
        className="flex justify-left items-center mt-12 ml-4"
      >
        <Form
          {...formItemLayout}
          form={form}
          layout="vertical"
          requiredMark
          className="w-96"
        >
          <Form.Item name="className" label="Classroom Name" required>
            <Input placeholder="Name" className="font-inter font-normal" />
          </Form.Item>
          <Form.Item name="lab" label="Is it a Lab?" required>
            <Radio.Group>
              <Radio value={1}>Yes</Radio>
              <Radio value={2} className="ml-4 color-[#636AE8FF]">
                No
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Department" name="department">
            <Select className="font-inter font-normal" />
          </Form.Item>
          <label className="flex items-center">
            <span>Schedule</span>
            <Tooltip title="Click on the timeslots where to the Room is busy to set them to busy">
              <IoIosInformationCircleOutline className="ml-2 text-[#636AE8FF]" />
            </Tooltip>
          </label>
          <div className="flex justify-left">
            <TimeTable
              buttonStatus={buttonStatus}
              setButtonStatus={setButtonStatus}
            />
          </div>
          <div className="flex space-x-4 justify-end w-[55vm]">
            <Form.Item>
              <Button
                onClick={clearFields}
                className="border-[#636AE8FF] text-[#636AE8FF] w-[75px] h-[32px]"
              >
                Clear
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                onClick={handleSubmit}
                className="bg-[#636AE8FF] text-[#FFFFFF] w-[75px] h-[32px]"
              >
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </motion.div>
    </div>
  );
};

export default EditRoomPage;