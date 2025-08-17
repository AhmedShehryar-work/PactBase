import axios from "axios";
import { create } from "zustand";

export const useAuthStore = create((set) => ({

  isSearchingPact: false,
  searchedPact: false,


  searchPact: async () => {
    try {
      set({ isSearchingPact: true });
      const res = await axios.get("http://localhost:4000/api/pact/searchpact");
      set({ searchedPact: res.data });
    } catch (error) {
      console.log("Error in searchPact:", error);
      set({ searchedPact: null }); // optional: only clear on certain errors
    } finally {
      set({ isSearchingPact: false });
    }
  }


}));