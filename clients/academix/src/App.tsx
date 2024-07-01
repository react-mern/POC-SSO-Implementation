import { Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import Identity from "./components/pages/Identity";
import Protected from "./components/pages/Protected";
import ProtectedRoute from "./routeGuards/ProtectedRoute";
import RedirectIfAuthenticated from "./routeGuards/RedirectIfAuthenticated";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/identity" element={<Identity />} />
      <Route element={<RedirectIfAuthenticated />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/protected" element={<Protected />} />
      </Route>
    </Routes>
  );
}

export default App;
