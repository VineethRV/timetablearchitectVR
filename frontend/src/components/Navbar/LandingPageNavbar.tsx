"use client";
import Logo from "/Logo.png";

import { Button } from "antd";
import { Link } from "react-router-dom";

const LandingPageNavbar = () => {
  return (
    <div className="fixed top-0 z-50 w-full shadow-sm">
      <div className="flex px-4 py-3 justify-between bg-white">
        <div className="flex flex-row space-x-2  items-center">
          <img draggable={false} className="w-8 h-8" alt="tta" src={Logo} />
          <h1 className="font-bold text-xl">TimeTable Architect</h1>
        </div>
        <div className="flex space-x-2 items-center">
          <Link to="/signin">
            <Button className="text-primary" type="link">
              Sign in
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="text-primary">Sign up</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPageNavbar;