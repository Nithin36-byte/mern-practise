
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>Student Portal</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/services">Services</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/privacy">Privacy Policy</Link>
      </div>
    </nav>
  );
}

export default Navbar;
