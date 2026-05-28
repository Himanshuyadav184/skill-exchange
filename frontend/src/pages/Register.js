import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await axios.post(`https://skillchat.duckdns.org/api/auth/register`, { name, email, password });
      alert(res.data.msg);
    } catch (error) {
      alert(error.response?.data?.msg || "Error occurred");
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleRegister(); };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9", display: "flex", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      {/* LEFT PANEL */}
      <div style={{ flex: 1, background: "linear-gradient(135deg, #0d47a1 0%, #1a73e8 100%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 48, color: "#fff" }}>
        <div style={{ maxWidth: 400 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22 }}>S</div>
            <span style={{ fontWeight: 800, fontSize: 24 }}>Skill<span style={{ color: "#93c5fd" }}>Xchange</span></span>
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.2 }}>Join thousands of<br />skill sharers.</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: "0 0 40px" }}>Create a free account and start connecting with people who want to exchange knowledge.</p>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 20 }}>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", margin: 0, lineHeight: 1.6 }}>
               <br />
              <strong style={{ color: "#93c5fd" }}></strong>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px" }}>Create account</h1>
          <p style={{ color: "#6b7280", fontSize: 15, margin: "0 0 32px" }}>Free forever — no credit card required</p>

          {[
            ["Full name", "text", "John Doe", setName],
            ["Email address", "email", "you@example.com", setEmail],
            ["Password", "password", "Min. 8 characters", setPassword],
          ].map(([label, type, ph, setter]) => (
            <div key={label} style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</label>
              <input type={type} placeholder={ph}
                style={{ width: "100%", padding: "13px 16px", borderRadius: 8, border: "1.5px solid #d0d7e2", fontSize: 15, boxSizing: "border-box", outline: "none", color: "#1a1a2e", background: "#fafbfc" }}
                onChange={(e) => setter(e.target.value)} onKeyDown={handleKeyDown} />
            </div>
          ))}

          <button onClick={handleRegister}
            style={{ width: "100%", padding: "14px", borderRadius: 8, background: "linear-gradient(135deg, #1a73e8, #0d47a1)", color: "#fff", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", marginTop: 4 }}>
            Create free account →
          </button>

          <div style={{ margin: "24px 0", borderTop: "1px solid #e8edf2" }}></div>
          <p style={{ textAlign: "center", fontSize: 14, color: "#6b7280" }}>
            Already have an account?{" "}
            <Link to="/" style={{ color: "#1a73e8", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
