import Logo from "/Logo.png";
import FBIcon from "/social_icons/facebook.png";
import XIcon from "/social_icons/x.png";
import YTIcon from "/social_icons/yt.png";
import LinkedInIcon from "/social_icons/linkedin.png";
import { Divider } from "antd";

const Footer = () => {
  return (
    <div className="flex flex-col space-y-6 px-6 sm:px-12 lg:px-36 bg-[#FAFAFBFF] pt-8 pb-6">
      {/* Logo and Title */}
      <div className="flex space-x-3 items-center justify-center sm:justify-start">
        <img draggable={false} className="w-8 h-8" alt="tta" src={Logo} />
        <h1 className="font-bold text-base sm:text-lg">Timetable Architect</h1>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm text-center sm:text-left sm:w-[300px] mx-auto sm:mx-0">
        Streamline the process of creating, managing, and optimizing timetables
        for students and teachers
      </p>

      {/* Social Icons */}
      <div className="flex justify-center sm:justify-start space-x-6">
        <img
          draggable={false}
          src={FBIcon}
          alt="Facebook"
          className="w-6 h-6 hover:scale-110 hover:cursor-pointer transition-all duration-200"
        />
        <img
          draggable={false}
          src={XIcon}
          alt="X"
          className="w-6 h-6 hover:scale-110 hover:cursor-pointer transition-all duration-200"
        />
        <img
          draggable={false}
          src={YTIcon}
          alt="Youtube"
          className="w-6 h-6 hover:scale-110 hover:cursor-pointer transition-all duration-200"
        />
        <img
          draggable={false}
          src={LinkedInIcon}
          alt="Linkedin"
          className="w-6 h-6 hover:scale-110 hover:cursor-pointer transition-all duration-200"
        />
      </div>

      <Divider />

      {/* Footer Links */}
      <div className="flex justify-center sm:justify-end">
        <div className="flex space-x-8 text-gray-400 text-xs">
          <p>&copy; 2024 TTA</p>
          <p>&bull; Privacy &bull; Terms &bull; Sitemap</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
