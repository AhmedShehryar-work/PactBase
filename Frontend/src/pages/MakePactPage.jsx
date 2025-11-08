import { useState } from "react";
import { usePactStore } from "../stores/usePactStore";
import { useAuthStore } from "../stores/useAuthStore";

export default function MakePactForm() {
  const { isMakingPact, makePact, madePactId, isBlocked } = usePactStore();
  const { authUser } = useAuthStore();

  const [title, setTitle] = useState("");
  const [conditions, setConditions] = useState("");
  const [toUsers, setToUsers] = useState([]); // array of usernames to send pact to
  const [toInput, setToInput] = useState("");

  const handleAddTo = () => {
    const cleaned = toInput.toLowerCase().replace(/\s+/g, ""); // lowercase & remove all spaces
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
      const toUsersLower = toUsers.map(user => user.toLowerCase());
      await makePact({
        title,
        conditions,
        from: authUser.username, // auto-filled
        to: toUsersLower,        // array of usernames
      });
      if(!isBlocked){
        setTitle("");
        setConditions("");
        setToUsers([]);
      }
    } catch (err) {
      alert("Failed to create pact: " + err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          width: "400px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Make a Pact</h2>

        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />

        {/* Conditions */}
        <textarea
          placeholder="Conditions (optional)"
          value={conditions}
          onChange={(e) => setConditions(e.target.value)}
          rows={6}
          style={{ padding: "10px", fontSize: "14px", resize: "vertical" }}
        />

        {/* From field (auto-filled & read-only) */}
        <input
          type="text"
          value={authUser.username}
          readOnly
          style={{
            padding: "10px",
            backgroundColor: "#f0f0f0",
            color: "#555",
          }}
        />

        {/* To field */}
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Add 'To' user"
            value={toInput}
            onChange={(e) => setToInput(e.target.value)}
            style={{ flex: 1, padding: "10px" }}
          />
          <button type="button" onClick={handleAddTo} style={{ padding: "10px" }}>
            Add
          </button>
        </div>

        {/* Display added 'To' users */}
        {toUsers.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {toUsers.map((user, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "#ddd",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontSize: "14px",
                }}
              >
                {user}
              </div>
            ))}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isMakingPact}
          style={{
            padding: "12px",
            backgroundColor: isMakingPact ? "gray" : "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isMakingPact ? "not-allowed" : "pointer",
          }}
        >
          {isMakingPact ? "Creating..." : "Create Pact"}
        </button>
      </form>
      {madePactId ? `Share and use this PactId for this Pact: ${madePactId}` : ""}
      {isBlocked && "You are blocked by one or more recipients"}
    </div>
  );
}
