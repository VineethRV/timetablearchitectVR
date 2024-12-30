import { Card, Progress } from "antd";
import { useEffect, useState } from "react";
import { FaFlask, FaChalkboardTeacher, FaDoorOpen } from "react-icons/fa";
import "tailwindcss/tailwind.css";
import { BACKEND_URL } from "../../../config";
import axios from "axios";

const CapacityCard = () => {
  const [tper, setTper] = useState(0);
  const [rper, setRper] = useState(0);
  const [lper, setLper] = useState(0);

  const capacity = [
    {
      title: "Labs at",
      capacity: lper,
      icon: <FaFlask className="text-4xl text-blue-500" />,
      color: "blue",
    },
    {
      title: "Rooms at",
      capacity: rper,
      icon: <FaDoorOpen className="text-4xl text-green-500" />,
      color: "green",
    },
    {
      title: "Teachers at",
      capacity: tper,
      icon: <FaChalkboardTeacher className="text-4xl text-yellow-500" />,
      color: "yellow",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherResponse = axios.get(`${BACKEND_URL}/teacherPercentage`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        const roomResponse = axios.get(`${BACKEND_URL}/roomPercentage`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        const labResponse = axios.get(`${BACKEND_URL}/labPercentage`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        const [teacherData, roomData, labData] = await Promise.all([
          teacherResponse,
          roomResponse,
          labResponse,
        ]);

        setTper(
          teacherData.data.percentage
            ? Math.round(teacherData.data.percentage)
            : 0
        );
        setLper(
          labData.data.percentage ? Math.round(labData.data.percentage) : 0
        );
        setRper(
          roomData.data.percentage ? Math.round(roomData.data.percentage) : 0
        );
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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
              <h3 className="text-lg font-semibold text-gray-700">
                {item.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {item.capacity}%
              </p>
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
