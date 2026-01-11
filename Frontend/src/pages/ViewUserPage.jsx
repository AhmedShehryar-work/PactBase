import { useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { FiArrowLeft } from "react-icons/fi";

export default function UserPage() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");
  const navigate = useNavigate();

  const { getUser, userData, isLoadingUser, error } = useUserStore();

  useEffect(() => {
    if (username) getUser(username);
  }, [username, getUser]);

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-[#0b0a1f] text-xl font-semibold">Loading user...</p>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-red-600 text-xl font-semibold">{error || "User not found!"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="self-start mb-6 flex items-center gap-2 text-[#0b0a1f] font-semibold hover:text-gray-700 transition"
        >
          <FiArrowLeft size={20} /> Back
        </button>

        {/* Profile Image */}
        <div className="mb-6">
          <img
            src={userData.profile_image !== "none" ? userData.profile_image : "/default-avatar.png"}
            alt={userData.username}
            className="w-32 h-32 rounded-full border-4 border-[#0b0a1f] object-cover"
          />
        </div>

        {/* Username */}
        <h1 className="text-4xl font-bold text-[#0b0a1f] mb-2">@{userData.username}</h1>

        {/* Full Name */}
        <p className="text-xl text-gray-700 mb-4">{userData.full_name}</p>

        {/* Rating & Pacts Fulfilled */}
        <div className="flex flex-col items-center justify-center my-8">
          <p className="text-gray-500 text-lg mb-2">Rating</p>
          <div className="flex items-center gap-1">
            {(() => {
              const rating = Number(userData.rating) || 0;
              const fullStars = Math.floor(rating);
              const hasHalfStar = rating - fullStars >= 0.5;
              const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

              const stars = [];

              for (let i = 0; i < fullStars; i++) {
                stars.push(<span key={`full-${i}`} className="text-yellow-500 text-4xl">★</span>);
              }
              if (hasHalfStar) {
                stars.push(<span key="half" className="text-yellow-500 text-4xl">⯨</span>);
              }
              for (let i = 0; i < emptyStars; i++) {
                stars.push(<span key={`empty-${i}`} className="text-gray-300 text-4xl">★</span>);
              }

              return stars;
            })()}
          </div>
          <p className="text-[#0b0a1f] font-bold text-2xl mt-2">{Number(userData.rating).toFixed(2)}</p>
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm">Pacts Fulfilled</p>
          <p className="text-[#0b0a1f] font-semibold">{userData.pacts_fulfilled}</p>
        </div>

        {/* Account Created */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 w-full text-center mt-6">
          <p className="text-gray-500 text-sm mb-1">Member Since</p>
          <p className="text-[#0b0a1f] font-medium">
            {new Date(userData.created_at).toLocaleDateString()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
