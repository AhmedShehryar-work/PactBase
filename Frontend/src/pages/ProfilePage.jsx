import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { FiArrowLeft, FiLogOut, FiCamera, FiKey, FiMail } from "react-icons/fi";
import toast from "react-hot-toast";

import { useAuthStore } from "../stores/useAuthStore";
import { useProfileStore } from "../stores/useProfileStore";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { changeProfilePic, changePassword, verifyEmail } = useProfileStore();
  const fileInputRef = useRef(null);

  const [canChangeImage, setCanChangeImage] = useState(true);

  // Dummy user data
  const [userData, setUserData] = useState({
    username: "johndoe",
    full_name: "John Doe",
    email: "johndoe@example.com",
    email_verified: false,
    profile_image: "https://i.pravatar.cc/300",
    rating: 4.3,
    pacts_fulfilled: 12,
    created_at: "2022-03-15T12:00:00Z",
  });

  // Trigger file input click
  const handleChangeProfilePic = () => {
    if (!canChangeImage) {
      toast.error("You can only change your profile image once per day!");
      return;
    }
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      changeProfilePic(file); // call store function
      toast.success("Profile picture updated! You can change it again after 1 day.");
      setCanChangeImage(false);
      setTimeout(() => setCanChangeImage(true), 24 * 60 * 60 * 1000); // dummy frontend cooldown
    }
  };

  const handleChangePassword = () => {
    changePassword(); // call store function
  };

  const handleVerifyEmail = () => {
    verifyEmail(); // call store function
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Header with Back and Logout */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#0b0a1f] font-semibold hover:text-gray-700 transition"
        >
          <FiArrowLeft size={22} /> Back
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-400 transition"
        >
          <FiLogOut size={22} /> Logout
        </button>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center"
      >
        {/* Profile Image */}
        <div className="mb-6 relative">
          <img
            src={userData.profile_image}
            alt={userData.username}
            className="w-40 h-40 rounded-full border-4 border-[#0b0a1f] object-cover cursor-pointer"
            onClick={handleChangeProfilePic}
          />
          <button
            onClick={handleChangeProfilePic}
            className="absolute bottom-0 right-0 bg-[#0b0a1f] text-white p-2 rounded-full hover:bg-gray-800 transition"
          >
            <FiCamera size={20} />
          </button>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Username & Full Name */}
        <h1 className="text-5xl font-bold text-[#0b0a1f] mb-1">@{userData.username}</h1>
        <p className="text-2xl text-gray-700 mb-2">{userData.full_name}</p>

        {/* Email */}
        <p className="text-lg text-gray-500 mb-6 flex items-center gap-2">
          <FiMail /> {userData.email} 
          {!userData.email_verified && (
            <button
              onClick={handleVerifyEmail}
              className="ml-4 px-3 py-2 text-sm font-semibold text-white bg-[#0b0a1f] rounded-lg hover:bg-gray-800 transition"
            >
              Verify Email
            </button>
          )}
        </p>

        {/* Rating Section */}
        <div className="flex flex-col items-center justify-center my-6">
          <p className="text-gray-500 text-lg mb-2">Rating</p>
          <div className="flex items-center gap-1">
            {(() => {
              const rating = Number(userData.rating) || 0;
              const fullStars = Math.floor(rating);
              const hasHalfStar = rating - fullStars >= 0.5;
              const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

              const stars = [];
              for (let i = 0; i < fullStars; i++) stars.push(<span key={`full-${i}`} className="text-yellow-500 text-4xl">★</span>);
              if (hasHalfStar) stars.push(<span key="half" className="text-yellow-500 text-4xl">⯨</span>);
              for (let i = 0; i < emptyStars; i++) stars.push(<span key={`empty-${i}`} className="text-gray-300 text-4xl">★</span>);
              return stars;
            })()}
          </div>
          <p className="text-[#0b0a1f] font-bold text-2xl mt-2">{Number(userData.rating).toFixed(2)}</p>
        </div>

        {/* Pacts Fulfilled */}
        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm">Pacts Fulfilled</p>
          <p className="text-[#0b0a1f] font-semibold text-xl">{userData.pacts_fulfilled}</p>
        </div>

        {/* Account Creation */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 w-full text-center mt-4">
          <p className="text-gray-500 text-sm mb-1">Member Since</p>
          <p className="text-[#0b0a1f] font-medium">{new Date(userData.created_at).toLocaleDateString()}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 w-full mt-6">
          <button
            onClick={handleChangePassword}
            className="flex-1 bg-[#0b0a1f] text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            <FiKey size={20} /> Change Password
          </button>
        </div>
      </motion.div>
    </div>
  );
}