interface CompanyState {
  companies: ICompany[];
  loading: boolean;
  submitting: boolean;
  fetchCompanies: () => Promise<void>;
  addCompany: (company: IAddNewCompany) => Promise<Company>;
  updateCompany: (id: number, company: Partial<Company>) => Promise<Company>;
  deleteCompany: (id: number) => Promise<void>;
}

interface Company {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  is_active: boolean;
}

interface ICompany {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  created_at: string;
  updated_at: string;
  ftp_username: string;
  ftp_password: string;
  is_active: boolean;
}

interface IAddNewCompany {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  is_active: boolean;
}
