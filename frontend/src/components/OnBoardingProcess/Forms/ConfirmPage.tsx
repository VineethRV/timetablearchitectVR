"use client";
import { Button, Card, Typography } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import SuccessTick from "../../LottieComponents/SuccessTick";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { OrganisationSchema } from "../../../types/main";
import axios from "axios";
import { BACKEND_URL } from "../../../../config";
import { statusCodes } from "../../../types/statusCodes";
const { Title, Paragraph } = Typography;

const ConfirmPage = ({
  setBackBtnDisable,
  organisationDetails,
}: {
  organisationDetails: OrganisationSchema;
  setBackBtnDisable: Dispatch<SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    setLoading(true);
    setBackBtnDisable(true);
    axios
      .post(
        BACKEND_URL + "/org/onboarding",
        {
          name: organisationDetails.name,
          sections: organisationDetails.sections,
          teachers: organisationDetails.teachers,
          students: organisationDetails.students,
          depts_list: organisationDetails.depts_list,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        const status = res.data.status;
        if (status == statusCodes.CREATED) {
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
        } else if (status == statusCodes.BAD_REQUEST) {
          toast.error("Invalid request !!");
        } else if (status == statusCodes.CONFLICT) {
          toast.error("Organisation name already taken !!");
        } else {
          toast.error("Server error !!");
        }
        setLoading(false);
        setBackBtnDisable(false);
      });
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
