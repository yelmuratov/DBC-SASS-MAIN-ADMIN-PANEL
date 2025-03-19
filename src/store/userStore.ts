import { create } from "zustand";
import api from "@/lib/api";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  addUser: (user: Omit<User, "id">) => Promise<void>;
  updateUser: (id: number, user: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/users/register");
      set({ users: data, loading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ loading: false });
    }
  },

  addUser: async (user) => {
    try {
      const { data } = await api.post("/users/register", user);
      set((state) => ({ users: [...state.users, data] }));
    } catch (error) {
      console.error("Error adding user:", error);
    }
  },

  updateUser: async (id, user) => {
    try {
      await api.put(`/users/user/${id}/`, user);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, ...user } : u)),
      }));
    } catch (error) {
      console.error("Error updating user:", error);
    }
  },

  deleteUser: async (id) => {
    try {
      await api.delete(`/users/user/${id}/`);
      set((state) => ({ users: state.users.filter((u) => u.id !== id) }));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  },
}));
