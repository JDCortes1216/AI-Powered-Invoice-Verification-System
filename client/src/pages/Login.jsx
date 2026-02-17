import { useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/Login.css";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: username, // using username as email
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      setUser(data.user);
    }
  };

  return (
    <div className="login-page">
      <div className="app-title">AI-nvoice</div>

      <div className="login-container">
        <h2>Login</h2>

        <input
          type="text"
          placeholder="Email"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
