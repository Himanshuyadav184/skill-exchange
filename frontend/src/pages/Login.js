import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`https://skillchat.duckdns.org/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      navigate("/dashboard");
    } catch (error) {
      setErrorMsg(error.response?.data?.msg || "Invalid credentials");
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9", display: "flex", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      {/* LEFT PANEL */}
      <div style={{ flex: 1, background: "linear-gradient(135deg, #0d47a1 0%, #1a73e8 100%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 48, color: "#fff" }}>
        <div style={{ maxWidth: 400 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22 }}>S</div>
            <span style={{ fontWeight: 800, fontSize: 24 }}>Skill<span style={{ color: "#93c5fd" }}>Xchange</span></span>
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.2 }}>Exchange skills,<br />grow together.</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: "0 0 40px" }}>Connect with people who want to learn what you know — and teach what you want to learn.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {["🤝 Match with skill partners", "💬 Chat in real time", "📈 Grow your expertise"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "rgba(255,255,255,0.9)" }}>{item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px" }}>Sign in</h1>
          <p style={{ color: "#6b7280", fontSize: 15, margin: "0 0 32px" }}>Welcome back — enter your details below</p>

          <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>Email address</label>
          <input type="email" placeholder="you@example.com"
            style={{ width: "100%", padding: "13px 16px", borderRadius: 8, border: "1.5px solid #d0d7e2", fontSize: 15, marginBottom: 20, boxSizing: "border-box", outline: "none", color: "#1a1a2e", background: "#fafbfc" }}
            onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }} onKeyDown={handleKeyDown} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", letterSpacing: 0.5, textTransform: "uppercase" }}>Password</label>
            <span onClick={() => navigate("/forgot-password")} style={{ fontSize: 13, color: "#1a73e8", cursor: "pointer", fontWeight: 600 }}>Forgot password?</span>
          </div>
          <input type="password" placeholder="Enter your password"
            style={{ width: "100%", padding: "13px 16px", borderRadius: 8, border: "1.5px solid #d0d7e2", fontSize: 15, marginBottom: 16, boxSizing: "border-box", outline: "none", color: "#1a1a2e", background: "#fafbfc" }}
            onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }} onKeyDown={handleKeyDown} />

          {errorMsg && <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: 8, padding: "10px 14px", color: "#dc2626", fontSize: 14, marginBottom: 16 }}>✕ {errorMsg}</div>}

          <button onClick={handleLogin}
            style={{ width: "100%", padding: "14px", borderRadius: 8, background: "linear-gradient(135deg, #1a73e8, #0d47a1)", color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>
            Sign in →
          </button>

          <div style={{ margin: "24px 0", borderTop: "1px solid #e8edf2" }}></div>
          <p style={{ textAlign: "center", fontSize: 14, color: "#6b7280" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#1a73e8", fontWeight: 700, textDecoration: "none" }}>Create one for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
