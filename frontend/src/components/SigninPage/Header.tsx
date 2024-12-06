import Logo from "/Logo.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Link to="/">
      <div className="flex w-fit space-x-2 px-4 py-4 items-center cursor-pointer">
        <img src={Logo} alt="Logo" className="h-8 w-8" />
        <h1 className="font-bold text-base">TTA</h1>
      </div>
    </Link>
  );
};

export default Header;
