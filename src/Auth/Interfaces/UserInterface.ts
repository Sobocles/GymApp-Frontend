// src/interfaces/UserInterface.ts

// src/interfaces/UserInterface.ts

export interface Role {
  authority: string;
}

export interface UserInterface {
  id: string;
  username: string;
  password?: string;   // Ahora opcional
  email: string;
  admin: boolean;
  trainer?: boolean;   // Ahora opcional
  role?: Role | string;
  roles?: Role[];      // Ahora opcional
  profileImageUrl?: string;
}





