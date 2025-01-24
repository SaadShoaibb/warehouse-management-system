import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/auth/register", formData)
      .then(() => toast.success("Sign-up successful! Please log in."))
      .catch(() => toast.error("Failed to sign up."));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 w-full text-gray-100">
      <Toaster />
      <div className="bg-gray-800 z-10 p-12 rounded-lg shadow-xl w-full max-w-xl">
        <h2 className="text-4xl font-bold text-center mb-8">Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-300 mb-3">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              className="w-full px-5 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-gray-300">
          Already have an account? <Link to="/signin" className="text-blue-400 hover:underline">Sign In now</Link>
        </p>
      </div>
    </div>
  );
};
export default SignUp;