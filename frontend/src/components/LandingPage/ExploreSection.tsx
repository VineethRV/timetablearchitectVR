import { Button } from "antd";
import Teaching from "/Illustrations/Teaching.png";
import TeamCollab from "/Illustrations/TeamCollab.png";

const ExploreSection = () => {
  return (
    <div className="grid grid-cols-2 gap-12 py-16 px-36">
      <div className="flex flex-col py-8 px-12 justify-center space-y-4">
        <h1 className="font-bold text-4xl">
          <span className="text-primary">Optimal</span> timetable for teachers
          and students
        </h1>
        <p className="text-gray-500">
          It uses algorithms to create optimal timetables for teachers and
          students.
        </p>
        <Button className="w-fit bg-[#F2F2FDFF] text-[#636AE8FF]">
          Learn more
        </Button>
      </div>
      <img
        draggable={false}
        alt="Teaching"
        className="w-[500px] h-[300px]"
        src={Teaching}
      />
      <img
        draggable={false}
        alt="TeamCollab"
        className="w-[500px] h-[300px]"
        src={TeamCollab}
      />
      <div className="flex flex-col py-8 justify-center space-y-4 px-12">
        <h1 className="font-bold text-4xl">
          Create your timetable
          <span className="text-primary"> collaboratively </span> with ease
        </h1>
        <p className="text-gray-500">
          Sharing the event schedule allows attendees to be well-informed about
          the event&apos;s agenda, timing
        </p>
        <Button className="w-fit bg-[#F2F2FDFF] text-[#636AE8FF]">
          Learn more
        </Button>
      </div>
    </div>
  );
};

export default ExploreSection;