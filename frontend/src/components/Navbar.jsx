import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role"); // ✅ get role

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // ✅ IMPORTANT
    navigate("/login");
  };

  return (
    <nav style={{ padding: 10, background: "#eee" }}>
      <Link to="/dashboard">Dashboard</Link> |{" "}
      <Link to="/billing">Billing</Link> |{" "}
      <Link to="/profile">Profile</Link> |{" "}

      {/* ✅ Show admin only if role = admin */}
      {role === "admin" && (
        <>
          <Link to="/admin">Admin</Link> |{" "}
        </>
      )}

      <button onClick={logout}>Logout</button>
    </nav>
  );
}