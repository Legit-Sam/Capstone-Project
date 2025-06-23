import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";
import { useNavigate  } from 'react-router-dom';

const skillsList = [
  "UI/UX Design", "Product Management", "Frontend Development", "Backend Development",
  "Marketing", "Data Analysis", "Mobile Development", "DevOps"
];

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    bio: "",
    skills: [],
    goals: "",
    industry: ""
  });

  const handleSkillToggle = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.name || !form.bio || !form.goals || form.skills.length === 0) {
    return toast.error("All required fields must be filled.");
  }

  try {
    const res = await axios.put("/users/me/profile", form);
    toast.success("Profile updated successfully!");
    console.log("✅ Updated profile:", res.data);
     setTimeout(() => {
      navigate("/login");
    }, 800);
  } catch (err) {
    const msg = err?.response?.data?.error || "Failed to update profile";
    toast.error(msg);
    console.error("❌ Profile update failed:", err);
  }
};


  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <textarea
          name="bio"
          placeholder="Short bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          rows={3}
          required
        />
        <div>
          <p className="mb-2 font-medium">Select Your Skills:</p>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill) => (
              <button
                type="button"
                key={skill}
                className={`px-3 py-1 rounded-full border ${
                  form.skills.includes(skill)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleSkillToggle(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
        <input
          type="text"
          name="goals"
          placeholder="Your goal (e.g., Improve product design)"
          value={form.goals}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          type="text"
          name="industry"
          placeholder="Your Industry (Optional)"
          value={form.industry}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
