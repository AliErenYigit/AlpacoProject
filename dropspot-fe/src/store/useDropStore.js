import { create } from "zustand";
import axiosClient from "../api/axiosClient";

const useDropStore = create((set) => ({
  drops: [],
  selectedDrop: null,

  fetchDrops: async () => {
    const res = await axiosClient.get("/drops");
    set({ drops: res.data });
  },

  fetchDropById: async (id) => {
    const res = await axiosClient.get(`/drops/${id}`);
    set({ selectedDrop: res.data });
  },
}));

export default useDropStore;
