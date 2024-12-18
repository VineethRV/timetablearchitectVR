import { Link } from "react-router-dom";
import Logo from "/Logo.png";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Topbar = () => {
  const navigate = useNavigate();

  function logoutHandle() {
    localStorage.removeItem("token");
    navigate("/signin");
    toast.success("Logged out successfully !!");
  }

  return (
    <div className="flex justify-between w-full h-fit">
      <Link to="/">
        <div className="flex items-center cursor-pointer space-x-2">
          <img className="h-8 w-8" src={Logo} alt="Logo" />
          <h1 className="font-bold text-base">TTA</h1>
        </div>
      </Link>
      <Button onClick={logoutHandle}>Logout</Button>
    </div>
  );
};

export default Topbar;
