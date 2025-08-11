import SignUpPage from "./pages/SignUpPage";
import AdminPage from "./pages/AdminPage";

import { Routes, Route, Navigate } from "react-router-dom";


const App = () => {

  return (
    <div>

      <Routes>

        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

    </div>
  );
};
export default App;