import Header from "../components/Header";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaRegCommentDots,
  FaRegHeart,
  FaEdit,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { postService, commentService } from "../services/api";
import CommentCard from "../components/CommentCard";
import { useState, useEffect, useCallback } from "react";
import EditPostModal from "../components/EditPostModal";
import type { Post, Comment } from "../types/post";
import { useAuth } from "../contexts/AuthContext";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleEditPost = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Função para atualizar likes de comentários
  const handleCommentLikeUpdate = (commentId: string, newLikes: number) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === commentId ? { ...comment, likes: newLikes } : comment
      )
    );
  };

  // Função para carregar dados do post
  const loadPost = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log("Carregando post com ID:", id);
      const response = await postService.getPostById(id);
      if (response.success) {
        console.log("Post carregado:", response.data);
        setPost(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar post:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const handlePostUpdated = () => {
    // Recarregar o post após edição
    loadPost();
  };

  // Carregar dados do post
  useEffect(() => {
    loadPost();
  }, [id, loadPost]);

  // Carregar comentários do post
  useEffect(() => {
    const loadComments = async () => {
      if (!id) {
        return;
      }

      try {
        console.log("Carregando comentários para post ID:", id);
        const response = await commentService.getCommentsByPost(id);
        if (response.success) {
          setComments(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar comentários:", error);
      }
    };

    loadComments();
  }, [id]);

  // Função para adicionar comentário
  const handleAddComment = async () => {
    if (!newComment.trim() || !id || !user) return;

    try {
      setIsSubmittingComment(true);
      const response = await commentService.createComment({
        content: newComment.trim(),
        postId: id,
      });

      if (response.success) {
        setNewComment("");
        // Recarregar comentários
        const commentsResponse = await commentService.getCommentsByPost(id);
        if (commentsResponse.success) {
          setComments(commentsResponse.data);
        }

        // Atualizar contador de comentários no post
        if (post) {
          setPost({
            ...post,
            comments: (post.comments || 0) + 1,
          });
        }
      }
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      alert("Erro ao adicionar comentário. Tente novamente.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Função para dar like no post
  const handleToggleLike = async () => {
    if (!id || !user) return;

    try {
      const response = await postService.toggleLike(id);
      if (response.success && post) {
        setPost({
          ...post,
          likes: response.data.likesCount,
        });
      }
    } catch (error) {
      console.error("Erro ao dar like:", error);
    }
  };

  // Função para abrir confirmação de delete com toast
  const handleDeletePost = () => {
    if (!id || !user || !post) return;

    if (post.author._id !== user._id) {
      toast.error("Você só pode deletar seus próprios posts.");
      return;
    }

    // Mostrar toast de confirmação personalizado
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col items-center space-y-4 p-6">
          <p className="text-lg font-semibold text-gray-800 text-center">
            Tem certeza que quer deletar o post?
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                closeToast();
                handleConfirmDelete();
              }}
              className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-400 text-white rounded-lg hover:from-orange-700 hover:to-orange-500 transition-all duration-200 font-medium"
            >
              Sim
            </button>
            <button
              onClick={closeToast}
              className="px-6 py-2 border-2 border-orange-500 text-orange-500 bg-white rounded-lg hover:bg-orange-50 transition-all duration-200 font-medium"
            >
              Não
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        className: "toast-custom",
      }
    );
  };

  // Função para confirmar delete
  const handleConfirmDelete = async () => {
    if (!id) return;

    try {
      const response = await postService.deletePost(id);
      if (response.success) {
        toast.success("Post deletado com sucesso ✅");
        navigate("/posts");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Erro desconhecido";
      toast.error(`Erro ao deletar post: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando post...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Post não encontrado.</p>
            <button
              onClick={() => navigate("/posts")}
              className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Voltar para Posts
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-4 md:py-6">
        <h1 className="text-center text-orange-500 text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 md:mb-6">
          {post.title}
        </h1>

        <img
          src={post.imageSrc}
          alt={post.title}
          className="w-full h-48 sm:h-64 md:h-72 lg:h-96 object-cover rounded-md mb-4 md:mb-6"
        />

        <div className="mb-4 md:mb-6">
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            {post.content}
          </p>
        </div>

        <div className="mt-4 md:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 md:gap-6 text-orange-500 text-sm md:text-base">
            <button
              onClick={handleToggleLike}
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-3 py-1 rounded-xl hover:bg-orange-600 transition-colors"
            >
              <FaRegHeart /> {post.likes || 0}
            </button>
            <span className="inline-flex items-center gap-2">
              <FaRegCommentDots /> {post.comments || 0}
            </span>
            <span className="text-gray-500 text-xs">
              {new Date(post.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Botões de ação - apenas para o dono do post */}
            {user && post.author._id === user._id && (
              <>
                <button
                  onClick={handleEditPost}
                  className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  title="Editar post"
                >
                  <FaEdit size={14} className="md:hidden" />
                  <FaEdit size={16} className="hidden md:block" />
                </button>
                <button
                  onClick={handleDeletePost}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  title="Deletar post"
                >
                  <FaTrash size={14} className="md:hidden" />
                  <FaTrash size={16} className="hidden md:block" />
                </button>
              </>
            )}
            {/* Avatar e nome do autor */}
            <div className="flex items-center gap-2">
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/profile/${post.author._id}`)}
              >
                {post.author.profileImage ? (
                  <img
                    src={post.author.profileImage}
                    alt={post.author.name}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 flex items-center justify-center hover:opacity-80 transition-opacity">
                    <FaUser className="text-gray-500 text-xs md:text-sm" />
                  </div>
                )}
              </div>
              <span className="text-xs md:text-sm text-gray-600 font-medium">
                {post.author.name}
              </span>
            </div>
          </div>
        </div>

        {/* Seção de Comentários */}
        <div className="mt-6 md:mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">
            Comentários
          </h2>

          {/* Lista de comentários */}
          <div className="mb-4 md:mb-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentCard
                  key={comment._id}
                  comment={comment}
                  onLikeUpdate={handleCommentLikeUpdate}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm md:text-base">
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </p>
            )}
          </div>

          {/* Campo para adicionar comentário */}
          {user && (
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border">
              <textarea
                placeholder="Escreva algo..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full h-20 md:h-24 p-3 md:p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || isSubmittingComment}
                className="mt-3 md:mt-4 bg-gradient-to-r from-orange-600 to-orange-400 text-white px-4 md:px-6 py-2 rounded-lg font-medium hover:from-orange-700 hover:to-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {isSubmittingComment
                  ? "Adicionando..."
                  : "Adicionar comentário"}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Editar Post */}
      {post && (
        <EditPostModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          post={post}
          onPostUpdated={handlePostUpdated}
        />
      )}
    </div>
  );
}

export default PostDetail;
