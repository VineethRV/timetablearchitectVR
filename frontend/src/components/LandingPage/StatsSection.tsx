import { Card } from "antd";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { MdEventAvailable } from "react-icons/md";
import { VscWorkspaceTrusted } from "react-icons/vsc";

const StatsSection = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-8 lg:px-44 py-12">
      {/* New Users */}
      <Card className="flex flex-col items-center bg-[#F2F2FDFF] hover:scale-105 transition-all duration-300 shadow-lg rounded-lg">
        <div className="flex justify-center">
          <FaRegUserCircle className="text-[#636AE8FF]" fontSize={40} />
        </div>
        <h1 className="font-bold text-[#636AE8FF] text-2xl text-center mt-2">
          1K+
        </h1>
        <h1 className="text-base text-gray-700">New Users</h1>
      </Card>

      {/* Timetables Generated */}
      <Card className="flex flex-col items-center bg-[#EFFCFAFF] hover:scale-105 transition-all duration-300 shadow-lg rounded-lg">
        <div className="flex justify-center">
          <MdEventAvailable className="text-[#22CCB2FF]" fontSize={40} />
        </div>
        <h1 className="font-bold text-[#22CCB2FF] text-2xl text-center mt-2">
          100+
        </h1>
        <h1 className="text-base text-gray-700">Timetables Generated</h1>
      </Card>

      {/* Trusted Universities */}
      <Card className="flex flex-col items-center bg-[#FDF1F5FF] hover:scale-105 transition-all duration-300 shadow-lg rounded-lg">
        <div className="flex justify-center">
          <VscWorkspaceTrusted className="text-[#E8618CFF]" fontSize={40} />
        </div>
        <h1 className="font-bold text-[#E8618CFF] text-2xl text-center mt-2">
          30+
        </h1>
        <h1 className="text-base text-gray-700">Trusted Universities</h1>
      </Card>

      {/* Time Saved */}
      <Card className="flex flex-col items-center bg-[#F5F2FDFF] hover:scale-105 transition-all duration-300 shadow-lg rounded-lg">
        <div className="flex justify-center">
          <IoMdTime className="text-[#7F55E0FF]" fontSize={40} />
        </div>
        <h1 className="font-bold text-[#7F55E0FF] text-2xl text-center mt-2">
          90%
        </h1>
        <h1 className="text-base text-gray-700">Saves Time</h1>
      </Card>
    </div>
  );
};

export default StatsSection;
