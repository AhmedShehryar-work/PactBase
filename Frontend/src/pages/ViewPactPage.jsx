import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { FiArrowLeft } from "react-icons/fi";

import { useAuthStore } from "../stores/useAuthStore";
import { usePactStore } from "../stores/usePactStore";

export default function ViewPactPage() {
  const { authUser } = useAuthStore();
  const [searchParams] = useSearchParams();
  const pactId = searchParams.get("id"); 
  const { searchPact, searchedPact, isSearchingPact, fulfillPact} = usePactStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (pactId) searchPact(pactId);
  }, [pactId, searchPact]);

  const handleFulfill = async () => {
    try {
      await fulfillPact(pact.id); // call the store function
      await searchPact(pact.id);          // refresh pact data to update UI
    } catch (err) {
      alert("Failed to mark as fulfilled: " + err);
    }
  };

  if (isSearchingPact) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-[#0b0a1f] text-xl font-semibold">Loading pact...</p>
      </div>
    );
  }

  if (!searchedPact?.pact) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-red-600 text-xl font-semibold">Pact not found!</p>
      </div>
    );
  }

  const pact = searchedPact.pact;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-[#0b0a1f] font-semibold hover:text-gray-700 transition"
        >
          <FiArrowLeft size={20} /> Back
        </button>

        {/* Title */}
        <h1
          className="text-5xl font-black text-center text-[#0b0a1f] mb-6"
          style={{ fontFamily: "'Old English Text MT', serif" }}
        >
          {pact.title}
        </h1>

        {/* Status Badge */}
        <div className="flex justify-center mb-6">
          <span
            className={`inline-block px-4 py-1 text-sm rounded-full font-semibold
              ${pact.status === "awaiting" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}
          >
            {pact.status.toUpperCase()}
          </span>
        </div>

        {/* Conditions Box */}
        {pact.conditions && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <h2 className="font-semibold text-[#0b0a1f] mb-2">Conditions</h2>
            <p className="text-gray-700 line-clamp-3">
              {pact.conditions.split(/(\s+)/).map((word, idx) => {
                if (word.startsWith("@")) {
                  const username = word.slice(1); // remove the '@'
                  return (
                    <span
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user?username=${username}`);
                      }}
                      className="text-[#01572a] hover:text-[#013319] transition-colors duration-200 cursor-pointer"
                    >
                      {word}
                    </span>
                  );
                }
                return word; // normal text
              })}
            </p>
          </div>
        )}


        {/* From & To */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <p className="text-[#0b0a1f] font-medium">
            From:{" "}
            <span
              onClick={() => navigate(`/user?username=${pact.from}`)}
              className="text-[#01572a] hover:text-[#013319] transition-colors duration-200 cursor-pointer"
            >
              @{pact.from}
            </span>
          </p>

          <p className="text-[#0b0a1f] font-medium">
            To:{" "}
            {pact.to.map((user, i) => (
              <span
                key={user}
                onClick={() => navigate(`/user?username=${user}`)}
                className="text-[#01572a] hover:text-[#013319] transition-colors duration-200 cursor-pointer"
              >
                @{user}
                {i < pact.to.length - 1 && ", "}
              </span>
            ))}
          </p>
        </div>

        {/* Meta Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600 text-sm">
          <p>
            <span className="font-semibold text-[#0b0a1f]">Created:</span>{" "}
            {new Date(pact.created_at).toLocaleString()}
          </p>
          {pact.status == "fulfilled" && (
            <p>
              <span className="font-semibold text-[#0b0a1f]">Fulfilled:</span>{" "}
              {new Date(pact.updated_at).toLocaleString()}
            </p>
            )
          }
          <p>
            <span className="font-semibold text-[#0b0a1f]">Requested:</span>{" "}
            {pact.requested ? "Yes" : "No"}
          </p>
          <p>
            <span className="font-semibold text-[#0b0a1f]">Pact ID:</span>{" "}
            <span className="font-mono bg-[#e3e3e3] px-2 py-1 rounded">{pact.id}</span>
          </p>
        </div>

        {pact.status !== "fulfilled" && authUser.username === pact.from && (
          <div className="flex justify-center mt-20">
            <button
              onClick={() => fulfillPact(pact.id)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Mark as Fulfilled
            </button>
          </div>
        )}
        
      </motion.div>
    </div>
  );
}
