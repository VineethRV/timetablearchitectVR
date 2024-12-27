import { Button, Card, Input } from "antd";
import { useState } from "react";
import { Checkbox } from "antd";
import { FaEye, FaEyeSlash, FaUnlockAlt } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../../config";
import { toast } from "sonner";
import { statusCodes } from "../../types/statusCodes";
import { useNavigate } from "react-router-dom";

const SigninFormCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogged, setKeepLogged] = useState(false);
  const navigate = useNavigate();

  function signInHandler() {
    const response = axios
      .post(BACKEND_URL + "/login", { email, password })
      .then((res) => {
        const statusCode = res.data.status;

        switch (statusCode) {
          case statusCodes.OK:
            toast.success("User logged in successfully");
            localStorage.setItem("token", "Bearer " + res.data.message);
            if (keepLogged) localStorage.setItem("keepLogged", "true");
            navigate("/dashboard");
            break;
          case statusCodes.NOT_ACCEPTABLE:
            toast.error("Please verify your email to continue");
            break;
          case statusCodes.NOT_FOUND:
            toast.error("User does not exist");
            break;
          case statusCodes.UNAUTHORIZED:
            toast.error("Wrong credentials");
            break;
          case statusCodes.INTERNAL_SERVER_ERROR:
            toast.error("Server error");
            break;
        }
      });

    toast.promise(response, {
      loading: "Logging in !!",
    });
  }

  return (
    <Card className="flex flex-col w-[95%] max-w-[460px] px-6 sm:px-8 rounded-2xl py-3 shadow-lg">
      <h1 className="font-bold text-2xl sm:text-3xl text-center">
        Welcome back 👋
      </h1>
      <div className="flex flex-col space-y-1 mt-6">
        <h1 className="font-bold text-sm">Email</h1>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="large"
          placeholder="Enter your email"
          prefix={<CiMail className="pr-2 h-6 w-6" />}
        />
      </div>
      <div className="flex flex-col space-y-1 mt-4">
        <h1 className="font-bold text-sm">Password</h1>
        <Input.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          iconRender={(visible) => (visible ? <FaEye /> : <FaEyeSlash />)}
          prefix={<FaUnlockAlt className="pr-2 w-5 h-5" />}
          className="text-base"
        />
      </div>
      <div className="flex mt-4 justify-between">
        <div className="flex space-x-2 items-center">
          <Checkbox onClick={() => setKeepLogged(!keepLogged)} />
          <p className="text-xs md:text-sm font-medium">Keep me logged in</p>
        </div>
        <div className="flex items-center">
        <Link to="/forget-password">
          <p className="text-[#636AE8FF] font-medium hover:cursor-pointer text-xs md:text-sm">
            Forget Password?
          </p>
        </Link>
        </div>
      </div>
      <Button
        onClick={signInHandler}
        className="mt-3 w-full bg-[#636AE8FF] font-bold py-4 text-white"
      >
        Sign In
      </Button>
      <p className="text-sm text-center mt-4">
        Not a member yet?{" "}
        <Link to="/signup">
          <span className="text-[#636AE8FF] font-bold hover:cursor-pointer">
            Register now
          </span>
        </Link>
      </p>
    </Card>
  );
};

export default SigninFormCard;
