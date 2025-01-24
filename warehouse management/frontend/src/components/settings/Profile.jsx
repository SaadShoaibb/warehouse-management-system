import { useState, useEffect } from "react";
import axios from "axios";
import { User } from "lucide-react";
import SettingSection from "./SettingSection";

const Profile = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    profilePicture: "https://randomuser.me/api/portraits/men/3.jpg", // Default profile picture
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  useEffect(() => {
    // Fetch user profile data
    axios.get("/api/settings").then((res) => {
      setProfile(res.data);
    });
  }, []);

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append("username", profile.username);
    formData.append("email", profile.email);
    if (newProfilePicture) {
      formData.append("profilePicture", newProfilePicture);
    }

    try {
      const response = await axios.put("/api/settings/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProfile(response.data);
      setIsEditing(false);
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <SettingSection icon={User} title={"Profile"}>
      <div className="flex flex-col sm:flex-row items-center mb-6">
        <img
          src={
            newProfilePicture
              ? URL.createObjectURL(newProfilePicture)
              : profile.profilePicture
          }
          alt="Profile"
          className="rounded-full w-20 h-20 object-cover mr-4"
        />

        {isEditing ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              className="p-2 bg-gray-800 rounded text-gray-100"
              placeholder="Username"
            />
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="p-2 bg-gray-800 rounded text-gray-100"
              placeholder="Email"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewProfilePicture(e.target.files[0])}
              className="text-gray-400"
            />
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-100">{profile.username}</h3>
            <p className="text-gray-400">{profile.email}</p>
          </div>
        )}
      </div>

      <button
        className={`${
          isEditing ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"
        } text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto`}
        onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
      >
        {isEditing ? "Save Changes" : "Edit Profile"}
      </button>
      {isEditing && (
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto mt-4"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </button>
      )}
    </SettingSection>
  );
};

export default Profile;
