import { create } from "zustand";
import axios from "axios";

export const useUserStore = create((set) => ({
  isLoadingUser: false,
  userData: null,
  error: null,

  getUser: async (username) => {
    try {
      set({ isLoadingUser: true, error: null });

      const res = await axios.get("http://localhost:4000/api/user/get-user", {
        params: { username },
      });

      if (res.data.success) {
        set({ userData: res.data.user });
      } else {
        set({ userData: null, error: res.data.message });
      }
    } catch (err) {
      console.log("Error fetching user:", err);
      set({ userData: null, error: "Failed to fetch user" });
    } finally {
      set({ isLoadingUser: false });
    }
  },
}));
