import React from "react";
import Modal from "../../Modal/Auth/index";
import { useRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";

const AuthButtons: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);

  return (
    <>
      <button
        className="text-gray-900 font-semibold h-8 min-w-[5rem] max-w-[10rem] bg-gray-200 border border-solid border-gray-300 rounded-lg flex-auto"
        onClick={() => {
          setModalState({ ...modalState, show: true, view: "login" });
        }}
      >
        Login
      </button>
      <button
        className="text-gray-200 font-semibold h-8 min-w-[5rem] max-w-[10rem] bg-gray-900 border border-solid border-gray-900 rounded-lg flex-auto"
        onClick={() => {
          setModalState({ ...modalState, show: true, view: "signup" });
        }}
      >
        Sign Up
      </button>
      <Modal modalState={modalState} setModalState={setModalState} />
    </>
  );
};

export default AuthButtons;
