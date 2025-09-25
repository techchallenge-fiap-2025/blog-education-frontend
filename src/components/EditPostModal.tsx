import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { postService } from "../services/api";
import type { Post } from "../types/post";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onPostUpdated?: () => void;
}

function EditPostModal({
  isOpen,
  onClose,
  post,
  onPostUpdated,
}: EditPostModalProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Preencher formulário quando o post for selecionado
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setDescription(post.content); // Usar content em vez de excerpt para edição
      setImagePreview(post.imageSrc);
      setImage(null);
    }
  }, [post]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações específicas com mensagens personalizadas
    if (!title && !description) {
      toast.error("Post não pode ser editado sem um título e descrição ❌");
      return;
    }

    if (!title) {
      toast.error("Post não pode ser editado sem um título ❌");
      return;
    }

    if (!description) {
      toast.error("Post não pode ser editado sem uma descrição ❌");
      return;
    }

    if (description.length < 50) {
      toast.error(
        "Post não pode ser editado, descrição tem que ter mais de 50 caracteres ❌"
      );
      return;
    }

    setIsLoading(true);

    try {
      let imageSrc = post?.imageSrc; // Manter imagem atual por padrão

      // Se uma nova imagem foi selecionada, converter para base64
      if (image) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          imageSrc = e.target?.result as string;
          await updatePost(imageSrc);
        };
        reader.readAsDataURL(image);
      } else {
        await updatePost(imageSrc || "");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(`Erro ao processar imagem: ${errorMessage}`);
      setIsLoading(false);
    }

    async function updatePost(imageSrc: string) {
      try {
        if (!post) return;

        const postData = {
          title,
          content: description,
          excerpt: description.substring(0, 200), // Criar excerpt a partir do conteúdo
          imageSrc,
        };

        await postService.updatePost(post._id, postData);

        // Mostrar mensagem de sucesso
        toast.success("Post editado com sucesso ✅");

        // Limpar formulário e fechar modal
        clearForm();
        onClose();

        // Notificar componente pai
        if (onPostUpdated) {
          onPostUpdated();
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : (error as { response?: { data?: { message?: string } } }).response
                ?.data?.message || "Erro desconhecido";
        toast.error(`Erro ao editar post: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Função para limpar todos os campos do formulário (apenas após edição bem-sucedida)
  const clearForm = () => {
    setImage(null);
    setImagePreview("");
    setTitle("");
    setDescription("");
  };

  // Função para fechar o modal sem limpar campos
  const handleClose = () => {
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl relative bg-white rounded-2xl p-6 shadow-lg">
        {/* Container principal com gradiente laranja */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl p-8 mb-6 relative">
          {/* Botão X no canto superior direito */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors z-10"
          >
            <FaTimes size={24} />
          </button>
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Editar Post
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Imagem */}
            <div>
              <label className="block text-white font-medium mb-2">
                Imagem
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 rounded-xl bg-white border-0 focus:outline-none focus:ring-2 focus:ring-white text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
              )}
            </div>

            {/* Campo Título */}
            <div>
              <label className="block text-white font-medium mb-2">
                Título
              </label>
              <input
                type="text"
                placeholder="Título do post"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border-0 focus:outline-none focus:ring-2 focus:ring-white text-gray-800 placeholder-gray-400"
                required
              />
            </div>

            {/* Campo Descrição */}
            <div>
              <label className="block text-white font-medium mb-2">
                Descrição
              </label>
              <textarea
                placeholder="Descrição do post"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 rounded-xl bg-white border-0 focus:outline-none focus:ring-2 focus:ring-white text-gray-800 placeholder-gray-400 resize-none"
                required
              />
            </div>
          </form>
        </div>

        {/* Botão Salvar */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-400 text-white font-bold py-3 px-6 rounded-xl hover:from-orange-700 hover:to-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </div>
  );
}

export default EditPostModal;
