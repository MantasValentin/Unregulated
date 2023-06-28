import Link from "next/link";
import React from "react";

interface props {
  message: string;
}

const NotFound: React.FC<props> = ({message}) => {
  return (
    <>
      <section className="flex flex-col gap-2 items-center justify-center h-80">
        <p className="text-lg">Sorry {message} was not found</p>
        <Link
          href="/"
          className="max-w-[10rem] border border-gray-300 rounded-full shadow-sm px-3 py-2 bg-white hover:bg-gray-200"
        >
          GO HOME
        </Link>
      </section>
    </>
  );
};

export default NotFound;
