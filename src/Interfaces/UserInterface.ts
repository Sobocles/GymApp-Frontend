// src/interfaces/UserInterface.ts

// src/interfaces/UserInterface.ts

export interface Role {
  authority: string;
}

export interface TrainerDetails {
  specialization?: string;
  experienceYears?: number;
  availability?: boolean;
  monthlyFee?: number;
  title?: string;
  studies?: string;
  certifications?: string;
  description?: string;
  instagramUrl?: string;
  whatsappNumber?: string;
}

export interface UserInterface {
  id: number;
  username: string;
  password?: string;
  email: string;
  admin: boolean;
  trainer?: boolean;
  role?: Role | string;
  roles?: Role[];
  profileImageUrl?: string;
  // Detalles específicos de entrenadores
  trainerDetails?: TrainerDetails;
    /**
   * Campo opcional para adjuntar un archivo de certificación (PDF, imagen, etc.)
   * cuando se marca el usuario como Trainer.
   */
    certificationFile?: File;
}






