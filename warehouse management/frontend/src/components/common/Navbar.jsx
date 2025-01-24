import React, { useState } from "react";
import { User } from "lucide-react";  // User icon from lucide-react
import { useHistory } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const history = useHistory();  // For redirecting to login page after logout

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");  // Your logout endpoint
      localStorage.removeItem("authToken");  // Remove token from localStorage (if stored there)
      history.push("/login");  // Redirect to login page
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-indigo-600 text-white">
      {/* Other Navbar content */}

      {/* User Icon */}
      <div className="relative">
        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2">
          <User size={24} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md">
            <ul>
              <li>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
