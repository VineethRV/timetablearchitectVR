"use client";
import { Button, Card, Input, Select } from "antd";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import SuccessTick from "../LottieComponents/SuccessTick";
import { DEPARTMENTS_OPTIONS } from "../../../info";
import { BACKEND_URL } from "../../../config";
import axios from "axios";
import { statusCodes } from "../../types/statusCodes";

const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Viewer", value: "viewer" },
  { label: "Editor", value: "editor" },
];

const Form = () => {
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const reqAccessHandler = async () => {
    if (!department || !role || !inviteCode) {
      toast.error("Please fill all the fields.");
      return;
    }
    setLoading(true);
    axios
      .post(
        BACKEND_URL + "/user/request_access",
        {
          invite_code: inviteCode,
          department,
          level: role,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (res.data.status == statusCodes.OK) {
          setSubmitted(true);
          const promise = () =>
            new Promise((resolve) =>
              setTimeout(() => {
                navigate("/");
                resolve("");
              }, 5000)
            );

          toast.promise(promise, {
            loading: "Redirecting !!!",
          });
        } else if(res.data.status == statusCodes.UNAUTHORIZED){
          toast.error("Not authorized !!")
        } 
        else if (res.data.status == statusCodes.BAD_REQUEST) {
          toast.error("Invalid request");
        } else {
          toast.error("Server error");
        }
        setLoading(false);
      });
  };

  return submitted ? (
    <div className="flex justify-center">
      <Card className="w-60 text-center rounded-lg shadow-md">
        <SuccessTick />
        <h1 className="font-bold text-xl mt-4">
          You will receive an email once your request is accepted
        </h1>
        <p className="text-gray-600 mt-2">
          Thank you for your patience. We will notify you via email once your
          request has been reviewed and accepted.
        </p>
      </Card>
    </div>
  ) : (
    <div className="flex flex-col space-y-4 px-12">
      <h1 className="font-bold text-2xl text-center mb-6">
        Join an Organisation
      </h1>
      <div className="space-y-2">
        <h1 className="font-semibold text-sm">Department</h1>
        <Select
          className="w-full"
          value={department}
          onChange={(value) => setDepartment(value)}
          placeholder="Select Department"
          options={DEPARTMENTS_OPTIONS}
        />
      </div>
      <div className="space-y-2">
        <h1 className="font-semibold text-sm">Role</h1>
        <Select
          className="w-full"
          value={role}
          onChange={(value) => setRole(value)}
          placeholder="Select Role"
          options={ROLE_OPTIONS}
        />
      </div>
      <div className="space-y-2">
        <h1 className="font-semibold text-sm">Invite Code</h1>
        <Input
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          placeholder="Enter Invite Code"
        />
      </div>
      <Button
        onClick={reqAccessHandler}
        loading={loading}
        className="w-full bg-[#636AE8FF] text-white font-bold py-2 mt-4"
      >
        Request Access
      </Button>
      <div className="text-center text-sm mt-4">
        <span>OR </span>
        <Link to="/onboarding">
          <span className="text-[#636AE8FF] hover:no-underline cursor-pointer">
            Create an organisation
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Form;
