// stores/useAuthStore.js
import { create } from "zustand";
import axios from "axios";

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (identifier, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        "https://screen.net.ar/strapi/api/auth/local",
        { identifier, password }
      );
      localStorage.setItem("token", response.data.jwt);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.jwt}`;
      console.log(response.data.jwt);
      set({ user: response.data.user, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to login",
        loading: false,
      });
      console.log(error);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    set({ user: null });
  },

  fetchUser: async () => {
    set({ loading: true });
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const response = await axios.get(
          "https://screen.net.ar/strapi/api/users/me"
        );
        set({ user: response.data, loading: false });
      } catch (error) {
        set({
          error: error.response?.data?.message || "Failed to fetch user",
          loading: false,
        });
      }
    } else {
      set({ loading: false });
    }
  },
}));

export default useAuthStore;
