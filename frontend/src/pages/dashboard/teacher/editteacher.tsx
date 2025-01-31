import { useEffect, useState } from "react";
import { Button, Form, Input, message, Select, Tooltip, Upload } from "antd";
import { motion } from "framer-motion";
import { CiImport } from "react-icons/ci";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../../../../config";
import axios from "axios";
import { toast } from "sonner";
import { statusCodes } from "../../../types/statusCodes";
import { DEPARTMENTS_OPTIONS } from "../../../../info";
import { Teacher } from "../../../types/main";
import Loading from "../../../components/Loading/Loading";
import {
  convertTableToString,
  formItemLayout,
  getPosition,
  stringToTable,
  timeslots,
  weekdays,
} from "../../../utils/main";
import UneditableTimeTable from "../../../components/TimetableComponents/uneditableTimetable";

const EditTeacherpage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<Boolean>(false);
  const [_userDepartment, setDepartment] = useState("");
  const [lab, setLab] = useState("");
  const { oldname, olddepartment } = useParams();
  const clearFields = () => {
    form.setFieldValue("name", "");
    form.setFieldValue("initials", "");
    form.setFieldValue("email", "");
    form.setFieldValue("department", "");
    form.setFieldValue("altDepartment","");
    setButtonStatus(weekdays.map(() => timeslots.map(() => "Free")));
  };

  const [buttonStatus, setButtonStatus] = useState(
    weekdays.map(() => timeslots.map(() => "Free"))
  );

  useEffect(() => {
    getPosition(setDepartment, setAdmin);
    if (oldname && olddepartment) {
      fetchTeacherDetails(oldname, olddepartment);
    }
  }, [oldname, olddepartment]);

  const rewriteUrl = (newName: string, newDepartment: string) => {
    navigate(
      `/dashboard/teachers/edit/${encodeURIComponent(
        newName
      )}/${encodeURIComponent(newDepartment)}`
    );
  };

  //fetching the details of the teacher
  const fetchTeacherDetails = async (
    name: string,
    department: string | null
  ) => {
    axios
      .post(
        BACKEND_URL + "/teachers/peek",
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
            const timetable= res.data.message.timetable
              ? stringToTable(res.data.message.timetable)
              : Array(6).fill(Array(6).fill("Free"));
              const labtable = res.data.message.labtable
              ? stringToTable(res.data.message.labtable)
              : Array(6).fill(Array(6).fill("Free"));
              const finaltable = Array(6).fill(null).map(() => Array(6).fill("Free"));
            for(let i=0;i<timetable.length;i++)
            {
              for(let j=0;j<timetable[i].length;j++)
              {
                if(timetable[i][j]!="Free"){
                  finaltable[i][j]=timetable[i][j];
                }
                if(labtable[i][j]!="Free"){
                  finaltable[i][j]=labtable[i][j];
                }
              }
            }
            setLab(res.data.message.labtable)
            console.log(res.data.message)
            setButtonStatus(finaltable);
            form.setFieldsValue({
              name: res.data.message.name,
              initials: res.data.message.initials,
              email: res.data.message.email,
              department: res.data.message.department,
              altDepartment:res.data.message.alternateDepartments,
            });
            break;
          default:
            toast.error("Failed to fetch teacher details!");
        }

        setLoading(false);
      });
  };

  const handleSubmit = async () => {
    const name = form.getFieldValue("name");
    const initials = form.getFieldValue("initials");
    const email = form.getFieldValue("email");
    const department = admin ? form.getFieldValue("department") : olddepartment;
    if (!name||!initials|| (admin&&department=="")) {
      message.error("Fill all the required Fields");
      return;
    }
    const teacherData: Teacher = {
      name,
      initials,
      email,
      department,
      alternateDepartments: form.getFieldValue("altDepartment"),
      timetable: convertTableToString(buttonStatus),
      labtable:lab,
      organisation: null,
    };

    const promise = axios.put(
      BACKEND_URL + "/teachers",
      {
        originalName: oldname,
        originalDepartment: olddepartment,
        teacher: teacherData,
      },
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );
    toast.promise(promise, {
      loading: "Updating teacher...",
      success: (res) => {
        const statusCode = res.data.status;
        switch (statusCode) {
          case statusCodes.OK:
            rewriteUrl(name, department);
            return "Teacher Updated successfully!";
          case statusCodes.BAD_REQUEST:
            return "Teacher Not Found!";
          case statusCodes.FORBIDDEN:
            return "Cannot update Teacher!";
          case statusCodes.INTERNAL_SERVER_ERROR:
            return "Internal server error!";
        }
      },
      error: (error) => {
        console.error("Error:", error.response?.data || error.message);
        return "Failed to update teacher. Please try again!";
      },
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="text-xl font-bold text-[#171A1F] pl-8 py-6 w-full h-screen overflow-y-scroll">
      <div className="flex px-2 items-center justify-between text-[#636AE8FF] font-inter text-xl text-bold">
        <div
          onClick={() => {
            navigate("/dashboard/teachers");
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
        className="flex mt-12 items-center pl-4 w-full "
      >
        <Form
          {...formItemLayout}
          form={form}
          layout="vertical"
          requiredMark
          className="w-96"
        >
          <Form.Item name="name" label="Teacher Name" required>
            <Input placeholder="Name" className="font-inter font-normal " />
          </Form.Item>
          <Form.Item name="initials" label="Initials" required>
            <Input placeholder="Initials" className="font-inter font-normal" />
          </Form.Item>
          <Form.Item name="email" label="Email Id">
            <Input placeholder="Email Id" className="font-inter font-normal" />
          </Form.Item>
          {admin ? (
            <div>
              <Form.Item name="department" label="Department">
                <Select
                  showSearch
                  placeholder="Select a department"
                  optionFilterProp="label"
                  options={DEPARTMENTS_OPTIONS}
                  className="font-normal w-96"
                />
              </Form.Item>
            </div>
          ) : (
            <></>
          )}
             <Form.Item
          label="Alternate Department"
            name="altDepartment"
          >
              <Select
                showSearch
                mode="tags"
                placeholder="Select alternate departments"
                optionFilterProp="label"
                options={DEPARTMENTS_OPTIONS}
                className="font-normal w-96"
              />
          </Form.Item>
          {/* <Form.Item name="department" label="Department">
            <Select
              showSearch
              style={{ display: admin ? "block" : "none" }}
              placeholder="Select a department"
              optionFilterProp="label"
              options={DEPARTMENTS_OPTIONS}
              className="font-normal w-96"
            />
          </Form.Item> */}
          <label>
            <div className="flex items-center">
              <span>Schedule</span>
              <Tooltip title="Click on the timeslots where to the teacher  busy to set them to busy">
                <IoIosInformationCircleOutline className="ml-2 w-4 h-4 text-[#636AE8FF]" />
              </Tooltip>
            </div>
          </label>
          <UneditableTimeTable
            buttonStatus={buttonStatus}
            setButtonStatus={setButtonStatus}
            editable={true}
          />
          <div className="flex justify-end">
            <div className="flex space-x-4">
              <Form.Item>
                <Button
                  onClick={clearFields}
                  className="border-[#636AE8FF] text-[#636AE8FF]"
                >
                  Clear
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  onClick={handleSubmit}
                  className="bg-primary text-[#FFFFFF]"
                >
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

export default EditTeacherpage;
