import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import VideoGrid from "./containers/VideoGrid";
import Login from "./containers/Auth/Login";
import Register from "./containers/Auth/Register";
import VideoPage from "./containers/VideoPage";
import useAuth from "./hooks/authHook";
import { ConnectedProtectedAuthRoute } from "./utils/ProtectedRoute";

function App() {
  const { loadUser } = useAuth();
  loadUser();
  return (
    <Router>
      <Routes>
        {/* Error Display */}
        <Route path="*" element={<h1>Error 404</h1>} />

        {/* Rutas AUTH*/}
        <Route element={<ConnectedProtectedAuthRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Rutas de la aplicación */}
        <Route path="/" element={<VideoGrid />} />
        <Route path="/subscriptions" element={<VideoGrid />} />
        <Route path="/channel/:id" element={<VideoGrid />} />
        <Route path="/watch/:id" element={<VideoPage />} />

      </Routes>
    </Router>
  );
}

export default App;
