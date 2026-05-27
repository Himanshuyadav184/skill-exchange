import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API = "https://skillchat.duckdns.org";
const socket = io(API);

const SKILL_CATEGORIES = ["All", "Programming", "Design", "Music", "Language", "AI / ML", "Data Science", "Finance", "Marketing", "Other"];

const HeroIllustration = () => (
  <svg viewBox="0 0 420 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
    <circle cx="320" cy="140" r="110" fill="rgba(255,255,255,0.06)"/>
    <circle cx="340" cy="120" r="70" fill="rgba(255,255,255,0.06)"/>
    <circle cx="100" cy="80" r="32" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
    <text x="100" y="88" textAnchor="middle" fontSize="28">👩‍💻</text>
    <rect x="60" y="118" width="80" height="10" rx="5" fill="rgba(255,255,255,0.15)"/>
    <rect x="70" y="134" width="60" height="8" rx="4" fill="rgba(255,255,255,0.1)"/>
    <path d="M160 115 Q200 80 240 115" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeDasharray="6 4" fill="none" markerEnd="url(#arr)"/>
    <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="rgba(255,255,255,0.7)"/></marker></defs>
    <circle cx="300" cy="80" r="32" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
    <text x="300" y="88" textAnchor="middle" fontSize="28">👨‍🎨</text>
    <rect x="260" y="118" width="80" height="10" rx="5" fill="rgba(255,255,255,0.15)"/>
    <rect x="270" y="134" width="60" height="8" rx="4" fill="rgba(255,255,255,0.1)"/>
    <path d="M240 145 Q200 180 160 145" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeDasharray="6 4" fill="none"/>
    <circle cx="200" cy="130" r="22" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
    <text x="200" y="138" textAnchor="middle" fontSize="20">🔄</text>
    <rect x="30" y="180" width="80" height="26" rx="13" fill="rgba(99,179,237,0.3)" stroke="rgba(99,179,237,0.6)" strokeWidth="1"/>
    <text x="70" y="197" textAnchor="middle" fontSize="11" fill="white" fontWeight="600">Python 🐍</text>
    <rect x="310" y="175" width="80" height="26" rx="13" fill="rgba(167,139,250,0.3)" stroke="rgba(167,139,250,0.6)" strokeWidth="1"/>
    <text x="350" y="192" textAnchor="middle" fontSize="11" fill="white" fontWeight="600">Design 🎨</text>
    <rect x="155" y="215" width="90" height="26" rx="13" fill="rgba(52,211,153,0.3)" stroke="rgba(52,211,153,0.6)" strokeWidth="1"/>
    <text x="200" y="232" textAnchor="middle" fontSize="11" fill="white" fontWeight="600">Music 🎵</text>
    <text x="50" y="155" fontSize="14" opacity="0.6">⭐</text>
    <text x="340" y="155" fontSize="14" opacity="0.6">⭐</text>
    <text x="380" y="90" fontSize="12" opacity="0.5">✨</text>
    <text x="20" y="100" fontSize="12" opacity="0.5">✨</text>
  </svg>
);

const EmptyMatchIllustration = () => (
  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:160,height:120,margin:"0 auto",display:"block"}}>
    <circle cx="100" cy="70" r="50" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2"/>
    <text x="100" y="82" textAnchor="middle" fontSize="36">🔍</text>
    <rect x="40" y="130" width="120" height="8" rx="4" fill="#e2e8f0"/>
    <rect x="60" y="145" width="80" height="6" rx="3" fill="#e2e8f0"/>
  </svg>
);

const EmptyInboxIllustration = () => (
  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:160,height:120,margin:"0 auto",display:"block"}}>
    <circle cx="100" cy="70" r="50" fill="#fef9ec" stroke="#fde68a" strokeWidth="2"/>
    <text x="100" y="82" textAnchor="middle" fontSize="36">📬</text>
    <rect x="40" y="130" width="120" height="8" rx="4" fill="#e2e8f0"/>
    <rect x="60" y="145" width="80" height="6" rx="3" fill="#e2e8f0"/>
  </svg>
);

