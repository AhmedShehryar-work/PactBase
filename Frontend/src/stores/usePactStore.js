import axios from "axios";
import { create } from "zustand";

export const usePactStore = create((set) => ({

  isSearchingPact: false,
  searchedPact: false,


  searchPact: async (data) => {
    try {
      set({ isSearchingPact: true });
      const res = await axios.get("http://localhost:4000/api/pact/searchpact", { params: { pactId: data }});
      set({ searchedPact: res.data });
    } catch (error) {
      console.log("Error in searchPact:", error);
      set({ searchedPact: null }); // optional: only clear on certain errors
    } finally {
      set({ isSearchingPact: false });
    }
  }


}));