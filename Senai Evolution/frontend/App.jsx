import React, { useEffect, useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const token = localStorage.getItem("token");

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
        {token ? (
          <Dashboard theme={theme} setTheme={setTheme} />
        ) : (
          <Login theme={theme} setTheme={setTheme} />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
