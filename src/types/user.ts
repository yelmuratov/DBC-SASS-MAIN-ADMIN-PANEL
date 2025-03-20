interface IUser {
    username: string;
    refresh: string;
    access: string;
    is_superuser: boolean;
}

interface IMetadata {
    timestamp: string;
    version: string;
}

interface IApiResponse {
    status: string;
    code: number;
    data: IUser;
    metadata: IMetadata;
}

interface IUserMe{
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

interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone?: string;
    role: string;
    company: number; // Company ID
  }
  
  interface UserState {
    users: User[];
    loading: boolean;
    submitting: boolean;
    fetchUsers: () => Promise<void>;
    addUser: (user: Omit<User, "id">) => Promise<void>;
    updateUser: (id: number, user: Partial<User>) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
  }