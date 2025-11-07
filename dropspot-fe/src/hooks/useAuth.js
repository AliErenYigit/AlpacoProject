import { create } from "zustand";
import axiosClient from "../api/axiosClient";

const useAuth = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,

  login: async (email) => {
    const res = await axiosClient.post("/auth/signup", { email });
    localStorage.setItem("token", res.data.token);
    set({ user: res.data.user, token: res.data.token });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));

export default useAuth;
