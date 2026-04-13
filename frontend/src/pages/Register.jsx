import { useState } from "react";
import API from "../api/axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      await API.post("/auth/register", {
        email,
        password,
      });

      alert("Registered successfully");

    } catch (err) {
      alert("Register failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button onClick={register}>Register</button>
    </div>
  );
}