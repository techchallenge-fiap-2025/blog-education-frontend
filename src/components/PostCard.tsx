import { FaRegHeart, FaRegCommentDots, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type PostCardProps = {
  id?: string;
  imageSrc: string;
  title: string;
  likes?: number;
  comments?: number;
  author?: string;
  authorImage?: string;
  authorId?: string;
};

function PostCard({
  id,
  imageSrc,
  title,
  likes = 50,
  comments = 50,
  author,
  authorImage,
  authorId,
}: PostCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <article
      className="bg-white rounded-2xl md:rounded-3xl border-2 md:border-4 border-orange-500 overflow-hidden shadow-sm cursor-pointer"
      onClick={() => id && navigate(`/posts/${id}`)}
    >
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-48 md:h-56 object-cover"
      />
      <div className="p-3 md:p-5">
        <div className="flex items-center justify-between mb-3 md:mb-0">
          <h3 className="text-lg md:text-xl font-semibold line-clamp-2 flex-1 mr-2">
            {title}
          </h3>
          <span className="inline-flex items-center gap-1 md:gap-2 bg-orange-500 text-white text-sm md:text-base font-semibold px-2 md:px-4 py-1 rounded-full flex-shrink-0">
            <FaRegHeart className="text-xs md:text-sm" /> {likes}
          </span>
        </div>

        <div className="mt-4 md:mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <FaRegCommentDots className="text-orange-500 text-2xl md:text-3xl" />
            <span className="text-orange-500 text-lg md:text-xl font-semibold">
              {comments}
            </span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <div
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Evita que o clique no avatar abra o post

                // Se o usuário logado for o dono do post, vai para o perfil próprio
                // Se não for, vai para o perfil do autor
                if (
                  user?._id &&
                  authorId &&
                  String(user._id) === String(authorId)
                ) {
                  navigate("/profile");
                } else if (authorId) {
                  navigate(`/profile/${authorId}`);
                }
              }}
            >
              {authorImage ? (
                <img
                  src={authorImage}
                  alt={author || "Autor"}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition-colors">
                  <FaUser className="text-gray-500 text-xs md:text-sm" />
                </div>
              )}
            </div>
            {author && (
              <span className="text-xs md:text-sm text-gray-600 font-medium hidden sm:block">
                {author}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
