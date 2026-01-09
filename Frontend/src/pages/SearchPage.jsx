import { useState } from "react";
import { usePactStore } from "../stores/usePactStore";
import { motion } from "motion/react";

export default function SearchPage() {
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
        Pact Search
      </motion.h2>

      <motion.div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md flex flex-col gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Input + Button */}
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter pact name..."
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

        {/* Results */}
        {searchedPact && (
          <motion.div
            className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="font-semibold text-green-700 mb-2">✅ Search Result</h3>
            <p className="text-gray-800">
              {typeof searchedPact === "string"
                ? searchedPact
                : JSON.stringify(searchedPact, null, 2)}
            </p>
          </motion.div>
        )}

        {searchedPact === null && !isSearchingPact && query && (
          <motion.div
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ❌ No pact found!
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
