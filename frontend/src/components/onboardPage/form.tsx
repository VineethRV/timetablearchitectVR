"use client";
import { Button, Card, Input } from "antd";
import { useState } from "react";
import { FaEyeSlash, FaBuilding, FaEye, FaUser } from "react-icons/fa";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import SuccessTick from "../LottieComponents/SuccessTick";

const Form = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const SignUpHandler = () => {
    if (!name || !email || !password) {
      toast.error("Please fill all the fields.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);

      const promise = () =>
        new Promise((resolve) =>
          setTimeout(() => {
            navigate("/");
            resolve("");
          }, 5000)
        );

      toast.promise(promise, {
        loading: "Redirecting...",
      });
    }, 4000);
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
      <h1 className="font-bold text-2xl text-center mb-6">Join an Organisation</h1>
      <div className="space-y-2">
        <h1 className="font-semibold text-sm">Department</h1>
        <Input
          size="large"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Civil Engineering"
          prefix={<FaBuilding className="h-5 w-5" />}
        />
      </div>
      <div className="space-y-2">
        <h1 className="font-semibold text-sm">Role</h1>
        <Input
          size="large"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Editor"
          prefix={<FaUser className="h-5 w-5" />}
        />
      </div>
      <div className="space-y-2">
        <h1 className="font-semibold text-sm">Organisation Code</h1>
        <Input.Password
          size="large"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          iconRender={(visible) => (visible ? <FaEye /> : <FaEyeSlash />)}
        />
      </div>
      <Button
        onClick={SignUpHandler}
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
