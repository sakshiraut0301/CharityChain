import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-700"
          >
            TrustChain
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              About
            </Link>

            <Link
              to="/organizations"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Organizations
            </Link>

            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Contact
            </Link>
          </div>

          {/* Right Buttons */}
          <div className="hidden md:flex items-center space-x-4">

            <Link
              to="/login"
              className="text-blue-600 font-medium hover:text-blue-800"
            >
              Login
            </Link>

            <Link
              to="/register-ngo"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Register NGO
            </Link>

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;