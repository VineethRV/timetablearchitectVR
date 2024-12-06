"use client";
import { Button, Card, Typography } from "antd";
import React, { Dispatch, SetStateAction, useState } from "react";
import SuccessTick from "../../LottieComponents/SuccessTick";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const { Title, Paragraph } = Typography;

const ConfirmPage = ({
  setBackBtnDisable,
}: {
  setBackBtnDisable: Dispatch<SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    setLoading(true);

    // Timeout simulating an api call to backend to register organisation
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setBackBtnDisable(true);
      const promise = () =>
        new Promise((resolve) =>
          setTimeout(() => {
            router.push("/");
            resolve("");
          }, 5000)
        );

      toast.promise(promise, {
        loading: "Redirecting...",
      });
    }, 4000);
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
