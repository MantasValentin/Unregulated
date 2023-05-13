import { atom } from "recoil";

export interface AuthModalState {
  show: boolean;
  view: "login" | "signup" | "reset";
}

const defaultModalState: AuthModalState = {
  show: false,
  view: "login",
};

export const authModalState = atom<AuthModalState>({
  key: "authModalState",
  default: defaultModalState,
});
