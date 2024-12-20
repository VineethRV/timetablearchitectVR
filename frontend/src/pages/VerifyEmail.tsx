import { useSearchParams } from "react-router-dom";
import { useEffect, useState, Suspense } from "react";
import Loading from "../components/Loading/Loading";
import Header from "../components/SigninPage/Header";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { statusCodes } from "../types/statusCodes";

const VerifyEmail = () => {
  const [searchParams, _setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(false);

  function verifyEmailHandler() {
    axios
      .post(BACKEND_URL + "/auth/verify_email", {
        token,
      })
      .then((res) => {
        const status = res.data.status;
        if (status == statusCodes.OK) {
          setVerificationStatus(true);
        }
        setLoading(false);
      });
  }

  useEffect(() => {
    verifyEmailHandler();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        {loading ? (
          <Loading />
        ) : (
          <div className="verification-container bg-white shadow-lg rounded-xl p-8 text-center max-w-md">
            {verificationStatus ? (
              <>
                <h1 className="text-2xl font-bold text-green-600 mb-4">
                  Email Verified Successfully
                </h1>
                <p className="text-gray-600 mb-6">
                  Your email has been verified. You can now log in to your
                  account.
                </p>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out"
                  onClick={() => (window.location.href = "/signin")}
                >
                  Go to Login
                </button>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-red-600 mb-4">
                  Invalid Email Verification
                </h1>
                <p className="text-gray-600 mb-6">
                  The verification link is invalid or has expired. Please try
                  verifying your email again.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function VerifyComponent() {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyEmail />
    </Suspense>
  );
}
