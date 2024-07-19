// src/auth/user-without-password.interface.ts

export interface UserWithoutPassword {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    googleId?: string;
    facebookId?: string;
    roles: string[];
    createdAt: Date;
    updatedAt: Date;
  }
  