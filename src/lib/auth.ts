import api from "./api";
import Cookies from "js-cookie";

export const login = async (username: string, password: string) => {
  try {
    const { data } = await api.post("/users/login/", { username, password });

    // Store Tokens in Cookies
    Cookies.set("access_token", data.data.access, { path: "/" });
    Cookies.set("refresh_token", data.data.refresh, { path: "/" });

    return data.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
