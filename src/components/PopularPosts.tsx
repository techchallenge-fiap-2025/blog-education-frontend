import PostCard from "./PostCard";
import { postService } from "../services/api";
import type { Post } from "../types/post";
import { useState, useEffect } from "react";

function PopularPosts() {
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPopularPosts = async () => {
      try {
        setIsLoading(true);
        const response = await postService.getPopularPosts(3);
        setPopularPosts(response.data);
      } catch (error) {
        console.error("Erro ao carregar posts populares:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPopularPosts();
  }, []);

  return (
    <section
      id="posts"
      className="w-full bg-gradient-to-r from-orange-600 to-orange-400 py-8 md:py-10"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-white text-xl md:text-2xl font-semibold mb-4 md:mb-6">
          Posts Populares
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-sm md:text-base">
                Carregando posts populares...
              </p>
            </div>
          ) : popularPosts.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-white text-sm md:text-base">
                Nenhum post encontrado
              </p>
            </div>
          ) : (
            popularPosts.map((p) => (
              <PostCard
                key={p._id}
                id={p._id}
                title={p.title}
                imageSrc={p.imageSrc}
                likes={p.likes}
                comments={p.comments}
                author={p.author.name}
                authorImage={p.author.profileImage}
                authorId={p.author._id}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default PopularPosts;
