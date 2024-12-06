import { Card } from "antd";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { MdEventAvailable } from "react-icons/md";
import { VscWorkspaceTrusted } from "react-icons/vsc";

const StatsSection = () => {
  return (
    <div className="grid grid-cols-4 gap-8 px-44 py-8">
      <Card className="flex bg-[#F2F2FDFF] flex-col items-center hover:scale-105 transition-all duration-300">
        <div className="flex justify-center">
        <FaRegUserCircle className="text-[#636AE8FF]" fontSize={40}/>
        </div>
        <h1 className="font-bold text-[#636AE8FF] text-2xl text-center mt-2">1K+</h1>
        <h1  className="text-base">New Users</h1>
      </Card>

      <Card className="flex flex-col bg-[#EFFCFAFF] items-center space-y-1 hover:scale-105 transition-all duration-300">
        <div className="flex justify-center">
        <MdEventAvailable className="text-[#22CCB2FF]" fontSize={40}/>
        </div>
        <h1 className="font-bold text-[#22CCB2FF] text-2xl text-center mt-2">100+</h1>
        <h1 className="text-base">Timetables generated</h1>
      </Card>

      <Card className="flex bg-[#FDF1F5FF] flex-col items-center space-y-1 hover:scale-105 transition-all duration-300">
        <div className="flex justify-center">
        <VscWorkspaceTrusted className="text-[#E8618CFF]" fontSize={40}/>
        </div>
        <h1 className="font-bold text-2xl text-center mt-2 text-[#E8618CFF]">30+</h1>
        <h1  className="text-base">Trusted Universities</h1>
      </Card>

      <Card className="flex bg-[#F5F2FDFF] flex-col items-center space-y-1 hover:scale-105 transition-all duration-300">
        <div className="flex justify-center">
        <IoMdTime className="text-[#7F55E0FF]" fontSize={40}/>
        </div>
        <h1 className="font-bold text-[#7F55E0FF] text-2xl text-center mt-2">90%</h1>
        <h1 className="text-base">Saves Time</h1>
      </Card>
    </div>
  );
};

export default StatsSection;