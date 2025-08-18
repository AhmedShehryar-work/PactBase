import { useState } from "react";
import { usePactStore } from "../stores/usePactStore"

export default function PactSearch() {
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
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2>Pact Search</h2>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter pact name..."
        style={{
          padding: "8px",
          marginRight: "10px",
          border: "1px solid gray",
          borderRadius: "4px",
        }}
      />

      <button
        onClick={handleSearch}
        disabled={isSearchingPact}
        style={{
          padding: "8px 12px",
          backgroundColor: isSearchingPact ? "gray" : "blue",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isSearchingPact ? "not-allowed" : "pointer",
        }}
      >
        {isSearchingPact ? "Searching..." : "Search"}
      </button>

      {searchedPact && (
        <div style={{ marginTop: "20px" }}>
          <h3>✅ Search Result</h3>
          <p>
            {typeof searchedPact === "string"
              ? searchedPact
              : JSON.stringify(searchedPact)}
          </p>
        </div>
      )}

      {searchedPact === null && !isSearchingPact && (
        <div style={{ marginTop: "20px", color: "red" }}>
          ❌ No pact found!
        </div>
      )}
    </div>
  );
}
