import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("supabase.auth.token"));
    if (session?.currentSession?.user) {
      setUser(session.currentSession.user);
    }
  }, []);

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return <Dashboard setUser={setUser} />;
}

export default App;
