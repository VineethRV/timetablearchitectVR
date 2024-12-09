"use client";
import { Button, Input } from "antd";
import { useState } from "react";

import { FaEyeSlash, FaUser } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { toast } from "sonner";
import { statusCodes } from "../../types/statusCodes";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../config";
import axios from "axios";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function SignUpHandler() {
    const response = axios
      .post(BACKEND_URL + "/register", { name, email, password })
      .then((res) => {
        const statusCode = res.data.status;

        switch (statusCode) {
          case statusCodes.INTERNAL_SERVER_ERROR:
            toast.error("Server error");
            break;
          case statusCodes.CONFLICT:
            toast.error("User already exists");
            break;
          case statusCodes.CREATED:
            toast.success("User registered successfully");
            toast.error("Please verify your email to login !!");
            navigate("/signin");
            break;
        }
      });

    toast.promise(response, {
      loading: "Registering user !!",
    });
  }

  return (
    <div className="flex flex-col space-y-5 px-36">
      <h1 className="font-bold text-3xl text-center">Create an account</h1>
      <div className="flex flex-col space-y-1">
        <h1 className={`font-bold text-sm ml-1`}>Full name</h1>
        <Input
          size="large"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          prefix={<FaUser className="pr-2 h-6 w-6" />}
        />
      </div>

      <div className="flex flex-col space-y-1">
        <h1 className={`font-bold text-sm ml-1`}>Email</h1>
        <Input
          size="large"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          prefix={<IoMail className="pr-2 h-6 w-6" />}
        />
      </div>

      <div className="flex flex-col space-y-1">
        <h1 className={`font-bold text-sm ml-1`}>Password</h1>
        <Input.Password
          placeholder="Enter at least 8+ characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          iconRender={(visible) => (visible ? <FaEye /> : <FaEyeSlash />)}
          className="text-base"
        />
      </div>

      <Button
        onClick={SignUpHandler}
        className="py-5 bg-[#636AE8FF] text-white font-bold"
      >
        Sign up
      </Button>
    </div>
  );
};

export default SignupForm;
