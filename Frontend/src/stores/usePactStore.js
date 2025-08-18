import axios from "axios";
import { create } from "zustand";

export const usePactStore = create((set) => ({

  isSearchingPact: false,
  searchedPact: null,

  searchPact: async (data) => {
    try {
      set({ isSearchingPact: true });
      const res = await axios.get("http://localhost:4000/api/pact/search-pact", { params: { pactId: data }});
      set({ searchedPact: res.data });
    } catch (error) {
      console.log("Error in searchPact:", error);
      set({ searchedPact: null });
    } finally {
      set({ isSearchingPact: false });
    }
  },


  isMakingPact: false,

  makePact: async (data) => {
    try {
      set({ isMakingPact: true });
      await axios.post("http://localhost:4000/api/pact/make-pact", data,  { withCredentials: true });
    } catch (error) {
      console.log("Error in searchPact:", error);
    } finally {
      set({ isMakingPact: false });
    }
  }


}));