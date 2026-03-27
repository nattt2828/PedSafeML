import { createContext, useContext, useState } from "react";

const SettingsContext = createContext(null);

export const DEFAULT_SETTINGS = {
  alertThreshold: 5,
  cameraZone: "Crosswalk-01",
  confidenceCutoff: 85,                  //  settings state stores configuration such as alert thresholds and camera zones
  sensitivityMode: "standard",
  notificationsEnabled: true,
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const updateSettings = (newSettings) => {                         //settings are updated, the state changes and the updated values are used in other components
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => setSettings(DEFAULT_SETTINGS);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}