import axios from "axios";
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({

  authUser: null,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null }); // optional: only clear on certain errors
    } finally {
      set({ isCheckingAuth: false });
    }
  },

}));