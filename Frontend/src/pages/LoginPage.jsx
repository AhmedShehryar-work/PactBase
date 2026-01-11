import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function LoginPage() {
  const navigate = useNavigate();

  const { login, isLoggingIn, loginError, clearLoginError, loginSuccess } =
    useAuthStore();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    clearLoginError();
    e.preventDefault();
    await login(formData);
    if (loginSuccess) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Brand Header */}
      <motion.h1 className="text-4xl sm:text-5xl font-extrabold text-[#0b0a1f] mb-8 font-sans tracking-tight"
        initial={{ opacity: 0, y: +7 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .8 }}
      >
        PactBase
      </motion.h1>

      {/* Login Card */}
      <motion.div
        className="bg-white w-full max-w-md p-10 rounded-2xl shadow-2xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-semibold text-center text-[#0b0a1f] mb-6">
          Welcome Back
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700">Username</label>
            <input
              type="text"
              placeholder="Username"
              className="px-4 py-3 rounded-lg border-2 border-[#0a063d] focus:border-[#0b0a1f] outline-none"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>

          <div className="flex flex-col mt-2">
            <label className="mb-1 text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="px-4 py-3 rounded-lg border-2 border-[#0a063d] focus:border-[#0b0a1f] outline-none"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          {loginError && (
            <p className="text-red-500 mt-2 text-sm">{loginError}</p>
          )}

          <motion.button
            type="submit"
            className="mt-4 px-6 py-3 rounded-lg bg-[#0b0a1f] text-white font-semibold hover:bg-[#111024] active:bg-[#0c0c1a] transition"
            whileHover={{ scale: 1.02}}
            whileTap={{ scale: 0.98}}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{" "}
          <span
            className="underline cursor-pointer text-[#0a063d]"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </motion.div>
    </div>
  );
}
