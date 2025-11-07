import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./LoginPage.css"; // 👈 yeni CSS dosyası eklenecek

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email);
      window.location.href = "/drops";
    } catch (err) {
      alert("Login failed. Check console.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="title">DropSpot</h1>
        <p className="subtitle">Enter Your Email</p>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
            className="input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn">Continue</button>
        </form>
      </div>
    </div>
  );
}
