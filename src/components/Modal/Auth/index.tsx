import React, { useEffect } from "react";
import { FaPen, FaUser } from "react-icons/fa";
import { AuthModalState } from "@/atoms/authModalAtom";
import { SetterOrUpdater } from "recoil";
import Login from "./Login";
import SignUp from "./SignUp";
import OAuthButtons from "./OAuthButtons";
import { auth } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import Reset from "./Reset";

interface props {
  modalState: AuthModalState;
  setModalState: SetterOrUpdater<AuthModalState>;
}

const Modal: React.FC<props> = ({ modalState, setModalState }) => {
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      setModalState({ ...modalState, show: false });
    }
  }, [user]);

  return (
    <>
      {modalState.show ? (
        <>
          <div className="justify-center items-center flex fixed inset-0 px-6 z-50">
            {modalState.view !== "reset" ? (
              <div className="flex flex-1 flex-col max-w-lg border-gray-400 border-solid border rounded-lg shadow-xl bg-white">
                <div className="flex flex-row border-b border-b-gray-300">
                  <button
                    className="flex items-center flex-row p-3 text-gray-700 hover:bg-gray-200 rounded-tl-md"
                    onClick={() => {
                      setModalState({ ...modalState, view: "login" });
                    }}
                  >
                    <span className="text-xl mr-2">Login</span>
                    <FaUser className="text-xl"></FaUser>
                  </button>
                  <button
                    className="flex items-center flex-row p-3 text-gray-700 hover:bg-gray-200"
                    onClick={() => {
                      setModalState({ ...modalState, view: "signup" });
                    }}
                  >
                    <span className="text-xl mr-2">Sign Up</span>
                    <FaPen className="text-xl"></FaPen>
                  </button>
                  <button
                    className="flex items-center justify-end flex-1 p-3 text-gray-700 hover:bg-gray-200 rounded-tr-md"
                    onClick={() => {
                      setModalState({ ...modalState, show: false });
                    }}
                  >
                    <span className="text-xl">X</span>
                  </button>
                </div>
                <div className="flex flex-col gap-2 justify-center px-4 py-6">
                  <OAuthButtons />
                </div>
                <span
                  className="text-center font-bold
                text-xl text-gray-400"
                >
                  OR
                </span>
                {modalState.view === "login" ? (
                  <Login
                    modalState={modalState}
                    setModalState={setModalState}
                  />
                ) : modalState.view === "signup" ? (
                  <SignUp />
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <div className="flex flex-1 flex-col max-w-lg border-gray-400 border-solid border rounded-lg shadow-xl bg-white">
                <Reset modalState={modalState} setModalState={setModalState} />
              </div>
            )}
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
