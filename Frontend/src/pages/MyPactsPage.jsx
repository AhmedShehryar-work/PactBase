import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { usePactStore } from "../stores/usePactStore";

export default function MyPactsPage() {
  const navigate = useNavigate();
  const {
    getMyPacts,
    myPacts,
    isLoadingMyPacts,
    hasMoreMyPacts,
    resetMyPacts,
  } = usePactStore();

  const [tab, setTab] = useState("made"); // made | received
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const pageRef = useRef(1);
  const observerRef = useRef(null);

  // ------------------------------
  // Debounce search input
  // ------------------------------
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400); // 400ms delay
    return () => clearTimeout(handler);
  }, [search]);

  // ------------------------------
  // Fetch on tab change or debounced search
  // ------------------------------
  useEffect(() => {
    pageRef.current = 1;
    resetMyPacts();
    getMyPacts({ type: tab, search: debouncedSearch });
  }, [tab, debouncedSearch]);

  // ------------------------------
  // Infinite scroll
  // ------------------------------
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasMoreMyPacts &&
        !isLoadingMyPacts &&
        myPacts.length > 0
      ) {
        pageRef.current += 1;
        getMyPacts({ type: tab, search: debouncedSearch });
      }
    });

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMoreMyPacts, isLoadingMyPacts, tab, debouncedSearch]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Title */}
      <motion.h1
        className="text-center text-4xl font-black text-[#0b0a1f] mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        My Pacts
      </motion.h1>

      {/* Search */}
      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pacts..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0b0a1f]"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        {["made", "received"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 font-semibold transition
              ${
                tab === t
                  ? "border-b-2 border-[#0b0a1f] text-[#0b0a1f]"
                  : "text-gray-500 hover:text-[#0b0a1f]"
              }`}
          >
            {t === "made" ? "Pacts I Made" : "Requested To Me"}
          </button>
        ))}
      </div>

      {/* Pact List */}
      <div className="flex flex-col gap-3">
        {myPacts.map((pact) => (
          <motion.div
            key={pact.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.01 }}
            onClick={() => navigate(`/pact?id=${pact.id}`)}
            className="cursor-pointer bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-[#0b0a1f]">{pact.title}</h3>

              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  pact.status === "fulfilled"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {pact.status.toUpperCase()}
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              From{" "}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/user?username=${pact.from}`);
                }}
                className="text-[#01572a] hover:underline cursor-pointer"
              >
                @{pact.from}
              </span>{" "}
              • To{" "}
              {pact.to.map((u, i) => (
                <span
                  key={u}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/user?username=${u}`);
                  }}
                  className="text-[#01572a] hover:underline cursor-pointer"
                >
                  @{u}
                  {i < pact.to.length - 1 && ", "}
                </span>
              ))}
            </p>
          </motion.div>
        ))}

        {/* Loading / Sentinel */}
        <div ref={observerRef} className="h-10 flex justify-center items-center">
          {isLoadingMyPacts && (
            <p className="text-gray-500 text-sm">Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
