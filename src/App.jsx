import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, useThemeContext } from "./context/ThemeContext";
import { ModulesProvider } from "./context/ModulesContext";
import { AuthProvider } from "./context/AuthContext";

import AppLayout from "./components/layout/AppLayout";
import HomePage from "./components/pages/HomePage";
import ModulesPage from "./components/pages/ModulesPage";
import CalculatorPage from "./components/pages/CalculatorPage";
import SettingsPage from "./components/pages/SettingsPage";
import ProfilePage from "./components/pages/ProfilePage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import CookieConsent from "./components/common/CookieConsent";

function AppWithTheme() {
  return (
    <Router>
      <AuthProvider>
        <ModulesProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/modules" element={<ModulesPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </AppLayout>
          <CookieConsent />
        </ModulesProvider>
      </AuthProvider>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppWithTheme />
    </ThemeProvider>
  );
}

export default App;
