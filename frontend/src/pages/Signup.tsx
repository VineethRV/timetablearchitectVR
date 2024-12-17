"use client";
import { useState, useEffect } from "react";
import Topbar from "../components/SignupPage/Topbar";
import SignupForm from "../components/SignupPage/SignupForm";
import Footer from "../components/SignupPage/Footer";
import QuoteSection from "../components/SignupPage/QuoteSection";
import Loading from "../components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import { toast } from "sonner";

const Signup = () => {
  const [loading, setLoading] = useState(true);

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

        if (status == 200) {
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
        else {
          setLoading(false);
        }
      });
  }, []);

  if (loading) return <Loading />;

  return (
    <main className="grid grid-cols-2 h-screen">
      <div className="flex flex-col justify-between py-4 px-6">
        <Topbar />
        <SignupForm />
        <Footer />
      </div>
      <QuoteSection />
    </main>
  );
};

export default Signup;
