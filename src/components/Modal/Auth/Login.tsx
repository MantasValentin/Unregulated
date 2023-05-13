import React, { useState } from "react";
import { auth } from "@/firebase/clientApp";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { AuthModalState } from "@/atoms/authModalAtom";
import { SetterOrUpdater } from "recoil";

interface props {
  modalState: AuthModalState;
  setModalState: SetterOrUpdater<AuthModalState>;
}

const Login: React.FC<props> = ({ modalState, setModalState }) => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [signInWithEmailAndPassword, user, loading, userError] =
    useSignInWithEmailAndPassword(auth);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    signInWithEmailAndPassword(loginForm.email, loginForm.password);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <form
      className="flex flex-col px-4 pb-6 pt-4 text-gray-700 text-lg"
      onSubmit={onSubmit}
    >
      <label className="flex flex-col pb-2">
        <span className="font-semibold pb-1">Email</span>
        <input
          className="border border-gray-300 rounded-md shadow-sm opacity-70 focus:outline-none focus:opacity-100 hover:opacity-100 py-1 px-2"
          type="email"
          name="email"
          placeholder="Enter email"
          value={loginForm.email}
          onChange={onChange}
          required
        />
      </label>
      <label className="flex flex-col pb-6">
        <span className="font-semibold pb-1">Password</span>
        <input
          className="border border-gray-300 rounded-md shadow-sm opacity-70 focus:outline-none focus:opacity-100 hover:opacity-100 py-1 px-2"
          type="password"
          name="password"
          placeholder="Enter password"
          value={loginForm.password}
          onChange={onChange}
          required
        />
      </label>
      {userError ? (
        <p className="flex justify-center pb-4 text-red-500 ">
          {FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
        </p>
      ) : (
        ""
      )}
      <div className="flex justify-center w-full">
        <button
          className="flex-1 max-w-[10rem] border border-gray-300 rounded-full shadow-sm px-3 py-2 hover:bg-gray-100 text-lg"
          type="submit"
        >
          <span className="">Login</span>
        </button>
      </div>
      <button
        className="flex pt-2 text-sm justify-center text-blue-500"
        onClick={() => setModalState({ ...modalState, view: "reset" })}
      >
        Reset Password
      </button>
    </form>
  );
};

export default Login;
