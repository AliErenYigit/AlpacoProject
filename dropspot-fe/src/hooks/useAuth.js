import { create } from "zustand";
import axiosClient from "../api/axiosClient";

// 🔹 JWT decode fonksiyonu (endpoint'e gerek yok)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const useAuth = create((set) => {
  // 🔹 Sayfa yenilendiğinde token varsa decode et
  const storedToken = localStorage.getItem("token");
  const storedUser =
    JSON.parse(localStorage.getItem("user")) ||
    (storedToken ? decodeJWT(storedToken) : null);

  return {
    user: storedUser,
    token: storedToken,

    // 🔹 Login
    login: async (email, password) => {
      try {
        const res = await axiosClient.post("/auth/login", { email, password });
        const { user, token } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        set({ user, token });
      } catch (err) {
        console.error("Login failed:", err.response?.data || err.message);
        throw err;
      }
    },

    // 🔹 Signup
    signup: async (email, password, role = "user") => {
      try {
        const res = await axiosClient.post("/auth/signup", {
          email,
          password,
          role,
        });

        const { user, token } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        set({ user, token });
      } catch (err) {
        console.error("Signup failed:", err.response?.data || err.message);
        throw err;
      }
    },

    // 🔹 Logout
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ user: null, token: null });
    },
  };
});

export default useAuth;
