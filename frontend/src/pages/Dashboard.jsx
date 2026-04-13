import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔥 LOGOUT FUNCTION (FIXED)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // 🔹 Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await API.get("/projects/");
      setProjects(res.data);
    } catch (err) {
      console.error("FETCH ERROR:", err.response?.data || err.message);
      alert("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await API.get("/user/profile");
      setProfile(res.data);
    } catch (err) {
      console.error("PROFILE ERROR:", err.response?.data || err.message);
    }
  };

  // 🔹 Create project
  const createProject = async () => {
    try {
      await API.post("/projects/", {
        name: "New Project",
        description: "Created from UI",
      });
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.detail || "Error creating project");
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchProfile();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* 🔥 SIDEBAR */}
      <div style={sidebar}>
        <h2>SaaS Panel</h2>

        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        <Link to="/dashboard" style={linkStyle}>Projects</Link>
        <Link to="/billing" style={linkStyle}>Billing</Link>
        <Link to="/profile" style={linkStyle}>Profile</Link>

        <button style={logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* 🔥 MAIN CONTENT */}
      <div style={{ flex: 1, padding: "30px" }}>
        <h2>Dashboard Overview</h2>

        {/* 🔥 CARDS */}
        <div style={cardContainer}>
          <div style={card}>
            <h3>Projects</h3>
            <p>{projects.length}</p>
          </div>

          <div style={card}>
            <h3>Plan</h3>
            <p>{profile?.subscription?.plan || "free"}</p>
          </div>

          <div style={card}>
            <h3>Status</h3>
            <p style={{ color: "green" }}>
              {profile?.subscription?.status || "inactive"}
            </p>
          </div>
        </div>

        {/* 🔥 ADD PROJECT */}
        <button
          style={addBtn}
          onClick={createProject}
          disabled={
            profile?.subscription?.plan === "free" &&
            projects.length >= 3
          }
        >
          + Add Project
        </button>

        {/* ⚠️ LIMIT MESSAGE */}
        {profile?.subscription?.plan === "free" &&
          projects.length >= 3 && (
            <p style={{ color: "red" }}>
              Free plan limit reached. Upgrade 🚀
            </p>
        )}

        {/* 🔥 PROJECT LIST */}
        <h3 style={{ marginTop: "30px" }}>Your Projects</h3>

        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects found</p>
        ) : (
          projects.map((p) => (
            <div key={p.id} style={projectCard}>
              <h4>{p.name}</h4>
              <p>{p.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* 🎨 STYLES */

const sidebar = {
  width: "220px",
  background: "#0f172a",
  color: "white",
  padding: "20px"
};

const linkStyle = {
  display: "block",
  margin: "10px 0",
  color: "white",
  textDecoration: "none",
  padding: "6px",
  borderRadius: "5px"
};

const logoutBtn = {
  marginTop: "20px",
  background: "red",
  color: "white",
  padding: "10px",
  border: "none",
  width: "100%",
  cursor: "pointer"
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
  textAlign: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

const addBtn = {
  marginTop: "20px",
  padding: "10px 20px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const projectCard = {
  border: "1px solid #ddd",
  padding: "15px",
  marginTop: "10px",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};