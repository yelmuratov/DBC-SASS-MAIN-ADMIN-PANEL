import { create } from "zustand";
import api from "@/lib/api";

export const useCompanyStore = create<CompanyState>((set) => ({
  companies: [],
  loading: false,
  submitting: false,

  fetchCompanies: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get<{ data: ICompany[] }>("/company/");
      set({ companies: data.data, loading: false });
      console.log("Fetched companies:", data.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
      set({ loading: false });
    }
  },

  addCompany: async (company: Omit<Company, "id">) => {
    set({ submitting: true });
    try {
      const { data } = await api.post<ICompany>("/company/", company);
      set((state) => {
        const newCompanies = [...state.companies, data];
        console.log("Adding company, new state:", newCompanies);
        return { companies: newCompanies, submitting: false };
      });
      return data;
    } catch (error) {
      console.error("Error adding company:", error);
      set({ submitting: false });
      throw error;
    }
  },

  updateCompany: async (id: string | number, company: Partial<Company>) => {
    set({ submitting: true });
    try {
      const { data } = await api.put<ICompany>(`/company/${id}/`, company);
      set((state) => {
        const newCompanies = state.companies.map((c) =>
          c.id === id ? { ...c, ...data } : c
        );
        console.log("Updating company, new state:", newCompanies);
        return { companies: newCompanies, submitting: false };
      });
      return data;
    } catch (error) {
      console.error("Error updating company:", error);
      set({ submitting: false });
      throw error;
    }
  },

  deleteCompany: async (id: string | number) => {
    set({ submitting: true });
    try {
      await api.delete(`/company/${id}/`);
      set((state) => {
        const newCompanies = state.companies.filter((c) => c.id !== id);
        console.log("Deleting company, new state:", newCompanies);
        return { companies: newCompanies, submitting: false };
      });
    } catch (error) {
      console.error("Error deleting company:", error);
      set({ submitting: false });
      throw error;
    }
  },
}));