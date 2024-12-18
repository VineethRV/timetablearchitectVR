"use client";
import { Button, Card, Typography } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import SuccessTick from "../../LottieComponents/SuccessTick";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { OrganisationSchema } from "../../../types/main";
import axios from "axios";
import { BACKEND_URL } from "../../../../config";
import { OrganisationSchema } from "../../../types/main";
import axios from "axios";
import { BACKEND_URL } from "../../../../config";

const { Title, Paragraph } = Typography;

const ConfirmPage = ({
  setBackBtnDisable,
  organisationDetails,
  organisationDetails,
}: {
  organisationDetails: OrganisationSchema;
  organisationDetails: OrganisationSchema;
  setBackBtnDisable: Dispatch<SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async () => {
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      console.log(organisationDetails)
      const response = await axios.post(
        BACKEND_URL+'/onboard',
        organisationDetails,
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log(response)
      // Mock delay for UI feedback
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
        setBackBtnDisable(true);

        // Redirect after submission success
        const promise = () =>
          new Promise((resolve) =>
            setTimeout(() => {
              navigate("/");
              resolve("");
            }, 5000)
          );

        toast.promise(promise, {
          loading: "Redirecting...",
          success: "Registration successful! Redirecting...",
        });
      }, 2000);

    } catch (error) {
      setLoading(false);
      toast.error("Failed to submit registration. Please try again.");
      console.error("Error during submission:", error);
    }
        toast.promise(promise, {
          loading: "Redirecting...",
          success: "Registration successful! Redirecting...",
        });
      }, 2000);

    } catch (error) {
      setLoading(false);
      toast.error("Failed to submit registration. Please try again.");
      console.error("Error during submission:", error);
    }
  };

  return (
    <div className="flex justify-center py-2">
      <Card className="w-96 text-center rounded-lg shadow-md">
        {submitted ? (
          <>
            <SuccessTick />
            <h1 className="font-bold text-xl mt-4">
              You will receive an email once your application is accepted
            </h1>
            <p className="text-gray-600 mt-2">
              Thank you for your patience. We will notify you via email once
              your application has been reviewed and accepted.
            </p>
          </>
        ) : (
          <>
            <Title level={3} className="text-gray-800">
              Confirm Your Registration
            </Title>
            <Paragraph className="text-gray-600 text-lg">
              Please click the button below to confirm your registration.
            </Paragraph>
            <Button
              size="large"
              className={`bg-green-600 border-green-600 bg-primary text-white rounded-md w-full mt-4 ${
                loading ? "cursor-not-allowed" : ""
              }`}
              onClick={handleSubmit}
              loading={loading}
            >
              Submit
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default ConfirmPage;
