import React, { useState } from "react";
import { auth } from "@/firebase/clientApp";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { AuthModalState } from "@/atoms/authModalAtom";
import { SetterOrUpdater } from "recoil";

interface props {
  modalState: AuthModalState;
  setModalState: SetterOrUpdater<AuthModalState>;
}

const Reset: React.FC<props> = ({ modalState, setModalState }) => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await sendPasswordResetEmail(email);
    setSuccess(true);
  };

  return (
    <>
      <div className="flex flex-col">
        <button
          className="text-gray-700 hover:bg-gray-200 text-right rounded-t-md pr-2"
          onClick={() => {
            setModalState({ ...modalState, show: false });
          }}
        >
          <span className="text-xl">X</span>
        </button>
        <div className="pb-6 px-6 flex flex-col gap-2">
          <h2 className="text-xl text-center">Reset Password</h2>

          {success ? (
            <p className="text-center">Check your email</p>
          ) : (
            <>
              <p className="text-base text-center">
                Enter the email associated with your account and we will send
                you a reset link
              </p>
              <form onSubmit={onSubmit}>
                <label className="flex flex-col pb-2">
                  <input
                    className="border border-gray-300 rounded-md shadow-sm opacity-70 focus:outline-none focus:opacity-100 hover:opacity-100 py-1 px-2"
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    required
                  />
                </label>
                <div className="flex justify-center w-full">
                  <button className="flex-1 max-w-[10rem] border border-gray-300 rounded-full shadow-sm px-3 py-2 hover:bg-gray-100 text-lg">
                    Confirm
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Reset;
