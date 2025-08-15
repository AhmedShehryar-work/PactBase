import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {

  const navigate = useNavigate();

  const { login, isLoggingIn, loginError, clearLoginError, loginSuccess} = useAuthStore();

    const [formData, setFormData] = useState({
      username: "",
      password: "",
    });

    const handleSubmit = async (e) => {
      clearLoginError();
      e.preventDefault();
      await login(formData);
      if(loginSuccess){navigate("/")}     
    };


  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        {loginError && <p style={{ color: "red" }}>{loginError}</p>}

        <button type="submit" style={{ marginTop: "20px" }} disabled={isLoggingIn}>
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
