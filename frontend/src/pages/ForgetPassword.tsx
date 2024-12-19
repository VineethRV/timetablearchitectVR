import { Button, Input } from "antd";
import { useState } from "react";
import { statusCodes } from "../types/statusCodes";
import { toast } from "sonner";
import Header from "../components/SigninPage/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../config";

const ForgetOTP = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  function sendOTP() {
    const res = axios
      .post(BACKEND_URL + "/auth/forget_pass", {
        email,
      })
      .then((res) => {
        const statusCode = res?.data.status;

        switch (statusCode) {
          case statusCodes.OK:
            toast.success("OTP sent to your mail successfully !!");
            setToken(res.data.token);
            setStep((s) => s + 1);
            break;
          case statusCodes.BAD_REQUEST:
            toast.error("User does not exist");
            break;
          case statusCodes.INTERNAL_SERVER_ERROR:
            toast.error("Server error");
            break;
        }
      });

    toast.promise(res, {
      loading: "Sending otp ...",
    });
  }

  function verifyOTPHandler() {
    const res = axios
      .post(BACKEND_URL + "/auth/verify_otp", {
        email,
        token,
        otp: Number(otp),
      })
      .then((res) => {
        const statusCode = res.status;

        switch (statusCode) {
          case statusCodes.OK:
            toast.success("OTP verified successfully !!");
            setStep((s) => s + 1);
            break;
          case statusCodes.UNAUTHORIZED:
            toast.error("Otp is invalid !!");
            break;
          case statusCodes.INTERNAL_SERVER_ERROR:
            toast.error("Server error !!");
            break;
        }
      });

    toast.promise(res, {
      loading: "Verifying otp ...",
    });
  }

  function resetPasswordHandler() {
    const res = axios
      .post(BACKEND_URL + "/auth/reset_pass", {
        email,
        token,
        otp: Number(otp),
        password: pass,
      })
      .then((res) => {
        const statusCode = res.status;

        switch (statusCode) {
          case statusCodes.OK:
            toast.success("Password reseted successfully !!");
            setTimeout(() => {
              toast.info("Login to continue");
              navigate("/signin");
            }, 3000);
            break;
          case statusCodes.UNAUTHORIZED:
            toast.error("Invalid request");
            break;
          case statusCodes.INTERNAL_SERVER_ERROR:
            toast.error("Server error");
            break;
        }
      });

    toast.promise(res, {
      loading: "Reseting password !!",
    });
  }

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="flex space-y-1 flex-col">
              <h1 className="font-bold">Please enter your email to continue</h1>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button onClick={sendOTP}>Send OTP</Button>
          </>
        );
      case 1:
        return (
          <>
            <h1 className="font-bold">Enter otp to continue</h1>
            <div className="w-[360px]">
              <Input.OTP
                value={otp}
                onChange={(e) => setOtp(e)}
                type="number"
                length={6}
              />
            </div>
            <Button onClick={verifyOTPHandler}>Verify</Button>
          </>
        );
      case 2:
        return (
          <>
            <h1 className="font-bold">Enter your new password</h1>
            <Input.Password
              className="w-[300px]"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Enter your new password .."
            />
            <Button onClick={resetPasswordHandler}>Reset</Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex justify-center items-center flex-grow">
        <div className="flex flex-col space-y-6 p-8 shadow-md rounded-xl">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ForgetOTP;
