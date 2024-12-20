"use client";
import Logo from "/Logo.png";
import { Button } from "antd";
import { Link } from "react-router-dom";

const LandingPageNavbar = () => {
  return (
    <div className="fixed top-0 z-50 w-full shadow-sm">
      <div className="flex px-4 py-3 justify-between bg-white sm:px-6 lg:px-16">
        <div className="flex flex-row space-x-2 items-center">
          <img draggable={false} className="w-8 h-8 lg:w-10 lg:h-10" alt="tta" src={Logo} />
          <h1 className="font-bold text-xl sm:text-2xl hidden md:block">TimeTable Architect</h1>
        </div>
        <div className="flex space-x-4 items-center">
          <Link to="/signin">
            <Button className="text-primary hover:text-blue-600 transition duration-200" type="link">
              Sign in
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="text-primary hover:bg-[#636AE8FF] hover:text-white transition duration-200">
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPageNavbar;
