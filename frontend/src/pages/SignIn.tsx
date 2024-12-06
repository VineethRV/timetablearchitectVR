"use client"
import { useEffect, useState } from 'react';
import Header from '../components/SigninPage/Header';
import SigninFormCard from '../components/SigninPage/SigninFormCard';
import SignInIllus1 from '/Illustrations/Sign1.png';
import SignInIllus2 from '/Illustrations/Sign2.png';
import { motion } from 'framer-motion'
// import { checkAuthentication } from '@/lib/actions/auth';
// import { toast } from 'sonner';
import Loading from '../components/Loading/Loading'

const Signin = () => {
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    // checkAuthentication(localStorage.getItem('token') || "").then((verify) => {
    //   if (verify) {
    //     router.push('/dashboard');
    //     toast.success("User is already logged in !!");
    //   }

      // setTimeout(() => setLoading(false), 1000);
    // })
  }, [])

  if (loading) return <Loading />

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
          }} className="flex justify-center items-center h-[86vh]">
          <SigninFormCard />
        </motion.div>
      </div>
    </>
  );
};

export default Signin;
