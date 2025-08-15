import axios from "axios";
import { create } from "zustand";

export const useAuthStore = create((set) => ({

  authUser: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  loginError: "",
  loginSuccess: false,

  checkAuth: async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/auth/check", { withCredentials: true });
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null }); // optional: only clear on certain errors
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data) => {

    try {
      set({isLoggingIn: true});
      const res = await axios.post(
        "http://localhost:4000/api/login",
        data,
        { withCredentials: true } // important for cookies
      );
      set({ authUser: res.data });
      set({ loginSuccess: true });
    } catch (err) {
      if (err.response?.data?.message) {
        set({loginError: err.response.data.message});
      } else {
        set({loginError: "Login Failed"});
      }
    }finally{
      set({isLoggingIn: false});
    }

  },

  clearLoginError: () => {
    set({ loginError: "" })
  }

}));