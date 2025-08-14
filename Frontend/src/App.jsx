import SignUpPage from "./pages/SignUpPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage"
import PageNotFound from "./pages/PageNotFound";

import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";


const App = () => {


  const { authUser, checkAuth, isCheckingAuth,} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );


  return (
    <div>

      <Router>
      <nav style={{ textAlign: "center", padding: "20px", fontSize: "24px" }}>
        <Link to="/signup" style={{ margin: "0 20px" }}>Signup</Link>
        <Link to="/admin" style={{ margin: "0 20px" }}>Admin</Link>
        <Link to="/login" style={{ margin: "0 20px" }}>Login</Link>
      </nav>

      <Routes>
        <Route path="/"  element={authUser ? <HomePage /> : <Navigate to="/login" />}/>
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </Router>

    </div>
  );
};
export default App;