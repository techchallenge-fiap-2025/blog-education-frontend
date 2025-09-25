import { FaBookOpen, FaLightbulb, FaUserGraduate } from "react-icons/fa";

function Benefits() {
  return (
    <section className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center px-4 py-8 md:py-12">
      <div className="w-full order-2 md:order-1">
        <img
          src="/images/Imagem2.png"
          alt="Estudantes"
          className="w-full max-w-md rounded-xl mx-auto"
        />
      </div>
      <div className="space-y-4 order-1 md:order-2">
        <h2 className="text-lg md:text-xl font-semibold">
          <span className="text-orange-600 font-bold">Benefícios</span> do Nosso
          Blog Educacional
        </h2>
        <ul className="space-y-6 md:space-y-8 text-sm">
          <li className="flex items-start gap-3 md:gap-4">
            <span className="mt-1 inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-orange-500 text-white text-xl md:text-2xl">
              <FaBookOpen />
            </span>
            <div>
              <p className="font-medium text-sm md:text-base">
                Aprendizado Acessível
              </p>
              <p className="text-gray-600 text-xs md:text-sm">
                Conteúdos gratuitos e de fácil compreensão, feitos para todos os
                níveis de estudo.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3 md:gap-4">
            <span className="mt-1 inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-orange-500 text-white text-xl md:text-2xl">
              <FaLightbulb />
            </span>
            <div>
              <p className="font-medium text-sm md:text-base">
                Dicas de Estudo
              </p>
              <p className="text-gray-600 text-xs md:text-sm">
                Métodos e técnicas práticas para melhorar sua organização e
                rendimento escolar.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3 md:gap-4">
            <span className="mt-1 inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-orange-500 text-white text-xl md:text-2xl">
              <FaUserGraduate />
            </span>
            <div>
              <p className="font-medium text-sm md:text-base">
                Materiais Exclusivos
              </p>
              <p className="text-gray-600 text-xs md:text-sm">
                Resumos, guias e exercícios preparados para facilitar o
                aprendizado do dia a dia.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Benefits;
