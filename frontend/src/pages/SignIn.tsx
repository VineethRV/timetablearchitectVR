"use client";
import { useEffect, useState } from "react";
import Header from "../components/SigninPage/Header";
import SigninFormCard from "../components/SigninPage/SigninFormCard";
import SignInIllus1 from "/Illustrations/Sign1.png";
import SignInIllus2 from "/Illustrations/Sign2.png";
import { motion } from "framer-motion";
import Loading from "../components/Loading/Loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BACKEND_URL } from "../../config";

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post(
        BACKEND_URL + "/checkAuthentication",
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        const status = res.status;

        if (status == 200) {
          navigate("/dashboard");
          toast.success("User is already logged in!!");
        }

        setLoading(false);
      }).catch(()=>{

      })
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <div className="relative h-screen w-screen overflow-hidden bg-gray-50">
        <img
          className="absolute w-[370px] h-[370px] bottom-[-50px] left-[-50px] opacity-80"
          src={SignInIllus1}
          alt="Signin1"
        />
        <img
          className="absolute w-[370px] h-[370px] bottom-[-100px] right-[-50px] opacity-80"
          src={SignInIllus2}
          alt="Signin2"
        />
        <Header />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          className="flex justify-center items-center h-[86vh]"
        >
          <SigninFormCard />
        </motion.div>
      </div>
    </>
  );
};

export default Signin;
