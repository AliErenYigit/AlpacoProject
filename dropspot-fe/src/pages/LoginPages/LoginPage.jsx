import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // login hook'un eposta+şifre kabul ettiğini varsayıyoruz
      await login(email, password);

      const userData = JSON.parse(localStorage.getItem("user"));
      const role = userData?.role || "user";

      if (role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/drops";
      }
    } catch (err) {
      alert("Login failed. Please check your email or password.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="title">DropSpot</h1>
        <p className="subtitle">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
            className="input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
