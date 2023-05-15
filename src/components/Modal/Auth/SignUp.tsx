import { auth } from "@/firebase/clientApp";
import React, { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FIREBASE_ERRORS } from "@/firebase/errors";

const Register: React.FC = () => {
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [error, setError] = useState("");
  const [createUserWithEmailAndPassword, user, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (error) {
      setError("");
    }

    if (signUpForm.password !== signUpForm.confirmpassword) {
      setError("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <form
      className="flex flex-col px-4 py-6 text-gray-700 text-lg"
      onSubmit={onSubmit}
    >
      <label className="flex flex-col pb-2">
        <span className="font-semibold pb-1">Email</span>
        <input
          className="border border-gray-300 rounded-md shadow-sm opacity-70 focus:outline-none focus:opacity-100 hover:opacity-100 py-1 px-2"
          type="email"
          name="email"
          placeholder="Enter email"
          value={signUpForm.email}
          onChange={onChange}
          required
        />
      </label>
      <label className="flex flex-col pb-2">
        <span className="font-semibold pb-1">Password</span>
        <input
          className="border border-gray-300 rounded-md shadow-sm opacity-70 focus:outline-none focus:opacity-100 hover:opacity-100 py-1 px-2"
          type="password"
          name="password"
          placeholder="Enter password"
          value={signUpForm.password}
          onChange={onChange}
          required
        />
      </label>
      <label className="flex flex-col pb-6">
        <span className="font-semibold pb-1">Confirm password</span>
        <input
          className="border border-gray-300 rounded-md shadow-sm opacity-70 focus:outline-none focus:opacity-100 hover:opacity-100 py-1 px-2"
          type="password"
          name="confirmpassword"
          placeholder="Confirm password"
          value={signUpForm.confirmpassword}
          onChange={onChange}
          required
        />
      </label>
      {error || userError ? (
        <p className="flex justify-center pb-4 text-red-500 ">
          {error ||
            FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
        </p>
      ) : (
        ""
      )}
      <div className="flex justify-center w-full">
        <button
          className="flex-1 max-w-[10rem] border border-gray-300 rounded-full shadow-sm px-3 py-2 hover:bg-gray-200 text-lg"
          type="submit"
        >
          <span className="">Sign Up</span>
        </button>
      </div>
    </form>
  );
};

export default Register;
