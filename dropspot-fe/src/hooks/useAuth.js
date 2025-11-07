import { create } from "zustand";
import axiosClient from "../api/axiosClient";

const useAuth = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,

  // email ve password birlikte gönderilecek
  login: async (email, password) => {
    try {
      const res = await axiosClient.post("/auth/login", { email, password });

      const { user, token } = res.data;

      // localStorage’a kaydet
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // global state güncelle
      set({ user, token });
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      throw err;
    }
  },

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

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },
}));

export default useAuth;
