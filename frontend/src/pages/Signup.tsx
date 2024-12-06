"use client";
import { useState, useEffect } from "react";
import Topbar from "../components/SignupPage/Topbar";
import SignupForm from "../components/SignupPage/SignupForm";
import Footer from "../components/SignupPage/Footer";
import QuoteSection from "../components/SignupPage/QuoteSection";
// import { useRouter } from 'next/navigation';
// import { checkAuthentication } from '@/lib/actions/auth';
// import { toast } from 'sonner';
import Loading from "../components/Loading/Loading";

const Signup = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // checkAuthentication(localStorage.getItem('token') || "").then((verify) => {
    //   if (verify) {
    //     router.push('/dashboard');
    //     toast.success('User already logged in !!');
    //   }
    //   setTimeout(() => setLoading(false), 1000);
    // })
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
