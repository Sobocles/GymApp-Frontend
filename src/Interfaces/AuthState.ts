import { UserInterface } from "./UserInterface";


export interface AuthState {
  status: 'checking' | 'authenticated' | 'not-authenticated';
  user: UserInterface | null;
  isAuth: boolean;
  isAdmin: boolean;
  trainer?: boolean;
  roles: string[]; // Array de roles en formato string
  token: string | null;
  profileImageUrl?: string; 
  errorMessage?: string;
}

