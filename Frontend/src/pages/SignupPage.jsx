import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function RegistrationForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    profileImage: null,
    cnicNo: "",
    cnicFront: null,
    cnicBack: null,
    image1: null,
    image2: null,
    image3: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/signup",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Server response:", res.data);
      navigate("/login");
    } catch (error) {
      console.error("Error uploading:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Brand */}
      <motion.h1
        className="text-4xl sm:text-5xl font-extrabold text-[#0b0a1f] mb-8 tracking-tight"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        PactBase
      </motion.h1>

      {/* Card */}
      <motion.div
        className="bg-white w-full max-w-3xl p-8 sm:p-10 rounded-2xl shadow-2xl"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-2xl font-semibold text-center text-[#0b0a1f] mb-6">
          Create Account
        </h2>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-8"
        >
          {/* BASIC INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Full Name"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
            />
            <Input
              label="Username"
              name="username"
              placeholder="johndoe123"
              value={formData.username}
              onChange={handleChange}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* CNIC BLOCK */}
          <div className="border-2 border-dashed border-[#0a063d] rounded-xl p-6 space-y-5">
            <h3 className="text-lg font-semibold text-[#0b0a1f] text-center">
              CNIC Verification
            </h3>

            <Input
              label="CNIC Number"
              name="cnicNo"
              placeholder="35202-1234567-1"
              value={formData.cnicNo}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <CnicImage
                label="CNIC Front Image"
                name="cnicFront"
                onChange={handleChange}
              />
              <CnicImage
                label="CNIC Back Image"
                name="cnicBack"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* TEST IMAGES */}
          <div className="border-t">
            <h3 className="text-lg font-semibold text-center mb-6">
              Test Images
            </h3>

            <div className="grid sm:grid-cols-3 gap-6">
              <TestImage name="image1" onChange={handleChange}/>
              <TestImage name="image2" onChange={handleChange}/>
              <TestImage name="image3" onChange={handleChange}/>
            </div>
          </div>

          {/* SUBMIT */}
          <motion.button
            type="submit"
            className="w-full mt-6 px-6 py-3 rounded-lg bg-[#0b0a1f] text-white font-semibold hover:bg-[#111024] transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Register
          </motion.button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <span
            className="underline cursor-pointer text-[#0a063d]"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
}

/* ---------- UI Components ---------- */

function Input({ label, name, value, onChange, type = "text", placeholder }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required
        className="px-4 py-3 rounded-lg border-2 border-[#0a063d] focus:border-[#0b0a1f] outline-none"
      />
    </div>
  );
}

function CnicImage({ label, name, onChange }) {
  const [fileName, setFileName] = useState("No file chosen");

  const handleFileChange = (e) => {
    onChange?.(e);
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("No file chosen");
    }
  };
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-gray-700">{label}</label>
      <div className="cursor-pointer px-3 py-2 rounded-lg border-2 border-[#0a063d] file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-[#0b0a1f] file:text-white">
        <label
        htmlFor={name}
        className="cursor-pointer inline-block w-fit px-4 py-2 rounded-md bg-[#0b0a1f] text-white text-sm font-semibold"
      >
        Choose file
      </label>

      {/* Hidden Input */}
      <input
        id={name}
        type="file"
        name={name}
        accept="image/jpeg, image/png, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <span className="ml-4 text-2xs text-black-500">{fileName}</span>
      </div>
    </div>
  );
}

function TestImage({name, onChange}) {
  const [fileName, setFileName] = useState("No file chosen");

  const handleFileChange = (e) => {
    onChange?.(e);
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("No file chosen");
    }
  };

  return (
    <div className="flex flex-col items-center border-2 border-[#0a063d] rounded-lg p-3">
      {/* Label will implement later */}
      <span className="underline cursor-pointer text-black-800 mb-2">Action</span>

      {/* Choose File Button */}
      <label
        htmlFor={name}
        className="cursor-pointer inline-block w-fit px-4 py-2 rounded-md bg-[#0b0a1f] text-white text-sm font-semibold"
      >
        Choose file
      </label>

      {/* Hidden Input */}
      <input
        id={name}
        type="file"
        name={name}
        accept="image/jpeg, image/png, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Filename below */}
      <span className="mt-2 text-2xs text-black-500">{fileName}</span>
    </div>
  );
}


