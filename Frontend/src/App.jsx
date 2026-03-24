import { lazy, Suspense } from "react";

const SignUpPage = lazy(() => import("./pages/SignupPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const MakePactPage = lazy(() => import("./pages/MakePactPage"));
const ViewPactPage = lazy(() => import("./pages/ViewPactPage"));
const ViewUserPage = lazy(() => import("./pages/ViewUserPage"));
const MyPactsPage = lazy(() => import("./pages/MyPactsPage"));

import {BrowserRouter as Router, Routes, Route, Link, Navigate} from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { socket } from "./socket/socket";

const App = () => {


  const { authUser, checkAuth, isCheckingAuth, logout} = useAuthStore();

  useEffect(() => {
    checkAuth();

    socket.on("auth_error", (err) => {
      console.warn("Socket auth failed:", err.message);
      logout(); // force logout if socket auth fails
    });

    return () => {
      socket.off("auth_error");
    };

  }, [checkAuth, logout]);

  if (isCheckingAuth)
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );


  return (
    <>

      <Router>

        {authUser && (
                <button onClick={logout}>
                  Logout
                </button>
        )}

      <Suspense fallback={<div><h1>Loading</h1></div>}>

      <Routes>
        <Route path="/" element={<LandingPage />}/>

        <Route path="/signin" element={authUser ? <Dashboard /> : <Navigate to="/login" />}/>
        <Route path="/pact" element={<ViewPactPage/>} />
        <Route path="/user" element={<ViewUserPage/>} />
        <Route path="/dashboard" element={authUser ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/search-pact" element={<SearchPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>

      </Suspense>

    </Router>
    
    </>
  );
};
export default App;