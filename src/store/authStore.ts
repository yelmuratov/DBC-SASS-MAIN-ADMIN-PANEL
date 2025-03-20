import { create } from "zustand";
import Cookies from "js-cookie";
import api from "@/lib/api";

interface AuthState {
  user: IUserMe | null;
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
      Cookies.set("access_token", data.data.access, { path: "/", secure: true });
      Cookies.set("refresh_token", data.data.refresh, { path: "/", secure: true });

      set({
        user: data.data.username,
        isSuperUser: data.data.is_superuser,
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
      console.log(data.data);
      set({
        user: data.data,
        isSuperUser: data.data.is_superuser,
        isAuthenticated: true,
      });
    } catch (error) {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      set({ user: null, isSuperUser: false, isAuthenticated: false });
    }
  },
}));
