import { create } from "zustand";
import api from "@/lib/api";
import { User, UserState } from "@/types/user";

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  submitting: false,

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get<{ data: User[] }>("/users/register/");
      set({ users: data.data, loading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ loading: false });
    }
  },

  addUser: async (user: Omit<User, "id">) => {
    set({ submitting: true });
    try {
      const { data } = await api.post<User>("/users/register/", user);
      set((state) => ({
        users: [...state.users, data],
        submitting: false,
      }));
    } catch (error) {
      console.error("Error adding user:", error);
      set({ submitting: false });
      throw error;
    }
  },

  updateUser: async (id: number, user: Partial<User>) => {
    set({ submitting: true });
    try {
      const { data } = await api.put<User>(`/users/user/${id}/`, user);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
        submitting: false,
      }));
    } catch (error) {
      console.error("Error updating user:", error);
      set({ submitting: false });
      throw error;
    }
  },

  deleteUser: async (id: number) => {
    set({ submitting: true });
    try {
      await api.delete(`/users/user/${id}/`);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        submitting: false,
      }));
    } catch (error) {
      console.error("Error deleting user:", error);
      set({ submitting: false });
      throw error;
    }
  },
}));