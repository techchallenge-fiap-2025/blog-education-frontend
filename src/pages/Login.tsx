import { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const from = "/home"; // Sempre redirecionar para home após login

  // Função para validar email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validações específicas com mensagens personalizadas
    if (!email && !password) {
      toast.error("Email e Senha são obrigatórios❌");
      setIsLoading(false);
      return;
    }

    if (!email) {
      toast.error("Email é obrigatório❌");
      setIsLoading(false);
      return;
    }

    if (!password) {
      toast.error("Senha é obrigatório❌");
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Email está incorreto❌");
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      // Verificar se é erro de credenciais inválidas
      if (
        err.message.includes("Credenciais inválidas" + JSON.stringify(err)) ||
        err.message.includes("401")
      ) {
        toast.error("Senha está incorreta❌");
      } else {
        toast.error(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      {/* Título Blog Edc */}
      <h1 className="text-3xl md:text-4xl font-bold text-orange-500 mb-8 md:mb-12">
        Blog Edc
      </h1>

      {/* Container do formulário */}
      <div className="w-full max-w-sm md:max-w-md">
        {/* Card principal com gradiente laranja */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl p-6 md:p-8 mb-4 md:mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6 md:mb-8">
            Entrar
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-200" />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 md:py-3 rounded-xl text-orange-600 placeholder-orange-400 bg-white border-0 focus:outline-none focus:ring-2 focus:ring-white text-sm md:text-base"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-200" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 md:py-3 rounded-xl text-orange-600 placeholder-orange-400 bg-white border-0 focus:outline-none focus:ring-2 focus:ring-white text-sm md:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-200 hover:text-orange-300"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-sm md:text-base" />
                  ) : (
                    <FaEye className="text-sm md:text-base" />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Link "Esqueceu a senha" */}
        <div className="text-right mb-6 md:mb-8">
          <button className="text-orange-500 hover:text-orange-600 text-xs md:text-sm">
            Esqueceu a senha ?
          </button>
        </div>

        {/* Botão Entrar */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-400 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-xl hover:from-orange-700 hover:to-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </div>
  );
}

export default Login;
