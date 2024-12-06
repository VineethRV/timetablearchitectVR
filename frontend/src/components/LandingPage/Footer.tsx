import Logo from "../../../public/Logo.png";
import FBIcon from "../../../public/social_icons/facebook.png";
import XIcon from "../../../public/social_icons/x.png";
import YTIcon from "../../../public/social_icons/yt.png";
import LinkedInIcon from "../../../public/social_icons/linkedin.png";
import { Divider } from "antd";

const Footer = () => {
  return (
    <div className="flex flex-col space-y-4 px-36 bg-[#FAFAFBFF] pt-8 pb-2">
      <div className="flex space-x-2 items-center">
        <img draggable={false} className="w-8 h-8" alt="tta" src={Logo} />
        <h1 className="font-bold text-base">Timetable Architect</h1>
      </div>
      <p className={`text-gray-400 text-sm w-[300px]`}>
        Streamline the process of creating, managing, and optimizing timetables
        for students and teachers
      </p>
      <div className="flex space-x-4">
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
      <div className={`flex justify-end`}>
        <div className="flex space-x-12 text-gray-400 text-xs">
          <p>&copy; 2024 TTA</p>
          <p>&bull; Privacy &bull; Terms &bull; Sitemap</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
