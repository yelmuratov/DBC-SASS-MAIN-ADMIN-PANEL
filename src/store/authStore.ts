import { create } from "zustand";
import Cookies from "js-cookie";
import api from "@/lib/api";

interface AuthState {
  user: string | null;
  isSuperUser: boolean | undefined;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isSuperUser: undefined, 
  isAuthenticated: false,

  // Login function
  login: async (username, password) => {
    try {
      const { data } = await api.post("/users/login/", { username, password });

      console.log("Login Response:", data); 

      Cookies.set("access_token", data.data.access, { path: "/", secure: true });
      Cookies.set("refresh_token", data.data.refresh, { path: "/", secure: true });

      set({
        user: data.data.username,
        isSuperUser: true,
        isAuthenticated: true,
      });

      console.log("State after login:", {
        user: data.data.username,
        isSuperUser: true,
        isAuthenticated: true,
      });
    } catch (error) {
      throw new Error("Login failed.");
    }
  },

  // Logout function
  logout: () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    set({ user: null, isSuperUser: false, isAuthenticated: false });
    window.location.href = "/login";
  },

  // Load User function
  loadUser: async () => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      set({ user: null, isSuperUser: false, isAuthenticated: false });
      return;
    }

    try {
      const { data } = await api.get("/users/me/");
      console.log("User Load Response:", data); 

      set({
        user: data.first_name,
        isSuperUser: true,
        isAuthenticated: true,
      });

      console.log("State after loadUser:", {
        user: data.first_name,
        isSuperUser: true,
        isAuthenticated: true,
      });
    } catch (error) {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      set({ user: null, isSuperUser: false, isAuthenticated: false });
    }
  },
}));
