import { Link } from "react-router-dom";
import Logo from "/Logo.png";

const Topbar = () => {
  return (
    <div className="flex justify-between w-full h-fit">
      <Link to="/signin">
        <div className="flex items-center cursor-pointer space-x-2">
          <img className="h-8 w-8" src={Logo} alt="Logo" />
          <h1 className="font-bold text-base">TTA</h1>
        </div>
      </Link>
      <div className={`flex items-center text-sm`}>
        <p>
          Already have an account ?{" "}
          <Link to="/signin">
            <span className="text-[#636AE8FF] underline hover:cursor-pointer">
              Sign in
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Topbar;
