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
    const checkAuthentication = async () => {
      try {
        // Step 1: Check if the user is authenticated
        const authResponse = await axios.post(
          BACKEND_URL + "/checkAuthentication",
          {},
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        );

        const authStatus = authResponse.data.status;

        if (authStatus === 200) {
          // Step 2: Fetch user's position
          const positionResponse = await axios.post(
            BACKEND_URL + "/getPosition",
            {},
            {
              headers: {
                authorization: localStorage.getItem("token"),
              },
            }
          );
          const userHasAccess = positionResponse.data.status; // Assume backend returns `hasAccess`

          if (userHasAccess==200) {
            navigate("/dashboard");
            toast.success("Welcome to the dashboard!");
          } else {
            navigate("/onboard");
            toast.warning("You don't have access yet. Please complete onboarding on wait for your response to get accepted.");
          }
        } else {
          setLoading(false); // Adjust based on your state logic
        }
      } catch (error) {
        console.error("Error during authentication or access check:", error);
        toast.error("An error occurred. Please try again later.");
      }
    };

    checkAuthentication();
  }, [navigate]);
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
