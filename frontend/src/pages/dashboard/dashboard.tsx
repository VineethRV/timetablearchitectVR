import { Outlet, useNavigate } from "react-router-dom"; // For rendering nested routes
import DashboardSidebar from "../../components/Navbar/SideNavbars/DashboardSidebar.tsx"; // Sidebar component
import axios from "axios";
import { BACKEND_URL } from "../../../config.ts";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/Loading/Loading.tsx";

const DashboardWithSidebar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .post(
        BACKEND_URL + "/checkAuthentication",
        {},
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        const status = res.data.status;
        
        if (status != 200) {
          navigate("/signin");
          toast.error("User not authenticated !!");
        } else {
          axios
            .get(BACKEND_URL + "/user/check_org", {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            })
            .then(({ data }) => {
              
              if (!data.result) {
                navigate("/onboard");
                toast.info("Please complete onboarding process");
              }

              setLoading(false);
            });
        }
      });
  }, []);

  if (loading) <Loading />;

  return (
    <div className="flex h-screen">
      <div className="w-[9vh]">
        <DashboardSidebar />
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardWithSidebar;
