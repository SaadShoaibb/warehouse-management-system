import { useState } from "react";
import { User } from "lucide-react"; // Import the User icon from lucide-react
import { useNavigate } from "react-router-dom";

const Header = ({ title }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Handle user icon click to toggle the dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle logout
  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/signin");
  };

  return (
    <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>

        {/* User Icon (Profile) with Dropdown */}
        <div className="relative">
          <button onClick={toggleDropdown} className="text-gray-100 hover:text-gray-300">
            <User className="h-8 w-8 hover:-translate-y-2 hover:duration-700 hover:ease-in-out hover:transition" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-[-80px] transition duration-500 ease-in-out w-48 z-50 bg-red-700 text-gray-100 rounded-lg shadow-lg">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-500 hover:transition-all hover:duration-300 rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
