import { Card, Progress } from "antd";
import { FaFlask, FaChalkboardTeacher, FaDoorOpen } from "react-icons/fa";
import "tailwindcss/tailwind.css";

const capacity = [
  { title: "Labs at", capacity: 67, icon: <FaFlask className="text-4xl text-blue-500" />, color: "blue" },
  { title: "Rooms at", capacity: 80, icon: <FaDoorOpen className="text-4xl text-green-500" />, color: "green" },
  { title: "Teachers at", capacity: 70, icon: <FaChalkboardTeacher className="text-4xl text-yellow-500" />, color: "yellow" },
];

const CapacityCard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-4">
      {capacity.map((item, index) => (
        <Card
          key={index}
          className="shadow-md hover:shadow-lg transition-all duration-200 rounded-lg"
          bodyStyle={{ padding: "20px" }}
        >
          <div className="flex items-center gap-4">
            <div className="icon bg-gray-100 p-4 rounded-full">{item.icon}</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-700">{item.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-2">{item.capacity}%</p>
              <Progress 
                percent={item.capacity} 
                strokeColor={item.color} 
                showInfo={false} 
                trailColor="#e5e7eb" 
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CapacityCard;
