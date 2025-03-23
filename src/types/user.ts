export interface IUser {
    username: string;
    refresh: string;
    access: string;
    is_superuser: boolean;
}

interface IMetadata {
    timestamp: string;
    version: string;
}

export interface IApiResponse {
    status: string;
    code: number;
    data: IUser;
    metadata: IMetadata;
}

export interface IUserMe{
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    company: number;
    user_company: {
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
    };
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone?: string;
    role: string;
    company: number; // Company ID
  }
  
  export interface UserState {
    users: IUserMe[];
    loading: boolean;
    submitting: boolean;
    fetchUsers: () => Promise<void>;
    addUser: (user: Omit<IUserMe, "id" | "user_company">) => Promise<void>;
    updateUser: (id: number, user: Partial<IUserMe>) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
  }