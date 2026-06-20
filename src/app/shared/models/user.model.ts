export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;          // 'DOCENTE', 'STUDENT', 'ADMIN'
  isActive: boolean;     // Aprobación del administrador
  status: string;        // 'PENDING', 'VERIFIED'
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleName: string;
  courses?: string[];
}