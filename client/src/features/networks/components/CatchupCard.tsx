import React, { useState } from "react";
import { Heart, MessageCircle, ThumbsUp, Trash2 } from "lucide-react";
import type { CatchupUpdate } from "../../../lib/types/networkUpdateType";


interface CatchupCardProps {
  update: CatchupUpdate;
  onLike: (updateId: string) => Promise<any>;
  onComment: (updateId: string, content: string) => Promise<any>;
  onCongratulate: (updateId: string) => Promise<any>;
  onDeleteComment?: (updateId: string, commentId: string) => Promise<any>;
}

//cathupcard
const CatchupCard: React.FC<CatchupCardProps> = ({
  update,
  onLike,
  onComment,
  onCongratulate,
  onDeleteComment,
}) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onComment(update._id, commentText);
      setCommentText("");
      setShowCommentInput(false);
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const timeAgo = getTimeAgo(update.createdAt);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        <img
          src={update.imageUrl}
          alt={update.fullName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-gray-900">{update.fullName}</h3>
          <p className="text-xs text-gray-600 leading-tight">{update.content}</p>
          <span className="text-xs text-gray-500">• {timeAgo}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike(update._id)}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-500 transition-colors"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                update.likes.length > 0 ? "fill-red-500 text-red-500" : ""
              }`}
            />
            <span>{update.likes.length} likes</span>
          </button>

          <button
            onClick={() => setShowCommentInput(!showCommentInput)}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-500 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Comment</span>
          </button>
        </div>

        {/* Congratulations Button - Right Side */}
        <button
          onClick={() => onCongratulate(update._id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            update.congratulations.length > 0
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          Congratulations
        </button>
      </div>

      {/* Comment Section - Only show when comment button is clicked */}
      {showCommentInput && (
        <div className="mt-2 pt-2">
          {/* Comment Input */}
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !isSubmitting) {
                  handleCommentSubmit();
                }
              }}
            />
            <button
              onClick={handleCommentSubmit}
              disabled={isSubmitting || !commentText.trim()}
              className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>

          {/* Comments Display - Only show when comment section is open */}
          {update.comments.length > 0 && (
            <div className="space-y-1.5">
              {update.comments.map((comment) => (
                <div key={comment._id} className="flex items-start justify-between gap-2">
                  <div className="text-xs flex-1">
                    <span className="font-medium text-gray-900">User: </span>
                    <span className="text-gray-700">{comment.content}</span>
                  </div>
                  {onDeleteComment && (
                    <button
                      onClick={() => onDeleteComment(update._id, comment._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      title="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CatchupCard;
