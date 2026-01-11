import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiUser, FiBell, FiPlusCircle, FiSearch, FiFileText, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { usePactStore } from "../stores/usePactStore";

import MakePactForm from "./MakePactPage";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("myPacts"); // Default tab changed
  const [showNotifications, setShowNotifications] = useState(false);
  const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);
  const navigate = useNavigate();

  const tabs = [
    { id: "searchPact", label: "Search Pacts", icon: <FiSearch size={24} /> },
    { id: "makePact", label: "Make Pact", icon: <FiPlusCircle size={28} /> },
    { id: "myPacts", label: "My Pacts", icon: <FiFileText size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col relative">
      {/* ======= TOP HEADER ======= */}
      <header className="sticky top-0 bg-white shadow-md h-20 flex items-center justify-between px-6 relative">
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
        <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
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
      </AnimatePresence>
      </header>

      {/* ======= MAIN CONTENT ======= */}
      <main className="flex-1 p-6 pb-24">
          {activeTab === "makePact" && <MakePactForm/>}

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
      
      <button
        onClick={() => setIsBottomBarVisible((prev) => !prev)}
        className="fixed bottom-20 right-4 z-50 bg-[#0b0a1f] text-white p-2 rounded-full shadow-lg hover:bg-[#111024] transition"
      >
        {isBottomBarVisible ? <FiChevronDown size={20} /> : <FiChevronUp size={20} />}
      </button>

      {/* ======= BOTTOM NAVIGATION ======= */}
      <AnimatePresence>
        {isBottomBarVisible && (
          <motion.nav
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#0b0a1f] flex h-16 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.08)]"
          >
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
          </motion.nav>
        )}
      </AnimatePresence>

    </div>
  );
}

function PactSearch() {

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
    <div className="flex flex-col items-center justify-start p-6 font-sans">

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
