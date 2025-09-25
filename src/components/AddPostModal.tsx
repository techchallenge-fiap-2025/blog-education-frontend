import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { postService } from "../services/api";

interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

function AddPostModal({ isOpen, onClose, onPostCreated }: AddPostModalProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    if (!image && !title && !description) {
      toast.error("Post não adicionado ❌");
      return;
    }

    if (!image) {
      toast.error("Post não pode ser adicionado sem uma imagem ❌");
      return;
    }

    if (!title) {
      toast.error("Post não pode ser adicionado sem um título ❌");
      return;
    }

    if (!description) {
      toast.error("Post não pode ser adicionado sem uma descrição ❌");
      return;
    }

    if (description.length < 50) {
      toast.error(
        "Post não pode ser adicionado, descrição tem que ter mais de 50 caracteres ❌"
      );
      return;
    }

    setIsLoading(true);

    try {
      // Converter imagem para base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;

        try {
          const postData = {
            title,
            content: description,
            excerpt: description.substring(0, 200), // Criar excerpt a partir do conteúdo
            imageSrc: base64Image,
          };

          console.log("Dados do post sendo enviados:", postData);

          await postService.createPost(postData);

          // Mostrar mensagem de sucesso
          toast.success("Post adicionado com sucesso ✅");

          // Limpar formulário e fechar modal
          clearForm();
          onClose();

          // Notificar componente pai
          if (onPostCreated) {
            onPostCreated();
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : (error as { response?: { data?: { message?: string } } })
                  .response?.data?.message || "Erro desconhecido";
          toast.error(`Erro ao criar post: ${errorMessage}`);
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(image);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(`Erro ao processar imagem: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  // Função para limpar todos os campos do formulário
  const clearForm = () => {
    setImage(null);
    setImagePreview("");
    setTitle("");
    setDescription("");
  };

  // Função para fechar o modal e limpar os campos
  const handleClose = () => {
    clearForm();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

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
            Adicionar Post
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
                required
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

        {/* Botão Cadastrar */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-400 text-white font-bold py-3 px-6 rounded-xl hover:from-orange-700 hover:to-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Criando..." : "Cadastrar"}
        </button>
      </div>
    </div>
  );
}

export default AddPostModal;
