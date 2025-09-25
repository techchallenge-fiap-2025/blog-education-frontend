import Header from "../components/Header";
import {
  FaSearch,
  FaPlus,
  FaRegCommentDots,
  FaRegHeart,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import AddPostModal from "../components/AddPostModal";
import { useAuth } from "../contexts/AuthContext";
import { postService } from "../services/api";
import type { Post } from "../types/post";

function Posts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Carregar posts
  const loadPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await postService.getPosts({ search: searchTerm });
      setPosts(response.data);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
      alert("Erro ao carregar posts");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  // Carregar posts na montagem do componente
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Recarregar posts quando termo de busca mudar
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPosts();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [loadPosts]);

  // Função para recarregar posts após criar um novo
  const handlePostCreated = () => {
    loadPosts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Barra superior com título e busca */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-400">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <h1 className="text-white text-xl md:text-2xl font-semibold">
            Posts
          </h1>
          <div className="w-full sm:flex-1 sm:max-w-md relative">
            <input
              placeholder="Buscar ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full pl-10 pr-4 py-2 text-sm outline-none bg-white text-gray-800 placeholder-gray-400 shadow"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Lista de posts */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-4 md:space-y-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg md:text-xl">
              Nenhum post encontrado
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl md:rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
              onClick={() => navigate(`/posts/${post._id}`)}
            >
              <div className="flex flex-col md:flex-row">
                {/* Imagem do post */}
                <div className="w-full md:w-1/2">
                  <img
                    src={post.imageSrc}
                    alt={post.title}
                    className="w-full h-48 md:h-80 object-cover"
                  />
                </div>

                {/* Conteúdo do post */}
                <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4 gap-2">
                      <h2 className="text-orange-500 text-xl md:text-3xl font-bold line-clamp-2">
                        {post.title}
                      </h2>
                      <div className="text-gray-500 text-xs md:text-sm">
                        {new Date(post.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 md:mb-6 line-clamp-3">
                      {post.content.substring(0, 150)}...
                    </p>
                  </div>

                  {/* Área inferior com likes, comentários e autor */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {/* Likes e comentários */}
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="flex items-center gap-1 md:gap-2">
                        <FaRegHeart className="text-orange-500 text-lg md:text-xl" />
                        <span className="text-orange-500 font-semibold text-base md:text-lg">
                          {post.likes || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2">
                        <FaRegCommentDots className="text-orange-500 text-lg md:text-xl" />
                        <span className="text-orange-500 font-semibold text-base md:text-lg">
                          {post.comments || 0}
                        </span>
                      </div>
                    </div>

                    {/* Avatar e nome do autor */}
                    <div className="flex items-center gap-2 md:gap-3">
                      <div
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que o clique no avatar abra o post
                          // Se o usuário logado for o dono do post, vai para o perfil próprio
                          // Se não for, vai para o perfil do autor
                          if (user?._id === post.author._id) {
                            navigate("/profile");
                          } else {
                            navigate(`/profile/${post.author._id}`);
                          }
                        }}
                      >
                        {post.author.profileImage ? (
                          <img
                            src={post.author.profileImage}
                            alt={post.author.name}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover hover:opacity-80 transition-opacity"
                          />
                        ) : (
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition-colors">
                            <FaUser className="text-gray-500 text-xs md:text-sm" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs md:text-sm font-medium text-gray-700">
                          {post.author.name}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {post.author.userType}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Botão flutuante - Apenas para Professores */}
      {user?.userType === "professor" && (
        <button
          onClick={() => setIsAddPostModalOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center shadow-lg z-10"
        >
          <FaPlus className="text-sm md:text-base" />
        </button>
      )}

      {/* Modal de Adicionar Post */}
      <AddPostModal
        isOpen={isAddPostModalOpen}
        onClose={() => setIsAddPostModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}

export default Posts;
