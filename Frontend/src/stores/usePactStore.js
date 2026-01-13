import axios from "axios";
import { create } from "zustand";

export const usePactStore = create((set, get) => ({

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
  madePactId: "",
  isBlocked: false,

  makePact: async (data) => {
    try {
      set({ isMakingPact: true });
      const res = await axios.post("http://localhost:4000/api/pact/make-pact", data, { withCredentials: true });
      set({
        madePactId: res.data?.id
      });
    } catch (error) {
      set({
        madePactId: null,
        isBlocked: error.response?.data?.error_status === "blocked"
      });
      console.log("Error in searchPact:", error);
    } finally {
      set({ isMakingPact: false });
    }
  },

  fulfillingPact: false,  // new state

  fulfillPact: async (pactId) => {
    try {
      set({ fulfillingPact: true });
      const res = await axios.post(`http://localhost:4000/api/pact/fulfill`, { pactId },  { withCredentials: true });
      set({ searchedPact: res.data?.pact });
    } catch (err) {
      console.error("Error marking pact as fulfilled:", err);
      throw err; // rethrow so UI can handle
    } finally {
      set({ fulfillingPact: false });
    }
  },


  myPacts: [],
  isLoadingMyPacts: false,
  hasMoreMyPacts: true,
  myPactsPage: 1,

  resetMyPacts: () =>
  set({
    myPacts: [],
    myPactsPage: 1,
    hasMoreMyPacts: true,
  }),


  getMyPacts: async ({ type, search = "" }) => {
    const { myPactsPage, myPacts, hasMoreMyPacts } = get();
    if (!hasMoreMyPacts) return;

    try {
      set({ isLoadingMyPacts: true });

      const res = await axios.get(
        "http://localhost:4000/api/pact/my-pacts",
        {
          params: {
            type,
            page: myPactsPage,
            limit: 10,
            search,
          },
          withCredentials: true,
        }
      );

      set({
        myPacts: [...myPacts, ...res.data.pacts],
        hasMoreMyPacts: res.data.hasMore,
        myPactsPage: myPactsPage + 1,
      });
    } catch (err) {
      console.error("getMyPacts error:", err);
    } finally {
      set({ isLoadingMyPacts: false });
    }
  }


}));