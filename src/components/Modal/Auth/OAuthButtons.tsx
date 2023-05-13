import { FcGoogle } from "react-icons/fc";
import { AiOutlineGithub } from "react-icons/ai";
import React, { useState } from "react";
import { auth } from "@/firebase/clientApp";
import {
  useSignInWithGoogle,
  useSignInWithGithub,
} from "react-firebase-hooks/auth";

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, googleUser, googleUoading, googleUserError] =
    useSignInWithGoogle(auth);
  const [signInWithGithub, githubUser, githubLoading, githubUserError] =
    useSignInWithGithub(auth);

  return (
    <>
      <button
        className="flex flex-row border items-center justify-center border-gray-300 bg-white hover:bg-gray-100 rounded-full shadow-sm px-3 py-2 text-xl text-center gap-2"
        onClick={() => signInWithGoogle()}
      >
        <FcGoogle className="text-3xl" />
        Continue with Google
      </button>
      <button
        className="flex flex-row border items-center justify-center border-gray-300 bg-white hover:bg-gray-100 rounded-full shadow-sm px-3 py-2 text-xl text-center gap-2"
        onClick={() => signInWithGithub()}
      >
        <AiOutlineGithub className="text-3xl" />
        Continue with Github
      </button>
    </>
  );
};

export default OAuthButtons;
