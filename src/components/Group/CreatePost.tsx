import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/clientApp";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";

const CreatePost: React.FC = () => {
  const router = useRouter();
  const [user, loadingUser] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);

  const onPostCreate = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    e.preventDefault();
    if (user) {
      router.push(`/group/${router.query.groupName}/submit`);
    } else {
      setAuthModalState({ view: "login", show: true });
    }
  };

  return (
    <>
      <div className="flex border-none p-4 py-2 gap-2 justify-center items-center bg-white rounded-md sticky top-0 z-10">
        <input
          className="w-full border border-gray-300 rounded-md shadow-sm opacity-70 focus:outline-none focus:opacity-100 hover:opacity-100 py-1 px-2 transition"
          type="text"
          placeholder="Create Post"
          onClick={(e) => {
            onPostCreate(e);
          }}
        />
        <div className="opacity-50">
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
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>
        <div className="opacity-50">
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
              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
