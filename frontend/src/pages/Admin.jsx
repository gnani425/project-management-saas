import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [userSubs, setUserSubs] = useState([]);
  const [stats, setStats] = useState(null);

  const [activeTab, setActiveTab] = useState("dashboard");

  const navigate = useNavigate();

  // 🔥 LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const fetchData = async () => {
    try {
      const usersRes = await API.get("/admin/users");
      const subsRes = await API.get("/admin/subscriptions");
      const statsRes = await API.get("/admin/stats");
      const userSubsRes = await API.get("/admin/user-subscriptions");

      setUsers(usersRes.data);
      setSubscriptions(subsRes.data);
      setStats(statsRes.data);
      setUserSubs(userSubsRes.data);
    } catch (err) {
      console.error(err);
      alert("Admin access failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* 🔥 SIDEBAR */}
      <div style={sidebar}>
        <h2>Admin Panel</h2>

        <p style={link} onClick={() => setActiveTab("dashboard")}>Dashboard</p>
        <p style={link} onClick={() => setActiveTab("users")}>Users</p>
        <p style={link} onClick={() => setActiveTab("subscriptions")}>Subscriptions</p>
        <p style={link} onClick={() => setActiveTab("userSubs")}>User Subscriptions</p>

        <button style={logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* 🔥 MAIN CONTENT */}
      <div style={{ flex: 1, padding: "30px" }}>
        
        {/* ✅ DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <h2>Admin Dashboard</h2>

            <div style={cardContainer}>
              <div style={card}>
                <h3>Total Users</h3>
                <p>{users.length}</p>
              </div>

              <div style={card}>
                <h3>Active Subs</h3>
                <p>{stats?.active || 0}</p>
              </div>

              <div style={card}>
                <h3>Canceled</h3>
                <p>{stats?.canceled || 0}</p>
              </div>
            </div>
          </>
        )}

        {/* ✅ USERS */}
        {activeTab === "users" && (
          <>
            <h2>Users</h2>
            {users.map((u) => (
              <div key={u.id} style={cardItem}>
                {u.email} - {u.role}
              </div>
            ))}
          </>
        )}

        {/* ✅ SUBSCRIPTIONS */}
        {activeTab === "subscriptions" && (
          <>
            <h2>Subscriptions</h2>
            {subscriptions.map((s) => (
              <div key={s.id} style={cardItem}>
                User: {s.user_id} | Plan: {s.plan} | Status: {s.status}
              </div>
            ))}
          </>
        )}

        {/* ✅ USER SUBSCRIPTIONS */}
        {activeTab === "userSubs" && (
          <>
            <h2>User Subscriptions</h2>
            {userSubs.map((u, i) => (
              <div key={i} style={cardItem}>
                {u.email} → {u.plan} ({u.status})
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

/* 🎨 STYLES */

const sidebar = {
  width: "220px",
  background: "#111827",
  color: "white",
  padding: "20px"
};

const link = {
  margin: "10px 0",
  cursor: "pointer"
};

const logoutBtn = {
  marginTop: "20px",
  background: "red",
  color: "white",
  padding: "10px",
  border: "none",
  width: "100%"
};

const cardContainer = {
  display: "flex",
  gap: "20px",
  marginTop: "20px"
};

const card = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "20px",
  width: "200px",
  textAlign: "center"
};

const cardItem = {
  border: "1px solid #ddd",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px"
};