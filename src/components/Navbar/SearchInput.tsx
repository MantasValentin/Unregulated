import React, { useState } from "react";

const SearchInput: React.FC = () => {
  const [input, setInput] = useState("");

  console.log(input);
  return (
    <form className="border-none p-0 w-80 flex-auto flex justify-center">
      <input
        className="nosubmit w-full max-w-xl py-1 pl-10 border border-solid border-gray-300 focus:outline-none rounded-md"
        type="text"
        placeholder="Search..."
        value={input}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInput(e.target.value)
        }
      />
    </form>
  );
};

export default SearchInput;
