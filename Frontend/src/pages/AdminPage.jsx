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
      await axios.patch(`http://localhost:4000/admin/activate`, {username: user.username});
      setUser(null);

    } catch (err) {
      console.error(err);
      alert("Error activating user");
    }
  };

  const rejectUser = async () => {
    if (!user) return;
    try {
      await axios.patch(`http://localhost:4000/admin/reject`, {username: user.username});
    } catch (err) {
      console.error(err);
      alert("Error Rejecting user");
    }
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "50px auto",
      textAlign: "center",
      fontFamily: "sans-serif"
    }}>
      <h1>Admin Panel</h1>

      {!hasFetchedOnce ? (
        <button onClick={getUser} disabled={loading}>
          {loading ? "Loading..." : "Get User"}
        </button>
      ) : (
        <button onClick={getUser} disabled={loading}>
          {loading ? "Loading..." : "Get Next User"}
        </button>
      )}

      {user && (
        <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #ccc" }}>
          <h2>Full Name: {loading ? "Loading..." : user.full_name}</h2>
          <h2>CNIC: {loading ? "Loading..." : user.cnic_no}</h2>
          <h2>CNIC IMAGES</h2>
          <img src={JSON.parse(user.cnic_images).front} alt="CNIC Front" />
          <img src={JSON.parse(user.cnic_images).back} alt="CNIC Back" />
          <h2>TEST IMAGES</h2>
          <img src={JSON.parse(user.test_images).image1} alt="Test Image 1" />
          <img src={JSON.parse(user.test_images).image2} alt="Test Image 2" />
          <img src={JSON.parse(user.test_images).image3} alt="Test Image 3" />

          <div style={{ marginTop: "20px" }}>
            <button onClick={activateUser} style={{ backgroundColor: "green", color: "white",marginRight: "10px" }}>
              Activate
            </button>
            <button onClick={rejectUser} style={{ backgroundColor: "red", color: "white",marginRight: "10px" }}>
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;