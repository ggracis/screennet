import { create } from "zustand";
import axios from "axios";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      userId: null,
      loading: false,
      error: null,

      login: async (identifier, password) => {
        set({ loading: true, error: null });
        try {
          const STRAPI_URL =
            process.env.NEXTAUTH_URL || "https://screen.net.ar/strapi";
          const response = await axios.post(`${STRAPI_URL}/api/auth/local`, {
            identifier,
            password,
          });
          localStorage.setItem("token", response.data.jwt);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.jwt}`;
          set({
            user: response.data.user,
            userId: response.data.user.id,
            loading: false,
          });
          console.log("Login successful, userId:", response.data.user.id);
        } catch (error) {
          set({
            error: error.response?.data?.message || "Error al iniciar sesión",
            loading: false,
          });
          console.error("Login error:", error);
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        set({ user: null, userId: null });
      },

      fetchUser: async () => {
        set({ loading: true });
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          try {
            const STRAPI_URL =
              process.env.NEXT_PUBLIC_STRAPI_URL ||
              "https://screen.net.ar/strapi";
            const response = await axios.get(`${STRAPI_URL}/api/users/me`);
            set({
              user: response.data,
              userId: response.data.id,
              loading: false,
            });
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
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
