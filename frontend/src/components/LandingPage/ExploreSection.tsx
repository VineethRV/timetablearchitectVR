import { Button } from "antd";
import Teaching from "/Illustrations/Teaching.png";
import TeamCollab from "/Illustrations/TeamCollab.png";

const ExploreSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-16 px-4 lg:px-36">
      {/* Section 1 */}
      <div className="flex flex-col py-8 px-6 lg:px-12 justify-center space-y-6">
        <h1 className="font-bold text-3xl lg:text-4xl">
          <span className="text-primary">Optimal</span> timetable for teachers
          and students
        </h1>
        <p className="text-gray-500 text-sm lg:text-base">
          It uses algorithms to create optimal timetables for teachers and
          students, ensuring efficiency and balance.
        </p>
        <Button className="w-fit bg-[#636AE8FF] text-white hover:bg-[#5058c5] px-6 py-3 text-sm font-bold rounded-lg">
          Learn more
        </Button>
      </div>
      <img
        draggable={false}
        alt="Teaching"
        className="w-full max-w-md lg:max-w-lg h-auto mx-auto"
        src={Teaching}
      />

      {/* Section 2 */}
      <img
        draggable={false}
        alt="TeamCollab"
        className="w-full max-w-md lg:max-w-lg h-auto mx-auto"
        src={TeamCollab}
      />
      <div className="flex flex-col py-8 px-6 lg:px-12 justify-center space-y-6">
        <h1 className="font-bold text-3xl lg:text-4xl">
          Create your timetable
          <span className="text-primary"> collaboratively </span> with ease
        </h1>
        <p className="text-gray-500 text-sm lg:text-base">
          Sharing the event schedule allows attendees to be well-informed about
          the agenda and timing, ensuring seamless collaboration.
        </p>
        <Button className="w-fit bg-[#636AE8FF] text-white hover:bg-[#5058c5] px-6 py-3 text-sm font-bold rounded-lg">
          Learn more
        </Button>
      </div>
    </div>
  );
};

export default ExploreSection;
