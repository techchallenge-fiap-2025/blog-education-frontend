import axios from "axios";
import type { User, LoginResponse } from "../types/user";
import type { Post, Comment } from "../types/post";

const API_BASE_URL = "http://localhost:3001/api";

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post("/users/login", { email, password });
    return response.data;
  },

  async register(userData: {
    name: string;
    email: string;
    password: string;
    school: string;
    age: number;
    userType: "professor" | "aluno";
    guardian?: string;
    class?: string;
    subjects?: string[];
  }): Promise<LoginResponse> {
    const response = await api.post("/users/register", userData);
    return response.data;
  },

  async getProfile(): Promise<{ success: boolean; data: User }> {
    const response = await api.get("/users/profile");
    return response.data;
  },

  async updateProfile(
    userData: Partial<User>
  ): Promise<{ success: boolean; data: User }> {
    const response = await api.put("/users/profile", userData);
    return response.data;
  },

  async getUserById(userId: string): Promise<{ success: boolean; data: User }> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.put("/users/password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

// Serviços de posts
export const postService = {
  async getPosts(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ success: boolean; data: Post[]; pagination: any }> {
    const response = await api.get("/posts", { params });
    return response.data;
  },

  async getPopularPosts(
    limit: number = 3
  ): Promise<{ success: boolean; data: Post[] }> {
    const response = await api.get(`/posts/popular?limit=${limit}`);
    return response.data;
  },

  async getPostById(id: string): Promise<{ success: boolean; data: Post }> {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  async createPost(postData: {
    title: string;
    content: string;
    excerpt: string;
    imageSrc: string;
  }): Promise<{ success: boolean; data: Post }> {
    const response = await api.post("/posts", postData);
    return response.data;
  },

  async updatePost(
    id: string,
    postData: {
      title?: string;
      content?: string;
      excerpt?: string;
      imageSrc?: string;
    }
  ): Promise<{ success: boolean; data: Post }> {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  async deletePost(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  async toggleLike(id: string): Promise<{
    success: boolean;
    data: { liked: boolean; likesCount: number };
  }> {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },

  async addComment(
    id: string,
    content: string
  ): Promise<{ success: boolean; data: any }> {
    const response = await api.post(`/posts/${id}/comment`, { content });
    return response.data;
  },
};

// Serviços de comentários
export const commentService = {
  async getCommentsByPost(
    postId: string,
    params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }
  ): Promise<{ success: boolean; data: Comment[]; pagination: any }> {
    const response = await api.get(`/comments/post/${postId}`, { params });
    return response.data;
  },

  async createComment(commentData: {
    content: string;
    postId: string;
    parentCommentId?: string;
  }): Promise<{ success: boolean; data: Comment }> {
    const response = await api.post(`/posts/${commentData.postId}/comment`, {
      content: commentData.content,
    });
    return response.data;
  },

  async updateComment(
    id: string,
    content: string
  ): Promise<{ success: boolean; data: Comment }> {
    const response = await api.put(`/comments/${id}`, { content });
    return response.data;
  },

  async deleteComment(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },

  async toggleCommentLike(
    id: string
  ): Promise<{ success: boolean; data: { likes: number; liked: boolean } }> {
    const response = await api.put(`/comments/${id}/like`);
    return response.data;
  },
};

// Serviços de upload
export const uploadService = {
  async uploadImage(
    file: File
  ): Promise<{ success: boolean; data: { url: string; filename: string } }> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async uploadImages(files: File[]): Promise<{
    success: boolean;
    data: Array<{ url: string; filename: string }>;
  }> {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const response = await api.post("/upload/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async deleteImage(
    filename: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/upload/image/${filename}`);
    return response.data;
  },

  async listImages(): Promise<{
    success: boolean;
    data: Array<{ url: string; filename: string; size: number }>;
  }> {
    const response = await api.get("/upload/images");
    return response.data;
  },
};

export default api;
