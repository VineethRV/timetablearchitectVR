import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div>
      <h1>Landing Page</h1>
      <Link to="/signin">
        <button>signin page</button>
      </Link>
    </div>
  );
};

export default LandingPage;
