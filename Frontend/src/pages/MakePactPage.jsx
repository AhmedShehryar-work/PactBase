import { useState } from "react";
import { useEffect } from "react";
import { motion } from "motion/react";
import { usePactStore } from "../stores/usePactStore";
import { useAuthStore } from "../stores/useAuthStore";

export default function MakePactForm() {
  const { isMakingPact, makePact, madePactId, isBlocked } = usePactStore();
  const { authUser } = useAuthStore();

  const [title, setTitle] = useState("");
  const [conditions, setConditions] = useState("");
  const [toUsers, setToUsers] = useState([]);
  const [toInput, setToInput] = useState("");

  useEffect(() => {
    if (madePactId) {
      navigator.clipboard.writeText(madePactId)
        .then(() => console.log("Pact ID copied to clipboard"))
        .catch((err) => console.error("Failed to copy Pact ID:", err));
    }
  }, [madePactId]);

  const handleAddTo = () => {
    const cleaned = toInput.toLowerCase().replace(/\s+/g, "");
    if (cleaned && !toUsers.includes(cleaned)) {
      setToUsers([...toUsers, cleaned]);
      setToInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || toUsers.length === 0) {
      alert("Title and at least one 'To' user are required!");
      return;
    }

    try {
      await makePact({
        title,
        conditions,
        from: authUser.username,
        to: toUsers.map(u => u.toLowerCase()),
      });

      if (!isBlocked) {
        setTitle("");
        setConditions("");
        setToUsers([]);
      }
    } catch (err) {
      alert("Failed to create pact: " + err);
    }
  };

  return (
    <div className="flex justify-center p-6">
      <motion.div
        className="bg-white w-full max-w-xl p-10 rounded-2xl shadow-2xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-extrabold text-[#0b0a1f] text-center mb-2">
          Make a Pact
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Create a secure agreement between parties.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <input
            type="text"
            placeholder="Pact Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-3 rounded-lg border-2 border-[#0a063d] focus:border-[#0b0a1f] outline-none"
            required
          />

          {/* Conditions */}
          <textarea
            placeholder="Conditions (optional).
            Instructions:
            - Be as specific, thorough and detailed as possible.
            - You can tag users as such @<username>"
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            rows={5}
            className="px-4 py-3 rounded-lg border-2 border-[#0a063d] focus:border-[#0b0a1f] outline-none resize-none"
          />

          {/* From */}
          <input
            type="text"
            value={`From: ${authUser.username}`}
            readOnly
            className="px-4 py-3 rounded-lg bg-gray-100 text-gray-600"
          />

          {/* To */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add recipient username"
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border-2 border-[#0a063d] focus:border-[#0b0a1f] outline-none"
            />
            <button
              type="button"
              onClick={handleAddTo}
              className="px-4 py-3 rounded-lg bg-[#0b0a1f] text-white font-semibold hover:bg-[#111024]"
            >
              Add
            </button>
          </div>

          {/* To Users */}
          {toUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {toUsers.map((user, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                >
                  {user}
                </span>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={isMakingPact}
            className={`mt-4 px-6 py-3 rounded-lg text-white font-semibold transition
              ${
                isMakingPact
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0b0a1f] hover:bg-[#111024]"
              }`}
          >
            {isMakingPact ? "Creating..." : "Create Pact"}
          </button>

          {madePactId && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <p className="text-green-600 font-medium">
                Pact created! ID: {madePactId}
              </p>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(madePactId)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                title="Copy Pact ID"
              >
                Copy
              </button>
            </div>
          )
          }

          {isBlocked && (
            <p className="text-red-600 text-center font-medium">
              You are blocked by one or more recipients.
            </p>
          )}

          

        </form>
      </motion.div>
    </div>
  );
}
