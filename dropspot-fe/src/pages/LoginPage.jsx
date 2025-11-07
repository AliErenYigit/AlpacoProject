import { useState } from "react";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email);
    window.location.href = "/drops";
  };

  return (
    <div className="login-container" style={{ textAlign: "center", marginTop: "15%" }}>
      <h2>DropSpot</h2>
      <p>Sign up or login using your email</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "8px", width: "250px" }}
        />
        <br />
        <button type="submit" style={{ marginTop: "10px" }}>
          Continue
        </button>
      </form>
    </div>
  );
}
