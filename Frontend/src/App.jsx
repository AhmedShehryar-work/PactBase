import SignUpPage from "./pages/SignUpPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/PageNotFound";

import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";


const App = () => {

  return (
    <div>

      <Router>
      <nav style={{ textAlign: "center", padding: "20px", fontSize: "24px" }}>
        <Link to="/signup" style={{ margin: "0 20px" }}>Signup</Link>
        <Link to="/admin" style={{ margin: "0 20px" }}>Admin</Link>
      </nav>

      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </Router>

    </div>
  );
};
export default App;