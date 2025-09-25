import {
  FaArrowLeft,
  FaRegHeart,
  FaRegCommentDots,
  FaUserCircle,
  FaCamera,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { postService, authService } from "../services/api";
import type { User } from "../types/user";
import type { Post } from "../types/post";

function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId?: string }>();
  const { user, logout, updateUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Carregar dados do perfil
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);

        if (userId) {
          // Carregar perfil de outro usuário
          const response = await authService.getUserById(userId);
          if (response.success) {
            setProfileUser(response.data);
            setIsOwnProfile(false);
          } else {
            console.error("Erro ao carregar perfil do usuário:", response);
            // Fallback para o usuário logado se não conseguir carregar
            setProfileUser(user);
            setIsOwnProfile(false);
          }
        } else {
          // Perfil próprio
          setProfileUser(user);
          setIsOwnProfile(true);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
        // Fallback para o usuário logado em caso de erro
        setProfileUser(user);
        setIsOwnProfile(!userId);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [userId, user]);

  // Carregar posts do usuário
  useEffect(() => {
    const loadUserPosts = async () => {
      if (profileUser?.userType === "professor") {
        try {
          const response = await postService.getPosts();
          const userPosts = response.data.filter(
            (post) => post.author._id === profileUser._id
          );
          setUserPosts(userPosts);
        } catch (error) {
          console.error("Erro ao carregar posts do usuário:", error);
        }
      }
    };

    loadUserPosts();
  }, [profileUser?._id, profileUser?.userType]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione apenas arquivos de imagem.");
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB.");
      return;
    }

    setIsUploading(true);

    try {
      // Converter para base64 para simular upload
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;

        // Simular upload - em uma aplicação real, você enviaria para o backend
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Atualizar perfil com nova imagem
        await updateUser({ profileImage: base64 });

        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao fazer upload da imagem. Tente novamente.";
      alert(`Erro: ${errorMessage}`);
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-xl">Usuário não encontrado</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header com botão voltar e logout */}
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-black hover:text-gray-600 transition-colors"
        >
          <FaArrowLeft size={20} className="md:hidden" />
          <FaArrowLeft size={24} className="hidden md:block" />
        </button>
        {isOwnProfile && (
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="text-red-500 hover:text-red-600 font-medium text-sm md:text-base"
          >
            Sair
          </button>
        )}
      </div>

      <main className="max-w-6xl mx-auto px-4 pb-6 md:pb-8">
        {/* Informações do perfil */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="flex flex-col items-center">
            <div className="relative group mb-3 md:mb-4">
              {isOwnProfile ? (
                <label htmlFor="profile-image" className="cursor-pointer">
                  {profileUser?.profileImage ? (
                    <img
                      src={profileUser.profileImage}
                      alt={profileUser?.name || "Usuário"}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover hover:opacity-80 transition-opacity"
                    />
                  ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition-colors">
                      <FaUserCircle
                        size={60}
                        className="text-gray-500 md:hidden"
                      />
                      <FaUserCircle
                        size={80}
                        className="text-gray-500 hidden md:block"
                      />
                    </div>
                  )}

                  {/* Overlay com hover */}
                  <div className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-center text-white">
                      <FaCamera size={16} className="mx-auto mb-1 md:hidden" />
                      <FaCamera
                        size={24}
                        className="mx-auto mb-1 hidden md:block"
                      />
                      <span className="text-xs md:text-sm font-medium">
                        Escolher foto
                      </span>
                    </div>
                  </div>

                  {/* Loading overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-white mx-auto mb-1 md:mb-2"></div>
                        <span className="text-xs md:text-sm">Enviando...</span>
                      </div>
                    </div>
                  )}

                  {/* Input de arquivo oculto */}
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div>
                  {profileUser?.profileImage ? (
                    <img
                      src={profileUser.profileImage}
                      alt={profileUser?.name || "Usuário"}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-300 flex items-center justify-center">
                      <FaUserCircle
                        size={60}
                        className="text-gray-500 md:hidden"
                      />
                      <FaUserCircle
                        size={80}
                        className="text-gray-500 hidden md:block"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <h1 className="text-orange-500 text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-center">
              {profileUser?.name || "Usuário"}
            </h1>
          </div>

          <div className="flex-1 w-full md:w-auto">
            <div className="space-y-1 md:space-y-2 text-gray-700 text-sm md:text-base">
              <p>
                <span className="font-medium">Tipo:</span>{" "}
                {profileUser?.userType === "professor" ? "Professor" : "Aluno"}
              </p>
              <p>
                <span className="font-medium">Email:</span> {profileUser?.email}
              </p>
              <p>
                <span className="font-medium">Escola:</span>{" "}
                {profileUser?.school}
              </p>
              <p>
                <span className="font-medium">Idade:</span> {profileUser?.age}{" "}
                anos
              </p>
              {profileUser?.userType === "aluno" && (
                <>
                  <p>
                    <span className="font-medium">Turma:</span>{" "}
                    {profileUser?.class}
                  </p>
                  <p>
                    <span className="font-medium">Responsável:</span>{" "}
                    {profileUser?.guardian}
                  </p>
                </>
              )}
              {profileUser?.userType === "professor" &&
                profileUser?.subjects &&
                profileUser.subjects.length > 0 && (
                  <p>
                    <span className="font-medium">Matérias:</span>{" "}
                    {profileUser.subjects.join(", ")}
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* Seção de Posts - Apenas para Professores */}
        {profileUser?.userType === "professor" && (
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">
              {isOwnProfile ? "Meus Posts:" : `Posts de ${profileUser.name}:`}
            </h2>

            {userPosts.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-600 text-base md:text-lg">
                  {isOwnProfile
                    ? "Você ainda não criou nenhum post."
                    : "Este usuário ainda não criou nenhum post."}
                </p>
                {isOwnProfile && (
                  <button
                    onClick={() => navigate("/posts")}
                    className="mt-3 md:mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors text-sm md:text-base"
                  >
                    Criar Primeiro Post
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {userPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-lg shadow-sm border overflow-hidden cursor-pointer hover:shadow-md transition-shadow group relative"
                    onClick={() => navigate(`/posts/${post._id}`)}
                  >
                    <div className="relative">
                      <img
                        src={post.imageSrc}
                        alt={post.title}
                        className="w-full h-24 md:h-32 object-cover"
                      />
                    </div>

                    <div className="p-2 md:p-3">
                      <h3 className="text-xs md:text-sm font-medium text-gray-800 mb-1 md:mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaRegCommentDots className="text-xs" />{" "}
                          {post.comments || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaRegHeart className="text-xs" /> {post.likes || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mensagem para Alunos */}
        {profileUser?.userType === "aluno" && (
          <div className="text-center py-8 md:py-12">
            <div className="bg-gray-100 rounded-xl p-6 md:p-8 max-w-md mx-auto">
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-3 md:mb-4">
                Olá, {profileUser?.name}!
              </h3>
              <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
                Como aluno, você pode visualizar e interagir com os posts dos
                professores.
              </p>
              <button
                onClick={() => navigate("/posts")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors text-sm md:text-base"
              >
                Ver Posts dos Professores
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;
