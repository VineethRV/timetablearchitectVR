import { Card, Typography } from "antd";
import AccessTable from "../../components/AccessPage/AccessTable";

const { Title } = Typography;

const RequestAccessWrapper = ({accessCode}:any) => {
  return (
    <div className="pb-4">
      <Card
        className="rounded-lg mt-6 shadow-sm py-1"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E6E6FA" }}
      >
        <div className="flex items-start">
          <div className="flex flex-col">
            <Title level={2} className="text-gray-700">
              Access Requests
            </Title>
            <p className="text-gray-500">
              Below is a list of users requesting access. Review and take
              appropriate action.
            </p>
          </div>
          <div className="flex flex-col ml-48">
            <Title level={5} className="text-gray-700">
              Access Code:
            </Title>
            <input
              type="text"
              value={accessCode}
              disabled
              className="mt-1 px-4 py-2 bg-gray-200 text-gray-700 rounded border border-gray-300 cursor-text"
              title="Access Code"
            />
          </div>
        </div>
        <AccessTable />
      </Card>
    </div>
  );
};

export default RequestAccessWrapper;
