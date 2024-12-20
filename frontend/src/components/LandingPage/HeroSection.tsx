"use client";
import { Button } from "antd";
import Avatar1 from "/Avatars/avatar1.png";
import Avatar2 from "/Avatars/avatar2.png";
import Scrum from "/Illustrations/Scrum.png";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  function getStartedClickHandler() {
    navigate("/dashboard");
  }

  return (
    <div className="py-16 mt-[20px] md:mt-[60px] flex flex-col items-center space-y-10 px-4 lg:px-16">
      {/* Header Section */}
      <div className="flex flex-col items-center lg:flex-row lg:justify-around w-full space-y-6 lg:space-y-0">
        <img
          className="w-16 h-16 lg:w-20 lg:h-20 hidden lg:block"
          alt="Avatar2"
          src={Avatar2}
        />
        <h1 className="text-3xl lg:text-5xl font-bold text-center">
          Timetable Architect
        </h1>
        <img
          className="w-16 h-16 lg:w-20 lg:h-20 hidden lg:block"
          alt="Avatar1"
          src={Avatar1}
        />
      </div>

      {/* Description Section */}
      <div className="text-center max-w-4xl space-y-6">
        <p className="text-gray-600 text-sm lg:text-lg">
          Timetable Architect is a smart tool that helps schools and colleges
          create timetables by assigning classes to teachers based on their
          availability. It optimizes the schedule to avoid conflicts and make
          the best use of time and resources.
        </p>
        <Button
          onClick={getStartedClickHandler}
          className="bg-[#636AE8FF] text-white px-8 lg:px-10 py-4 lg:py-6 text-md lg:text-lg font-bold rounded-md hover:bg-[#5058c5] focus:ring focus:ring-indigo-300"
        >
          Get Started
        </Button>
      </div>

      {/* Image Section */}
      <img
        draggable={false}
        src={Scrum}
        className="w-full max-w-md lg:max-w-xl h-auto"
        alt="Scrum"
      />
    </div>
  );
};

export default HeroSection;
