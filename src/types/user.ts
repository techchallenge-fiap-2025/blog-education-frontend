export interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  school: string;
  age: number;
  userType: "professor" | "aluno";
  guardian?: string;
  class?: string;
  subjects?: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}
