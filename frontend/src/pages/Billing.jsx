import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Billing() {
  const [subscription, setSubscription] = useState(null);

  const fetchSubscription = async () => {
    try {
      const res = await API.get("/subscriptions/me");
      setSubscription(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load subscription");
    }
  };

  const upgradeToPro = async () => {
    try {
      const res = await API.post("/subscriptions/create-checkout-session");

      // ✅ FIXED (correct key)
      window.location.href = res.data.checkout_url;

    } catch (err) {
      console.error(err);
      alert("Failed to start checkout");
    }
  };

  const cancelSubscription = async () => {
    try {
      // ✅ FIXED (correct endpoint)
      await API.post("/subscriptions/cancel-subscription");

      alert("Subscription canceled");
      fetchSubscription();

    } catch (err) {
      console.error(err);
      alert("Cancel failed");
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return (
    <div>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Billing</h2>

        {subscription ? (
          <div>
            <p><strong>Plan:</strong> {subscription.plan}</p>
            <p><strong>Status:</strong> {subscription.status}</p>

            {subscription.plan === "free" ? (
              <button onClick={upgradeToPro}>
                Upgrade to Pro 🚀
              </button>
            ) : (
              <button onClick={cancelSubscription}>
                Cancel Subscription ❌
              </button>
            )}
          </div>
        ) : (
          <p>Loading subscription...</p>
        )}
      </div>
    </div>
  );
}