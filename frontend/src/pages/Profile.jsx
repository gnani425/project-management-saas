import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/user/profile"); // ✅ consistent API
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const upgradeToPro = async () => {
    try {
      const res = await API.post("/subscriptions/create-checkout-session");
      window.location.href = res.data.checkout_url;
    } catch (err) {
      alert("Upgrade failed");
    }
  };

  const cancelSubscription = async () => {
    try {
      await API.post("/subscriptions/cancel-subscription");
      alert("Subscription canceled");
      fetchProfile();
    } catch (err) {
      alert("Cancel failed");
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={fetchProfile}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <h2>Profile</h2>

      <p><b>Email:</b> {profile?.email}</p>

      <h3>Subscription</h3>

      <p><b>Plan:</b> {profile?.subscription?.plan || "free"}</p>
      <p><b>Status:</b> {profile?.subscription?.status || "inactive"}</p>

      {profile?.subscription?.status !== "active" ? (
        <button onClick={upgradeToPro}>Upgrade to Pro 🚀</button>
      ) : (
        <button onClick={cancelSubscription}>Cancel Subscription</button>
      )}

      <br /><br />
      <button onClick={fetchProfile}>Refresh</button>
    </div>
  );
}