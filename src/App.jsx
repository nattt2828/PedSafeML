import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

function App() {
  // 🔹 Global System Configuration State
  const [threshold, setThreshold] = useState(5);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [zoneName, setZoneName] = useState("Crosswalk-01");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              threshold={threshold}
              alertsEnabled={alertsEnabled}
              zoneName={zoneName}
            />
          }
        />
        <Route
          path="/settings"
          element={
            <Settings
              threshold={threshold}
              setThreshold={setThreshold}
              alertsEnabled={alertsEnabled}
              setAlertsEnabled={setAlertsEnabled}
              zoneName={zoneName}
              setZoneName={setZoneName}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
