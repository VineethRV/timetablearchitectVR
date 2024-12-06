"use client";
import { Button, Card } from "antd";
import { Link } from "react-router-dom";

const AskUniversity = () => {
  return (
    <div className="px-36 py-8">
      <Card className="bg-[#636AE8FF] p-6">
        <div className="flex flex-col space-y-4 items-center">
          <h1 className="text-4xl font-bold text-white">
            Are you a university?
          </h1>
          <p className="text-sm text-white">
            Get started by applying for access to the timetable architect to
            create efficient and optimized timetables.
          </p>
          <Link to="/onboarding">
            <Button className="p-4 w-fit">Apply now</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AskUniversity;
