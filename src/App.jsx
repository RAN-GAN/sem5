import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Submodules from "./pages/Submodules";
import Content from "./pages/Content";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:courseId" element={<Submodules />} />
        <Route
          path="/course/:courseId/submodule/:submoduleId"
          element={<Content />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
