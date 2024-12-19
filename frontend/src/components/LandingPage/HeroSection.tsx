"use client";
import { Button } from "antd";
import Avatar1 from "/Avatars/avatar1.png";
import Avatar2 from "/Avatars/avatar2.png";
import Scrum from "/Illustrations/Scrum.png";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  function getStartedClickHandler() {
    navigate('/dashboard');
  }

  return (
    <div className="py-16 flex mt-[60px] flex-col items-center">
      <div className="flex justify-around w-full">
        <img className="w-20 h-20" alt="Avatar2" src={Avatar2} />
        <h1 className="text-5xl font-bold">Timetable Architect</h1>
        <img className="w-20 h-20" alt="Avatar1" src={Avatar1} />
      </div>
      <div className="flex flex-col items-center space-y-10">
        <p className="text-gray-600 text-lg text-center px-96">
          Timetable Architect is a smart tool that helps schools and colleges
          create timetables by assigning classes to teachers based on their
          availability. It optimizes the schedule to avoid conflicts and make
          the best use of time and resources.
        </p>
        <Button
          onClick={getStartedClickHandler}
          className="bg-[#636AE8FF] text-white px-10 w-fit text-lg py-6 font-bold"
        >
          Get Started
        </Button>
      </div>
      <img
        draggable={false}
        src={Scrum}
        className="w-[540px] h-[380px]"
        alt="Scrum"
      />
    </div>
  );
};

export default HeroSection;