"use client"
import LandingPageNavbar from "../components/Navbar/LandingPageNavbar";
import HeroSection from "../components/LandingPage/HeroSection";
import StatsSection from "../components/LandingPage/StatsSection";
import ExploreSection from "../components/LandingPage/ExploreSection";
import AskUniversity from "../components/LandingPage/AskUniversity";
import FAQ from "../components/LandingPage/FAQ";
import Footer from "../components/LandingPage/Footer";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <LandingPageNavbar />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
      >
        <HeroSection />
        <StatsSection />
        <ExploreSection />
        <AskUniversity />
        <FAQ />
        <Footer />
      </motion.div>
    </>
  );
}
