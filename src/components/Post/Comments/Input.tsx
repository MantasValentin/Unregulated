import React from "react";
import { Post } from "@/atoms/postsAtom";
import { User } from "firebase/auth";

interface props {
  comment: string;
  setComment: (value: string) => void;
  loading: boolean;
  user?: User | null;
  onCreateComment: (comment: string) => void;
}

const CommentInput: React.FC<props> = ({
  comment,
  setComment,
  loading,
  user,
  onCreateComment,
}) => {
  return (
    <>
      <div className="flex flex-1 bg-white p-4 rounded-md">
        {user ? (
          <div className="flex flex-1 flex-col gap-4">
            <div className="font-semibold opacity-80">
              Commenting as{" "}
              <span className="text-blue-500">
                {user?.email?.split("@")[0]}
              </span>
            </div>
            <textarea
              className="max-h-20 border border-gray-300 rounded-md shadow-sm opacity-70 focus:outline-none focus:opacity-100 hover:opacity-100 py-1 px-2 transition"
              name="body"
              rows={8}
              placeholder="Comment on post"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex flex-1 justify-end">
              <button
                className="flex flex-1 items-center justify-center max-w-[10rem] border border-gray-300 rounded-full shadow-sm px-3 py-2 bg-white hover:bg-gray-200"
                onClick={() => onCreateComment(comment)}
              >
                Comment
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 justify-center">
            Log in or sign up to leave a comment
          </div>
        )}
      </div>
    </>
  );
};

export default CommentInput;
