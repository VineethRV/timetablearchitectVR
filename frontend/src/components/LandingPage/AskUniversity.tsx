import { Button, Card } from "antd";
import { Link } from "react-router-dom";

const AskUniversity = () => {
  return (
    <div className="px-6 lg:px-36 py-8">
      <Card className="bg-[#636AE8FF] p-4 lg:p-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col space-y-6 items-center text-center">
          <h1 className="text-2xl lg:text-4xl font-bold text-white">
            Are you a university?
          </h1>
          <p className="text-sm lg:text-base text-white">
            Get started by applying for access to the timetable architect to
            create efficient and optimized timetables for your institution.
          </p>
          <Link to="/onboarding">
            <Button
              className="bg-white text-[#636AE8FF] hover:bg-[#5058c5] hover:text-white px-6 py-3 font-bold rounded-md"
            >
              Apply Now
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AskUniversity;
