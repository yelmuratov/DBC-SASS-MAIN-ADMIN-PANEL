interface AuthState {
  user: string | null;
  isSuperUser: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => void;
}
