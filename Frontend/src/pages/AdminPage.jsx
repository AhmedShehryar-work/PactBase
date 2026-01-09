import { useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const [loading, setLoading] = useState(false);

  const getUser = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:4000/admin/user");
      setUser(res.data.user);
      setHasFetchedOnce(true);
    } catch (err) {
      console.error(err);
      alert("Error fetching user");
    } finally {
      setLoading(false);
    }
  };

  const activateUser = async () => {
    if (!user) return;
    try {
      await axios.patch(`http://localhost:4000/admin/activate`, { username: user.username });
      setUser(null);
    } catch (err) {
      console.error(err);
      alert("Error activating user");
    }
  };

  const rejectUser = async () => {
    if (!user) return;
    try {
      await axios.patch(`http://localhost:4000/admin/reject`, { username: user.username });
      setUser(null);
    } catch (err) {
      console.error(err);
      alert("Error rejecting user");
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        backgroundColor: "#f0f8ff", // light blue background
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
      }}
    >
      <h1 style={{ color: "#0077b6", marginBottom: "20px" }}>Admin Panel</h1>

      <button
        onClick={getUser}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          backgroundColor: "#0077b6",
          color: "white",
          transition: "all 0.2s",
        }}
      >
        {loading ? "Loading..." : !hasFetchedOnce ? "Get User" : "Get Next User"}
      </button>

      {user && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #b0c4de",
            backgroundColor: "#e0f7fa",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}
        >
          <h2 style={{ color: "#023e8a" }}>Full Name: {user.full_name}</h2>
          <h2 style={{ color: "#023e8a" }}>CNIC: {user.cnic_no}</h2>

          <h3 style={{ marginTop: "15px", color: "#0077b6" }}>CNIC Images</h3>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
            <img
              src={JSON.parse(user.cnic_images).front}
              alt="CNIC Front"
              style={{ width: "120px", borderRadius: "8px", border: "1px solid #b0c4de" }}
            />
            <img
              src={JSON.parse(user.cnic_images).back}
              alt="CNIC Back"
              style={{ width: "120px", borderRadius: "8px", border: "1px solid #b0c4de" }}
            />
          </div>

          <h3 style={{ marginTop: "15px", color: "#0077b6" }}>Test Images</h3>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
            <img
              src={JSON.parse(user.test_images).image1}
              alt="Test Image 1"
              style={{ width: "120px", borderRadius: "8px", border: "1px solid #b0c4de" }}
            />
            <img
              src={JSON.parse(user.test_images).image2}
              alt="Test Image 2"
              style={{ width: "120px", borderRadius: "8px", border: "1px solid #b0c4de" }}
            />
            <img
              src={JSON.parse(user.test_images).image3}
              alt="Test Image 3"
              style={{ width: "120px", borderRadius: "8px", border: "1px solid #b0c4de" }}
            />
          </div>

          <div style={{ marginTop: "25px", display: "flex", justifyContent: "center", gap: "15px" }}>
            <button
              onClick={activateUser}
              style={{
                backgroundColor: "#00b894",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Activate
            </button>

            <button
              onClick={rejectUser}
              style={{
                backgroundColor: "#d63031",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
