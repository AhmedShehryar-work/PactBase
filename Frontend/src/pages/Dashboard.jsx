import { useState } from "react";
import { motion } from "motion/react";
import { FiUser, FiBell, FiPlusCircle, FiSearch, FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { usePactStore } from "../stores/usePactStore";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("myPacts"); // Default tab changed
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    { id: "searchPact", label: "Search Pacts", icon: <FiSearch size={24} /> },
    { id: "makePact", label: "Make Pact", icon: <FiPlusCircle size={28} /> },
    { id: "myPacts", label: "My Pacts", icon: <FiFileText size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col relative">
      {/* ======= TOP HEADER ======= */}
      <header className="bg-white shadow-md h-20 flex items-center justify-between px-6 relative">
        <button
          className="text-[#0b0a1f] hover:text-gray-700 transition"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <FiBell size={28} />
        </button>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0b0a1f]">
          PactBase
        </h1>

        <button
          className="text-[#0b0a1f] hover:text-gray-700 transition"
          onClick={() => navigate("/profile")}
        >
          <FiUser size={28} />
        </button>

        {/* Notifications Sidebar */}
        {showNotifications && (
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute top-20 left-0 w-80 h-[calc(100vh-5rem)] bg-white shadow-xl border-r border-gray-200 p-4 z-50 rounded-r-xl overflow-y-auto"
          >
            <h2 className="text-xl font-semibold text-[#0b0a1f] mb-4">Notifications</h2>
            <ul className="space-y-3">
              <li className="bg-gray-100 p-3 rounded-lg">🔔 New pact request from John</li>
              <li className="bg-gray-100 p-3 rounded-lg">🔔 Pact "Lease Agreement" approved</li>
              <li className="bg-gray-100 p-3 rounded-lg">🔔 Reminder: Review your pact</li>
            </ul>
          </motion.div>
        )}
      </header>

      {/* ======= MAIN CONTENT ======= */}
      <main className="flex-1 p-6 pb-24">
          {activeTab === "makePact" && (
            <>
              <h2 className="text-2xl font-bold text-[#0b0a1f] mb-4">
                Create a New Pact
              </h2>
              <p className="text-gray-700">
                Fill in the details to securely create a new pact.
              </p>
            </>
          )}

          {activeTab === "searchPact" && <PactSearch/>}

          {activeTab === "myPacts" && (
            <>
              <h2 className="text-2xl font-bold text-[#0b0a1f] mb-4">
                My Pacts
              </h2>
              <p className="text-gray-700">
                View all pacts you have created or participated in.
              </p>
            </>
          )}
      </main>

      {/* ======= BOTTOM NAVIGATION ======= */}
      <nav className="bg-white border-t-4 border-[#0b0a1f] flex h-16">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200
              ${
                activeTab === tab.id
                  ? "bg-[#0b0a1f] text-white font-semibold"
                  : "text-[#0b0a1f] hover:bg-gray-100"
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span className="mt-1 text-sm">{tab.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}

function PactSearch() {
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
    <div className="flex flex-col items-center justify-start p-6 font-sans">
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-[#0b0a1f] mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Enter Pact ID
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
