import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center px-4 py-8 md:py-10">
      <div className="space-y-4 order-2 md:order-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
          Desenvolva suas habilidades de uma maneira nova e única
        </h1>
        <p className="text-sm md:text-base text-gray-600 max-w-md">
          Aqui você encontra conteúdos educativos de qualidade para aprender,
          revisar e se inspirar. Nosso objetivo é tornar o conhecimento
          acessível e prático, ajudando estudantes, professores e curiosos a
          explorarem novas ideias todos os dias.
        </p>
        <button
          onClick={() => navigate("/posts")}
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-3 rounded-md transition-colors w-full sm:w-auto"
        >
          Ver Posts
        </button>
      </div>

      <div className="relative h-[300px] sm:h-[400px] md:h-[460px] lg:h-[560px] order-1 md:order-2">
        <img
          src="/images/Imagem1.png"
          alt="Estudante"
          className="relative z-10 object-contain w-full h-full"
        />
      </div>
    </section>
  );
}

export default Hero;
