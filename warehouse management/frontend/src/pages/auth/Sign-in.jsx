import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/auth/login", formData)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        toast.success("Login successful!");
        navigate("/overview");
      })
      .catch(() => toast.error("Invalid credentials."));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 w-full text-gray-100 relative">
      <Toaster />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80 z-0"></div>
      <div className="relative z-10 bg-gray-800 p-12 rounded-lg shadow-xl w-full max-w-xl">
        <h2 className="text-4xl font-bold text-center mb-8">Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-300 mb-3">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-5 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-300 mb-3">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full px-5 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="w-full py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700">
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-gray-300">
          Don’t have an account? <Link to="/signup" className="text-blue-400 hover:underline">Sign Up now</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
