import { Card, Typography } from "antd";
import AccessTable from "../../components/AccessPage/AccessTable";

const { Title } = Typography;

const RequestAccessWrapper = () => {
  return (
    <div className="pb-4">
      <Card
        className="rounded-lg mt-6 shadow-sm py-1"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E6E6FA" }}
      >
        <Title level={3} className="text-gray-700">
          Access Requests
        </Title>
        <p className="text-gray-500">
          Below is a list of users requesting access. Review and take
          appropriate action.
        </p>
        <AccessTable />
      </Card>
    </div>
  );
};

export default RequestAccessWrapper;
