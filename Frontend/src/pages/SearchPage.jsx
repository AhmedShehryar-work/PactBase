import { useState } from "react";
import { usePactStore } from "../stores/usePactStore";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {

  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const { isSearchingPact, searchedPact, searchPact } = usePactStore();

  const handleSearch = async () => {
    if (!query.trim()) {
      alert("Please enter something to search!");
      return;
    }

    try {
      await searchPact(query);
    } catch (err) {
      alert(`Something went wrong while searching! ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6 font-sans">
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-[#0b0a1f] mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        PactBase
      </motion.h2>

      <motion.div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl flex flex-col gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2
          className="text-3xl sm:text-4xl text-center font-bold text-[#0b0a1f] mb-6"
        >
          Search Pact
        </h2>

        {/* Input + Button */}
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Pact ID"
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#0b0a1f]"
          />
          <button
            onClick={handleSearch}
            disabled={isSearchingPact}
            className={`px-4 py-2 rounded-lg text-white font-semibold ${
              isSearchingPact ? "bg-gray-400 cursor-not-allowed" : "bg-[#0b0a1f] hover:bg-[#111024]"
            }`}
          >
            {isSearchingPact ? "Searching..." : "Search"}
          </button>
        </div>

        {searchedPact?.pact && (
          <motion.div
            onClick={() => navigate(`/pact?id=${searchedPact.pact.id}`)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 bg-white border border-gray-200 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition"

          > 

            {/* Status Badge */}
            <span
              className={`inline-block px-3 py-1 text-sm rounded-full font-semibold mb-4
                ${
                  searchedPact.pact.status === "awaiting"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
            >
              {searchedPact.pact.status.toUpperCase()}
            </span>

            {/* Title */}
            <h3 className="text-2xl font-bold text-[#0b0a1f] mb-2">
              {searchedPact.pact.title}
            </h3>

            {/* Conditions */}
            {searchedPact.pact.conditions && (
              <p className="text-gray-700 mb-4 line-clamp-3">
                <span className="font-semibold text-[#0b0a1f]">Conditions:</span>{" "}
                {searchedPact.pact.conditions}
              </p>
            )}

            {/* Meta Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <p>
                <span className="font-semibold text-[#0b0a1f]">From:</span>{" "}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/user?username=${searchedPact.pact.from}`);
                  }}
                  className="text-[#01572a] hover:text-[#013319] transition-colors duration-200 cursor-pointer"
                >
                  {"@" +searchedPact.pact.from}
                </span>
              </p>

              <p>
                <span className="font-semibold text-[#0b0a1f]">To:</span>{" "}
                {searchedPact.pact.to.map((user, i) => (
                  <span
                    key={user}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/user?username=${user}`);
                    }}
                    className="text-[#01572a] hover:text-[#013319] transition-colors duration-200 cursor-pointer"
                  >
                    {"@"+user}
                    {i < searchedPact.pact.to.length - 1 && ", "}
                  </span>
                ))}
              </p>

              <p>
                <span className="font-semibold text-[#0b0a1f]">Created:</span>{" "}
                {new Date(searchedPact.pact.created_at).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold text-[#0b0a1f]">Pact ID:</span>{" "}
                <span className="font-mono text-xs bg-[#e3e3e3]">
                  {searchedPact.pact.id}
                </span>
              </p>
            </div>
          </motion.div>
        )}

      </motion.div>

    </div>
  );
}
