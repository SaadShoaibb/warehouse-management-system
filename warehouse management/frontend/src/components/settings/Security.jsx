import { useState, useEffect } from "react";
import axios from "axios";
import SettingSection from "./SettingSection";
import ToggleSwitch from "./ToggleSwitch";
import { Lock } from "lucide-react";

const Security = () => {
  const [twoFactor, setTwoFactor] = useState(false);

  useEffect(() => {
    axios.get("/api/settings").then((res) => setTwoFactor(res.data.twoFactor || false));
  }, []);

  const toggleTwoFactor = () => {
    const updated = !twoFactor;
    setTwoFactor(updated);
    axios.put("/api/settings/security", { twoFactor: updated });
  };

  return (
    <SettingSection icon={Lock} title="Security">
      <ToggleSwitch
        label="Two-Factor Authentication"
        isOn={twoFactor}
        onToggle={toggleTwoFactor}
      />
      <div className="mt-4">
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          onClick={() => alert("Redirect to Change Password flow")}
        >
          Change Password
        </button>
      </div>
    </SettingSection>
  );
};

export default Security;
