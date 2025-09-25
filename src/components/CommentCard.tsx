import { FaRegHeart, FaHeart, FaUser } from "react-icons/fa";
import { useState } from "react";
import { commentService } from "../services/api";
import type { Comment } from "../types/post";

type CommentCardProps = {
  comment: Comment;
  onLikeUpdate?: (commentId: string, newLikes: number) => void;
};

function CommentCard({ comment, onLikeUpdate }: CommentCardProps) {
  const [isLiked, setIsLiked] = useState(comment.userLiked || false);
  const [likes, setLikes] = useState(comment.likes || 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleToggleLike = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      const response = await commentService.toggleCommentLike(comment._id);

      if (response.success) {
        const newLikes = response.data.likes;
        const liked = response.data.liked;
        setLikes(newLikes);
        setIsLiked(liked);

        // Notificar o componente pai sobre a atualização
        if (onLikeUpdate) {
          onLikeUpdate(comment._id, newLikes);
        }
      }
    } catch (error) {
      console.error("Erro ao curtir comentário:", error);
    } finally {
      setIsLiking(false);
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 mb-3 md:mb-4">
      <div className="flex items-start gap-2 md:gap-3 mb-2 md:mb-3">
        {comment.author.profileImage ? (
          <img
            src={comment.author.profileImage}
            alt={comment.author.name}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <FaUser className="text-gray-500 text-xs md:text-sm" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-semibold text-xs md:text-sm text-gray-800">
            {comment.author.name}
          </span>
          <span className="text-xs text-gray-500 capitalize">
            {comment.author.userType}
          </span>
        </div>
      </div>

      <p className="text-xs md:text-sm text-gray-700 leading-relaxed mb-2 md:mb-3">
        {comment.content}
      </p>

      <div className="flex items-center gap-3 md:gap-4 text-xs text-gray-500">
        <button
          onClick={handleToggleLike}
          disabled={isLiking}
          className={`flex items-center gap-1 transition-colors ${
            isLiked
              ? "text-red-500 hover:text-red-600"
              : "text-orange-600 hover:text-orange-700"
          } ${isLiking ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {isLiked ? (
            <FaHeart className="text-xs md:text-sm" />
          ) : (
            <FaRegHeart className="text-xs md:text-sm" />
          )}{" "}
          {likes}
        </button>
        <span className="text-xs text-gray-400">
          {new Date(comment.createdAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

export default CommentCard;
