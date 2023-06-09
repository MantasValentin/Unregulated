import { auth } from "@/firebase/clientApp";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { HiCubeTransparent } from "react-icons/hi";
import AuthButtons from "./RightContent/AuthButtons";
import RightContent from "./RightContent";
import SearchInput from "./SearchInput";
import Directory from "./Directory";
import Link from "next/link";

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  return (
    <header className="flex flex-row items-center bg-white h-12 px-2 gap-x-3">
      <Link href="/" className="flex flex-row items-center gap-x-3">
        <HiCubeTransparent className="text-3xl flex-none" color="black" />
        <i className="logo font-bold max-lg:hidden">UNREGULATED</i>
      </Link>
      {!user ? <></> : <Directory />}
      <SearchInput />
      {!user ? <AuthButtons /> : <RightContent user={user} />}
    </header>
  );
};

export default Navbar;
