export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  imageSrc: string;
  likes: number;
  comments: number;
  author: string;
  authorImage?: string;
}

export interface Comment {
  id: number;
  postId: number;
  author: string;
  avatarSrc?: string;
  text: string;
  likes: number;
  replies: number;
}

// Mock data removido - usando dados reais da API

export const postsMock: Post[] = [];

export function getPostById(id: number): Post | undefined {
  return postsMock.find((p) => p.id === id);
}

export const commentsMock: Comment[] = [
  {
    id: 1,
    postId: 1,
    author: "José Matos",
    avatarSrc: "/images/Imagem1.png",
    text: "Aqui você encontra conteúdos educativos de qualidade para aprender, revisar e se inspirar. Nosso objetivo é tornar o conhecimento acessível e prático, ajudando estudantes, professores e curiosos a explorarem novas ideias todos os dias.",
    likes: 12,
    replies: 3,
  },
  {
    id: 2,
    postId: 1,
    author: "Maria Silva",
    text: "Excelente post! Muito útil para quem está começando.",
    likes: 8,
    replies: 1,
  },
  {
    id: 3,
    postId: 1,
    author: "João Pereira",
    text: "Gostei muito da didática. Parabéns!",
    likes: 5,
    replies: 0,
  },
  {
    id: 4,
    postId: 1,
    author: "Ana Costa",
    text: "Poderiam fazer mais posts sobre este tema.",
    likes: 2,
    replies: 0,
  },
  {
    id: 5,
    postId: 1,
    author: "Pedro Santos",
    text: "Muito bom! Aprendi bastante.",
    likes: 10,
    replies: 2,
  },
  {
    id: 6,
    postId: 1,
    author: "Carla Oliveira",
    text: "Conteúdo de alta qualidade, como sempre!",
    likes: 7,
    replies: 0,
  },
];

export function getCommentsByPostId(postId: number): Comment[] {
  return commentsMock.filter((c) => c.postId === postId);
}
