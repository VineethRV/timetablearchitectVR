import { Layout, Card, Row, Col } from "antd";
import { TbLayoutDashboard } from "react-icons/tb";
import { FiBarChart2 } from "react-icons/fi";
import CapacityCard from "../../components/AdminPanelComp/CapacityCard";
import RequestAccessWrapper from "../../components/AdminPanelComp/RequestAccessWrap";
import { GridDisplay } from "../../components/TopComponents/GridDisplay";
import { useEffect, useState } from "react";
const { Header, Content } = Layout;
import axios from "axios";
import { BACKEND_URL } from "../../../config";

const AdminPanel = () => {
  const [topTeachers, setTopTeachers] = useState([]);
  const [topRooms, setTopRooms] = useState([]);
  const [topLabs, setTopLabs] = useState([]);
  const [accessCode, setAccessCode] = useState("");
  const [admin,setAdmin] = useState(false);
  const [stats,setStats] =useState([
    { title: "Sections formed", number: 0 },
    { title: "Electives made", number: 0 },
    { title: "Labs alloted", number: 0 },
  ]);
  
  useEffect(() => {
    async function fetchData() {
      const sectionCountData = await axios.get(BACKEND_URL + "/sectionCount", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      console.log("sectuibCuynbg",sectionCountData);
      if (sectionCountData.data.status === 200) {
        setStats([
          { title: "Sections formed", number: sectionCountData.data.section },
          { title: "Electives made", number: sectionCountData.data.electives },
          { title: "Labs alloted", number: sectionCountData.data.lab },
        ]);
      }
      const userData = await axios.post(BACKEND_URL + "/getPosition", {}, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      setAdmin(userData.data.message.role=="admin")
      const { data: teachersData } = await axios.get(
        BACKEND_URL + "/teacherPercentage",
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      console.log("teacherData",teachersData)
      const formattedTeachersData = teachersData.rank
        .filter(
          (name: string, index: number) =>
            name && teachersData.department[index]
        )
        .map((name: string, index: number) => ({
          id: index + 1,
          name: name,
          department: teachersData.department[index],
          score: teachersData.score[index],
        }));

      setTopTeachers(formattedTeachersData);

      const { data: roomsData } = await axios.get(
        BACKEND_URL + "/roomPercentage",
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      const formattedRoomsData = roomsData.rank
        .filter(
          (name: string, index: number) => name && roomsData.department[index]
        )
        .map((name: string, index: number) => ({
          id: index + 1,
          name: name,
          department: roomsData.department[index],
          score: roomsData.score[index],
          lab: false,
        }));

      setTopRooms(formattedRoomsData);

      const { data: labsData } = await axios.get(
        BACKEND_URL + "/labPercentage",
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      const formattedLabsData = labsData.rank
        .filter(
          (name: string, index: number) => name && labsData.department[index]
        )
        .map((name: string, index: number) => ({
          id: index + 1,
          name: name,
          department: labsData.department[index],
          score: labsData.score[index],
          lab: true,
        }));
      
      setTopLabs(formattedLabsData);

      const accessCode = await axios.get(
        BACKEND_URL + "/accessCode",
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setAccessCode(accessCode.data.accessCode);
    }

    fetchData();
  }, []);

  return (
    <Layout className="bg-slate-50 overflow-scroll h-full w-full overflow-x-hidden">
      {/* Header Section */}
      <Header className="bg-white border-b-2 shadow-md flex items-center px-4">
        <TbLayoutDashboard size={25} className="mr-2 text-purple-500" />
        <h1 className="text-lg font-bold">Dashboard</h1>
      </Header>

      <Content className="px-8 py-6">
        {/* Stats Section */}
        <Row gutter={[16, 16]}>
          {stats.map((stat) => (
            <Col xs={24} sm={12} md={8} key={stat.title}>
              <Card
                className="rounded-lg"
                style={{ backgroundColor: "#E6E6FA" }}
                bodyStyle={{ display: "flex", alignItems: "center" }}
              >
                <FiBarChart2 className="text-4xl text-green-500 mr-4" />
                <div>
                  <h1 className="text-base font-semibold text-gray-700">
                    {stat.title}
                  </h1>
                  <h1 className="text-3xl font-bold text-black">
                    {stat.number}
                  </h1>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <CapacityCard />
        {admin?<RequestAccessWrapper accessCode={accessCode}/>:<></>}
        <GridDisplay teachers={topTeachers} rooms={topRooms} labs={topLabs} />
      </Content>
    </Layout>
  );
};

export default AdminPanel;
