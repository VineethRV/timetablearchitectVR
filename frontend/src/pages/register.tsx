"use client";
import { useState, useEffect } from "react";
import Topbar from "../components/onboardPage/TopBar";
import Footer from "../components/SignupPage/Footer";
import QuoteSection from "../components/SignupPage/QuoteSection";
import Loading from "../components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import Form from "../components/onboardPage/form";
import { toast } from "sonner";

const Onboard = () => {
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
        } else {
          navigate("/signin");
          toast.error("Please login to continue !!");
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;

  return (
    <main className="grid grid-cols-2 h-screen">
      <div className="flex flex-col justify-between py-4 px-6">
        <Topbar />
        <Form />
        <Footer />
      </div>
      <QuoteSection />
    </main>
  );
};

export default Onboard;
