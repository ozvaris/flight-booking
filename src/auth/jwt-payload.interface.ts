export interface JwtPayload {
    email: string;
    sub: number; // or string, depending on the type of your user ID
    roles: string[];
  }