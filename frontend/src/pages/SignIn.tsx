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
            authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        const status = res.data.status;

        if (status === 200) {
          axios
            .get(BACKEND_URL + "/user/check_org", {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            })
            .then(({ data }) => {
              if (!data.result) {
                navigate("/onboard");
                toast.info("Please complete onboarding process");
              } else {
                navigate("/dashboard");
                toast.success("User is already logged in!!");
              }
              setLoading(false);
            });
        }
      });
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-50">
      {/* Background Images */}
      <img
        className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[370px] md:h-[370px] bottom-[-50px] left-[-50px] opacity-80"
        src={SignInIllus1}
        alt="Signin1"
      />
      <img
        className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[370px] md:h-[370px] bottom-[-100px] right-[-50px] opacity-80"
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
        className="flex justify-center items-center h-[80vh]"
      >
        <SigninFormCard />
      </motion.div>
    </div>
  );
};

export default Signin;
