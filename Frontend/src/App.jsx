import SignUpPage from "./pages/SignupPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import PageNotFound from "./pages/PageNotFound";
import SearchPage from "./pages/SearchPage"
import MakePactPage from "./pages/MakePactPage"
import ViewPactPage from "./pages/ViewPactPage"
import ViewUserPage from "./pages/ViewUserPage"
import MyPactsPage from "./pages/MyPactsPage";

import {BrowserRouter as Router, Routes, Route, Link, Navigate} from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";


const App = () => {


  const { authUser, checkAuth, isCheckingAuth, logout} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth)
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
        <Link to="/search-pact" style={{ margin: "0 20px" }}>Search Pact</Link>
        <Link to="/make-pact" style={{ margin: "0 20px" }}>Make Pact</Link>
        <Link to="/login" style={{ margin: "0 20px" }}>Login</Link>
        <Link to="/" style={{ margin: "0 20px" }}>Home</Link>
        {authUser && (
                <button onClick={logout}>
                  Logout
                </button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />}/>

        <Route path="/signin" element={authUser ? <Dashboard /> : <Navigate to="/login" />}/>
        <Route path="/pact" element={<ViewPactPage/>} />
        <Route path="/user" element={<ViewUserPage/>} />
        <Route path="/dashboard" element={authUser ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/search-pact" element={<SearchPage />} />
        <Route path="/make-pact" element={authUser ? <MakePactPage /> : <Navigate to="/login" />}/>
        <Route path="/my-pacts" element={authUser ? <MyPactsPage /> : <Navigate to="/login" />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </Router>

    </div>
  );
};
export default App;