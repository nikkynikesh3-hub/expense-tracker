import { Link, useLocation } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { BsFileBarGraph } from "react-icons/bs";

import "./index.css";

const Navbar = () => {
  const location = useLocation();
  console.log(location);
  const highlightHome = location.pathname === "/" ? "active-link" : "";
  const highlightReports =
    location.pathname === "/reports" ? "active-link" : "";
  return (
    <nav className="nav-container fixed bottom-0 left-0 w-full z-50 bg-white">
      <Link className={`nav-link ${highlightHome}`} to="/">
        <AiOutlineHome className="nav-icon" />
        <p className="nav-link-text">Home</p>
      </Link>
      <Link className={`nav-link ${highlightReports}`} to="/reports">
        <BsFileBarGraph className="nav-icon" />
        <p className="nav-link-text">Reports</p>
      </Link>
    </nav>
  );
};

export default Navbar;
