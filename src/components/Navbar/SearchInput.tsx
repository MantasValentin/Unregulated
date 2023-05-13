import React from "react";

type SearchInputProps = {};

const SearchInput: React.FC<SearchInputProps> = () => {
  return (
    <form className="border-none p-0 w-80 flex-auto flex justify-center">
      <input
        className="nosubmit w-full max-w-xl py-1 pl-10 border border-solid border-gray-200 focus:outline-none rounded-full"
        type="text"
        placeholder="Search..."
      />
    </form>
  );
};

export default SearchInput;