const SkillsCardIllustration = () => (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:100,height:80,flexShrink:0}}>
    <circle cx="60" cy="45" r="38" fill="rgba(37,99,235,0.08)" stroke="rgba(37,99,235,0.15)" strokeWidth="1.5"/>
    <text x="60" y="30" textAnchor="middle" fontSize="18">🎯</text>
    <rect x="25" y="50" width="70" height="9" rx="4.5" fill="rgba(37,99,235,0.12)"/>
    <rect x="35" y="65" width="50" height="7" rx="3.5" fill="rgba(37,99,235,0.08)"/>
    <text x="60" y="92" textAnchor="middle" fontSize="10" fill="#2563eb" fontWeight="600">Set Your Skills</text>
  </svg>
);

function Dashboard() {
  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillsWanted, setSkillsWanted] = useState("");
  const [matches, setMatches] = useState([]);
  const [requests, setRequests] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredCard, setHoveredCard] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    socket.emit("join", userId);
    const handleNotification = () => setUnreadCount((prev) => prev + 1);
    socket.on("newNotification", handleNotification);
    return () => socket.off("newNotification", handleNotification);
  }, [userId]);

  const handleUpdateSkills = async () => {
    try {
      const offeredArray = skillsOffered.split(",").map((s) => s.trim()).filter(Boolean);
      const wantedArray = skillsWanted.split(",").map((s) => s.trim()).filter(Boolean);
      await axios.put(`${API}/api/users/update-skills/${userId}`, { skillsOffered: offeredArray, skillsWanted: wantedArray });
      setSuccessMsg("Skills updated successfully!"); setErrorMsg(""); fetchMatches();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch { setErrorMsg("Error updating skills"); setSuccessMsg(""); }
  };

  const fetchMatches = useCallback(async () => {
    try { const res = await axios.get(`${API}/api/users/match/${userId}`); setMatches(res.data); } catch { }
  }, [userId]);

  const fetchRequests = useCallback(async () => {
    try { const res = await axios.get(`${API}/api/requests/received/${userId}`); setRequests(res.data); } catch { }
  }, [userId]);

  const fetchUnread = useCallback(async () => {
    try { const res = await axios.get(`${API}/api/messages/unread/${userId}`); setUnreadCount(res.data.count); } catch { }
  }, [userId]);

  const sendRequest = async (receiverId, skill) => {
    try { await axios.post(`${API}/api/requests/send`, { sender: userId, receiver: receiverId, skill }); alert("Request sent!"); }
    catch { alert("Error sending request"); }
  };

  const updateRequest = async (requestId, status) => {
    try { await axios.put(`${API}/api/requests/update/${requestId}`, { status }); fetchRequests(); }
    catch { alert("Error updating request"); }
  };

  useEffect(() => {
    if (!userId) return;
    fetchMatches(); fetchRequests(); fetchUnread();
  }, [userId, fetchMatches, fetchRequests, fetchUnread]);

  useEffect(() => {
    const interval = setInterval(() => fetchUnread(), 5000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  const pendingCount = requests.filter(r => r.status === "pending").length;

  const filteredMatches = matches.filter(user => {
    const allSkills = [...user.skillsOffered, ...user.skillsWanted].map(s => s.toLowerCase());
    const nameMatch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const skillMatch = allSkills.some(s => s.includes(searchQuery.toLowerCase()));
    const categoryMatch = activeCategory === "All" || allSkills.some(s => s.includes(activeCategory.toLowerCase().replace(" / ", " ")));
    return (searchQuery === "" || nameMatch || skillMatch) && categoryMatch;
  });

  const palette = ["#2563eb","#7c3aed","#059669","#dc2626","#d97706","#0891b2","#be185d","#65a30d"];
  const getColor = (name) => palette[name.charCodeAt(0) % palette.length];

  return (
    <div style={{ minHeight:"100vh", background:"#f0f4ff", fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <nav style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"0 40px", display:"flex", justifyContent:"space-between", alignItems:"center", height:66, position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 12px rgba(0,0,0,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:"linear-gradient(135deg,#2563eb,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:20 }}>S</div>
          <span style={{ fontWeight:800, fontSize:21, color:"#1e293b" }}>Skill<span style={{ color:"#2563eb" }}>Xchange</span></span>
        </div>
        <div style={{ flex:1, maxWidth:460, margin:"0 32px", position:"relative" }}>
          <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", fontSize:17 }}>⌕</span>
          <input placeholder="Search people or skills..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width:"100%", padding:"10px 16px 10px 42px", borderRadius:99, border:"1.5px solid #e2e8f0", fontSize:14, outline:"none", background:"#f8faff", color:"#1e293b", boxSizing:"border-box" }} />
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <button onClick={() => window.location.href="/profile"} style={{ padding:"8px 18px", borderRadius:8, border:"1.5px solid #e2e8f0", background:"#fff", color:"#374151", fontWeight:600, fontSize:14, cursor:"pointer" }}>Profile</button>
          <button onClick={() => window.location.href="/chat"} style={{ padding:"8px 18px", borderRadius:8, border:"none", background:"linear-gradient(135deg,#2563eb,#7c3aed)", color:"#fff", fontWeight:600, fontSize:14, cursor:"pointer", position:"relative" }}>
            💬 Chat
            {unreadCount > 0 && <span style={{ position:"absolute", top:-7, right:-7, background:"#ef4444", color:"#fff", fontSize:10, fontWeight:700, borderRadius:99, padding:"2px 6px" }}>{unreadCount}</span>}
          </button>
          <button onClick={() => { localStorage.clear(); window.location.href="/"; }} style={{ padding:"8px 18px", borderRadius:8, border:"1.5px solid #fca5a5", background:"#fff", color:"#ef4444", fontWeight:600, fontSize:14, cursor:"pointer" }}>Logout</button>
        </div>
      </nav>

      <div style={{ background:"linear-gradient(135deg,#1e3a8a 0%,#2563eb 50%,#7c3aed 100%)", padding:"48px 40px 52px", position:"relative", overflow:"hidden" }}>
        <div style={{ maxWidth:1060, margin:"0 auto", display:"flex", alignItems:"center", gap:40, position:"relative", zIndex:1 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:99, padding:"5px 14px", marginBottom:20 }}>
              <span style={{ width:8, height:8, borderRadius:99, background:"#4ade80", boxShadow:"0 0 8px #4ade80", display:"inline-block" }}></span>
              <span style={{ fontSize:13, color:"#fff", fontWeight:600 }}>Live Platform</span>
            </div>
            <h1 style={{ fontSize:40, fontWeight:900, color:"#fff", margin:"0 0 12px", letterSpacing:-1, lineHeight:1.15 }}>
              Welcome back 👋<br /><span style={{ color:"#93c5fd" }}>Exchange Skills,</span> Grow Together
            </h1>
            <p style={{ fontSize:16, color:"rgba(255,255,255,0.8)", margin:"0 0 32px", lineHeight:1.6, maxWidth:460 }}>
              Connect with people who want to learn what you know and teach what you want to learn. Real skills, real people.
            </p>
            <div style={{ display:"flex", gap:32 }}>
              {[["🤝", matches.length, "Matches Found"], ["📩", pendingCount, "Pending Requests"], ["💬", unreadCount, "Unread Chats"]].map(([icon, num, label]) => (
                <div key={label} style={{ textAlign:"center" }}>
                  <span style={{ fontSize:28, fontWeight:800, color:"#fff", display:"block" }}>{icon} {num}</span>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.65)", fontWeight:500 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ width:380, height:240, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <HeroIllustration />
          </div>
        </div>
        <div style={{ position:"absolute", top:-80, right:-80, width:320, height:320, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}></div>
        <div style={{ position:"absolute", bottom:-60, right:160, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}></div>
      </div>

      <div style={{ maxWidth:1060, margin:"0 auto", padding:"32px 24px" }}>
        <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e2e8f0", padding:"28px 32px", marginBottom:36, boxShadow:"0 2px 12px rgba(0,0,0,0.05)", display:"flex", gap:24, alignItems:"flex-start" }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
              <span style={{ fontSize:24 }}>🎯</span>
              <h2 style={{ fontSize:20, fontWeight:800, color:"#1e293b", margin:0 }}>Your Skills</h2>
            </div>
            <p style={{ fontSize:14, color:"#64748b", margin:"0 0 22px 36px" }}>Tell the world what you can teach and what you want to learn</p>
            {successMsg && <div style={{ background:"linear-gradient(90deg,#f0fdf4,#dcfce7)", border:"1.5px solid #86efac", borderRadius:10, padding:"11px 16px", color:"#15803d", fontSize:14, fontWeight:600, marginBottom:16 }}>checkmark {successMsg}</div>}
            {errorMsg && <div style={{ background:"#fef2f2", border:"1.5px solid #fca5a5", borderRadius:10, padding:"11px 16px", color:"#dc2626", fontSize:14, fontWeight:600, marginBottom:16 }}>x {errorMsg}</div>}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
              {[["🎓 I Can Teach","e.g. Python, React, Guitar",skillsOffered,setSkillsOffered],["📚 I Want to Learn","e.g. Spanish, ML, Design",skillsWanted,setSkillsWanted]].map(([label,ph,val,setter]) => (
                <div key={label}>
                  <label style={{ fontSize:12, fontWeight:700, color:"#475569", display:"block", marginBottom:8, letterSpacing:0.4, textTransform:"uppercase" }}>{label}</label>
                  <input placeholder={ph} value={val} onChange={(e) => setter(e.target.value)}
                    style={{ width:"100%", padding:"13px 16px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:15, outline:"none", color:"#1e293b", boxSizing:"border-box", background:"#f8faff" }}
                    onFocus={e => e.target.style.border="1.5px solid #2563eb"}
                    onBlur={e => e.target.style.border="1.5px solid #e2e8f0"} />
                </div>
              ))}
            </div>
            <button onClick={handleUpdateSkills} style={{ padding:"13px 32px", borderRadius:10, background:"linear-gradient(135deg,#2563eb,#7c3aed)", color:"#fff", fontWeight:700, fontSize:15, border:"none", cursor:"pointer", boxShadow:"0 4px 14px rgba(37,99,235,0.35)" }}>
              Save Skills →
            </button>
          </div>
          <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:12, paddingTop:8 }}>
            <SkillsCardIllustration />
            <div style={{ background:"#eff6ff", borderRadius:12, padding:"12px 16px", border:"1px solid #bfdbfe", maxWidth:120, textAlign:"center" }}>
              <div style={{ fontSize:22, marginBottom:4 }}>💡</div>
              <p style={{ fontSize:11, color:"#1d4ed8", fontWeight:600, margin:0, lineHeight:1.4 }}>Tip: Separate skills with commas</p>
            </div>
          </div>
        </div>

        <div style={{ background:"linear-gradient(135deg,#eff6ff,#f5f3ff)", borderRadius:16, border:"1px solid #e2e8f0", padding:"24px 32px", marginBottom:36, display:"flex", gap:8, alignItems:"center", justifyContent:"space-around" }}>
          {[{icon:"👤",step:"1",label:"Create Profile",sub:"Add your skills"},{divider:true},{icon:"🤝",step:"2",label:"Get Matched",sub:"Find skill partners"},{divider:true},{icon:"💬",step:"3",label:"Connect & Chat",sub:"Start exchanging"},{divider:true},{icon:"🚀",step:"4",label:"Grow Together",sub:"Learn & teach"}].map((item,i) => item.divider ? (
            <div key={i} style={{ fontSize:20, color:"#94a3b8" }}>→</div>
          ) : (
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ width:48, height:48, borderRadius:12, background:"#fff", border:"1.5px solid #e2e8f0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, margin:"0 auto 8px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>{item.icon}</div>
              <div style={{ fontSize:11, fontWeight:700, color:"#2563eb", textTransform:"uppercase", letterSpacing:0.5, marginBottom:2 }}>Step {item.step}</div>
              <div style={{ fontSize:14, fontWeight:700, color:"#1e293b" }}>{item.label}</div>
              <div style={{ fontSize:12, color:"#64748b" }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:36 }}>
          <h2 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:"0 0 4px" }}>🤝 Skill Matches</h2>
          <p style={{ fontSize:14, color:"#64748b", margin:"0 0 16px" }}>People who match your learning goals • {filteredMatches.length} found</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24, padding:"14px 16px", background:"#fff", borderRadius:12, border:"1px solid #e2e8f0" }}>
            {SKILL_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding:"7px 16px", borderRadius:99, fontSize:13, fontWeight:600, cursor:"pointer", border:"none", background: activeCategory===cat ? "linear-gradient(135deg,#2563eb,#7c3aed)" : "#f1f5f9", color: activeCategory===cat ? "#fff" : "#475569", boxShadow: activeCategory===cat ? "0 2px 8px rgba(37,99,235,0.3)" : "none", transition:"all 0.15s" }}>{cat}</button>
            ))}
          </div>
          {filteredMatches.length === 0 ? (
            <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e2e8f0", padding:"56px 24px", textAlign:"center" }}>
              <EmptyMatchIllustration />
              <p style={{ fontWeight:800, color:"#1e293b", fontSize:20, margin:"16px 0 8px" }}>{searchQuery ? "No results found" : "No matches yet"}</p>
              <p style={{ color:"#94a3b8", fontSize:15, margin:0 }}>{searchQuery ? "Try a different search or category" : "Add your skills above and save — matches appear instantly!"}</p>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))", gap:20 }}>
              {filteredMatches.map((user) => {
                const color = getColor(user.name);
                const isHovered = hoveredCard === user._id;
                return (
                  <div key={user._id} style={{ background:"#fff", borderRadius:16, border: isHovered ? "1.5px solid #bfdbfe" : "1px solid #e2e8f0", overflow:"hidden", boxShadow: isHovered ? "0 12px 32px rgba(37,99,235,0.15)" : "0 2px 12px rgba(0,0,0,0.06)", transition:"all 0.2s ease", transform: isHovered ? "translateY(-4px)" : "none" }}
                    onMouseEnter={() => setHoveredCard(user._id)} onMouseLeave={() => setHoveredCard(null)}>
                    <div style={{ height:5, background:`linear-gradient(90deg,${color},${color}88)` }}></div>
                    <div style={{ padding:"20px 22px 22px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                        <div style={{ width:52, height:52, borderRadius:14, background:`linear-gradient(135deg,${color},${color}bb)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:22, flexShrink:0, boxShadow:`0 4px 12px ${color}44` }}>{user.name[0].toUpperCase()}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontWeight:700, color:"#1e293b", margin:0, fontSize:16, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</p>
                          <p style={{ fontSize:12, color:"#94a3b8", margin:"2px 0 0" }}>{user.email}</p>
                        </div>
                        <span style={{ background:"#dcfce7", color:"#15803d", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:99 }}>MATCH ✓</span>
                      </div>
                      <div style={{ height:1, background:"#f1f5f9", margin:"0 0 14px" }}></div>
                      <div style={{ marginBottom:12 }}>
                        <p style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:1, margin:"0 0 8px" }}>🎓 Can Teach</p>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                          {user.skillsOffered.map(s => <span key={s} style={{ background:"#eff6ff", color:"#1d4ed8", fontSize:12, fontWeight:600, padding:"4px 12px", borderRadius:99, border:"1px solid #bfdbfe" }}>{s}</span>)}
                        </div>
                      </div>
                      <div style={{ marginBottom:20 }}>
                        <p style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:1, margin:"0 0 8px" }}>📚 Wants to Learn</p>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                          {user.skillsWanted.map(s => <span key={s} style={{ background:"#fffbeb", color:"#92400e", fontSize:12, fontWeight:600, padding:"4px 12px", borderRadius:99, border:"1px solid #fde68a" }}>{s}</span>)}
                        </div>
                      </div>
                      <button onClick={() => sendRequest(user._id, user.skillsOffered[0])} style={{ width:"100%", padding:"12px", borderRadius:10, background: isHovered ? `linear-gradient(135deg,${color},${color}cc)` : "linear-gradient(135deg,#2563eb,#7c3aed)", color:"#fff", fontWeight:700, fontSize:14, border:"none", cursor:"pointer", boxShadow:"0 3px 10px rgba(37,99,235,0.3)", transition:"all 0.2s" }}>
                        Send Exchange Request →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h2 style={{ fontSize:22, fontWeight:800, color:"#1e293b", margin:"0 0 4px" }}>📩 Inbox</h2>
          <p style={{ fontSize:14, color:"#64748b", margin:"4px 0 20px" }}>Skill exchange requests from others</p>
          {requests.length === 0 ? (
            <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e2e8f0", padding:"56px 24px", textAlign:"center" }}>
              <EmptyInboxIllustration />
              <p style={{ fontWeight:800, color:"#1e293b", fontSize:20, margin:"16px 0 8px" }}>Your inbox is empty</p>
              <p style={{ color:"#94a3b8", fontSize:15, margin:0 }}>When someone sends you a skill exchange request, it will show up here</p>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:18 }}>
              {requests.map((req) => {
                const color = getColor(req.sender.name);
                return (
                  <div key={req._id} style={{ background:"#fff", borderRadius:16, border:"1px solid #e2e8f0", overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
                    <div style={{ height:5, background: req.status==="accepted" ? "#22c55e" : req.status==="rejected" ? "#ef4444" : "#f59e0b" }}></div>
                    <div style={{ padding:"20px 22px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                        <div style={{ width:46, height:46, borderRadius:12, background:`linear-gradient(135deg,${color},${color}bb)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:20 }}>{req.sender.name[0]}</div>
                        <div style={{ flex:1 }}>
                          <p style={{ fontWeight:700, color:"#1e293b", margin:0 }}>{req.sender.name}</p>
                          <p style={{ fontSize:12, color:"#94a3b8", margin:"2px 0 0" }}>{req.sender.email}</p>
                        </div>
                        <span style={{ fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:99, background: req.status==="accepted" ? "#dcfce7" : req.status==="rejected" ? "#fee2e2" : "#fef3c7", color: req.status==="accepted" ? "#15803d" : req.status==="rejected" ? "#dc2626" : "#d97706" }}>{req.status.toUpperCase()}</span>
                      </div>
                      <div style={{ background:"#f8faff", borderRadius:10, padding:"10px 14px", marginBottom:14, border:"1px solid #e2e8f0" }}>
                        <p style={{ fontSize:13, color:"#374151", margin:0 }}>Wants to learn: <strong style={{ color:"#2563eb" }}>{req.skill}</strong></p>
                      </div>
                      {req.status==="pending" && (
                        <div style={{ display:"flex", gap:8 }}>
                          <button onClick={() => updateRequest(req._id,"accepted")} style={{ flex:1, padding:"10px", borderRadius:9, background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", border:"none", cursor:"pointer", fontSize:13, fontWeight:700 }}>✓ Accept</button>
                          <button onClick={() => updateRequest(req._id,"rejected")} style={{ flex:1, padding:"10px", borderRadius:9, background:"#fff", color:"#ef4444", border:"1.5px solid #fca5a5", cursor:"pointer", fontSize:13, fontWeight:700 }}>✕ Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
