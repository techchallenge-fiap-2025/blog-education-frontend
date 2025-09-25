import Header from "../components/Header";
import Hero from "../components/Hero";
import PartnersBar from "../components/PartnersBar";
import Benefits from "../components/Benefits";
import PopularPosts from "../components/PopularPosts";

function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <Hero />
      <PartnersBar />
      <Benefits />
      <PopularPosts />
    </div>
  );
}

export default Home;
