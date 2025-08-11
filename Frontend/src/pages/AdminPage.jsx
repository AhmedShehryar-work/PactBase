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
      await axios.patch(`http://localhost:4000/admin/activate`, {user_id: user.id});
      setUser(null);

    } catch (err) {
      console.error(err);
      alert("Error activating user");
    }
  };

  const deactivateUser = async () => {
    if (!user) return;
    try {
      await axios.patch(`http://localhost:4000/admin/deactivate`, {user_id: user.id});
      setUser(null);
    } catch (err) {
      console.error(err);
      alert("Error deactivating user");
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
          <h2>User CNIC: {loading ? "Loading..." : user.cnic_no}</h2>
          
          <div style={{ marginTop: "20px" }}>
            <button onClick={activateUser} style={{ marginRight: "10px" }}>
              Activate
            </button>
            <button onClick={deactivateUser} style={{ backgroundColor: "red", color: "white" }}>
              Deactivate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;