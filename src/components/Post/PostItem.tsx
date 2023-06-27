import { Post } from "@/atoms/postsAtom";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import { Poor_Story } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { NextRouter } from "next/router";
import React, { useState } from "react";
import { HiCubeTransparent } from "react-icons/hi";

interface props {
  post: Post;
  onVote: (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>,
    post: Post,
    vote: number,
    groupName: string,
    postIdx?: number
  ) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
  userIsCreator: boolean;
  onSelectPost?: (value: Post, postIdx: number) => void;
  router?: NextRouter;
  postIdx?: number;
  userVoteValue?: number;
  homePage?: boolean;
}

const PostItem: React.FC<props> = ({
  post,
  onDeletePost,
  onVote,
  userIsCreator,
  homePage,
  onSelectPost,
  postIdx,
  router,
  userVoteValue,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setLoadingDelete(true);
    try {
      const success = await onDeletePost(post);
      if (!success) throw new Error("Failed to delete post");

      // Could proably move this logic to onDeletePost function
      if (router) router.back();
    } catch (error: any) {
      /**
       * Don't need to setLoading false if no error
       * as item will be removed from DOM
       */
      setLoadingDelete(false);
      // setError
    }
  };

  return (
    <>
      <div className="flex flex-row bg-white rounded-md">
        {loadingDelete ? (
          <div
            role="status"
            className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
          >
            <svg
              aria-hidden="true"
              className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          ""
        )}
        <div className="flex flex-col items-center px-1 py-4 bg-gray-300 rounded-l-md">
          <button className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-6 h-6 opacity-60 hover:opacity-100 active:scale-90 transition ${userVoteValue === 1 ? "opacity-100" : ""}`}
              onClick={(e) => onVote(e, post, 1, post.groupName)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <div className="">{post.voteStatus}</div>
          <button className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-6 h-6 opacity-60 hover:opacity-100 active:scale-90 transition ${userVoteValue === -1 ? "opacity-100" : ""}`}
              onClick={(e) => onVote(e, post, -1, post.groupName)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col bg-white rounded-md p-4 gap-2">
          <div className="flex flex-row items-center gap-2">
            {homePage ? (
              <div className="flex flex-row items-center gap-2">
                {post.groupImageURL ? (
                  <img
                    src={post.groupImageURL as string}
                    alt=""
                    className="w-8 h-8 p-[2px] rounded-full border-gray-300 border-[1px]"
                  />
                ) : (
                  <HiCubeTransparent
                    className="w-8 h-8 p-[2px] rounded-full border-gray-300 border-[1px]"
                    color="black"
                  />
                )}
                <Link
                  href={`/group/${post.groupName}`}
                  className="text-sm text-blue-500 opacity-60 hover:opacity-100 hover:cursor-pointer transition"
                >
                  {post.groupName}
                </Link>
                {}
              </div>
            ) : (
              ""
            )}
            <div className="text-sm opacity-60">
              Posted by {post.authorDisplayName}{" "}
              {moment(
                new Date((post.createdAt?.seconds as number) * 1000)
              ).fromNow()}
            </div>
          </div>
          <div className="text-xl font-semibold">{post.title}</div>
          <div className="">{post.body}</div>
          <div className="">
            <img src={post.imageURL as string} alt="" />
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex flex-row items-center gap-1 text-lg opacity-60 hover:cursor-pointer hover:opacity-100 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                />
              </svg>
              <div className="flex items-center">{post.numberOfComments}</div>
            </div>
            <div
              className={`flex flex-row items-center gap-1 text-lg opacity-60 hover:cursor-pointer hover:opacity-100 transition ${
                userIsCreator ? "" : "hidden"
              }`}
              onClick={handleDelete}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
              <div className="">delete</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostItem;
