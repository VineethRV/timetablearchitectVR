import { Layout, Card, Row, Col } from "antd";
import { TbLayoutDashboard } from "react-icons/tb";
import { FiBarChart2 } from "react-icons/fi";
import CapacityCard from "../../components/AdminPanelComp/CapacityCard";
import RequestAccessWrapper from "../../components/AdminPanelComp/RequestAccessWrap";
import { GridDisplay } from "../../components/TopComponents/GridDisplay";
const { Header, Content } = Layout;

const stats = [
  { title: "Sections formed", number: 54 },
  { title: "Core courses allocated", number: 12 },
  { title: "Allotted labs", number: 84 },
];

const sampleTeachers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    department: "Computer Science"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    department: "Mathematics"
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.j@example.com",
    department: "Physics"
  },
  {
    id: 4,
    name: "Robert Johnson",
    email: "robert.j@example.com",
    department: "Physics"
  },
  {
    id: 5,
    name: "Robert Johnson",
    email: "robert.j@example.com",
    department: "Physics"
  },
  {
    id: 6,
    name: "Robert Johnson",
    email: "robert.j@example.com",
    department: "Physics"
  }
];

const sampleRooms = [
  {
    id: 1,
    name: "Room 101",
    department: "Computer Science",
    lab: true
  },
  {
    id: 2,
    name: "Room 202",
    department: "Physics",
    lab: false
  },
  {
    id: 3,
    name: "Room 303",
    department: "Mathematics",
    lab: true
  }
];

const AdminPanel = () => {
  // loading component must be added

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
        <RequestAccessWrapper />
        <GridDisplay teachers={sampleTeachers} rooms={sampleRooms} />
      </Content>
    </Layout>
  );
};

export default AdminPanel;
