import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import ClassSidebar from "../../../components/Navbar/SideNavbars/ClassSidebar";
import { Modal, Select, Button, Typography } from "antd";

const { Option } = Select;
const { Text } = Typography;

const Section = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<null | string>(null);

  useEffect(() => {
    const semester = localStorage.getItem("semester");
    if (semester) {
      setSelectedSemester(semester); // Set the semester if already in localStorage
    } else {
      setIsModalVisible(true); // Show modal if semester is not set
    }
  }, []);

  const handleSemesterChange = (value: string) => {
    setSelectedSemester(value); // Update the selected semester
  };

  const handleConfirm = () => {
    if (selectedSemester) {
      localStorage.setItem("semester", selectedSemester); // Save semester to localStorage
      setIsModalVisible(false); // Close the modal
    } else {
      alert("Please select a semester!"); // Notify the user to select a semester
    }
  };

  return (
    <div className="flex h-screen">
      {/* Render Sidebar and Outlet only after semester is confirmed */}
      {!isModalVisible && (
        <>
          <div>
            <ClassSidebar />
          </div>
          <div className="w-full">
            <Outlet />
          </div>
        </>
      )}

      {/* Modal for Semester Selection */}
      <Modal
        visible={isModalVisible}
        closable={false}
        footer={[
          <Button
            key="confirm"
            type="primary"
            onClick={handleConfirm}
            style={{ width: "100%" }}
            disabled={!selectedSemester} // Disable button if no semester selected
          >
            Confirm
          </Button>,
        ]}
        centered
      >
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <Text strong>Please select your semester to continue:</Text>
        </div>
        <Select
          placeholder="Select a semester"
          style={{ width: "100%" }}
          onChange={handleSemesterChange}
          value={selectedSemester}
        >
          {Array.from({ length: 8 }, (_, index) => (
            <Option key={index + 1} value={`${index + 1}`}>
              Semester {index + 1}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default Section;
