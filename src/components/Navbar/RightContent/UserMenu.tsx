import { auth } from "@/firebase/clientApp";
import { signOut, User } from "firebase/auth";
import React from "react";

interface props {
  user: User;
}

const UserMenu: React.FC<props> = ({ user }) => {
  return (
    <>
      <div className="fixed right-0 top-[48px] w-60 bg-white border border-gray-300 rounded-md">
        <div className="flex flex-col">
          <button className="flex items-center gap-2 p-2 text-left hover:bg-gray-100">
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
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Profile
          </button>
          <button
            className="flex items-center gap-2 p-2 text-left hover:bg-gray-100"
            onClick={() => signOut(auth)}
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
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            Log Out
          </button>
          <button className="p-2 text-left hover:bg-gray-100">
            Something else here
          </button>
          <button className="p-2 text-left hover:bg-gray-100">
            Seprated link
          </button>
        </div>
      </div>
    </>
  );
};

export default UserMenu;
