import { Group } from "@/atoms/groupsAtom";
import { User } from "firebase/auth";
import React, { useState } from "react";

interface Props {
  // user: User;
  // groupData: Group;
  // userData: any;
  // setUserData: React.Dispatch<any>;
}

const CreatePost: React.FC<Props> = () => {
  const [input, setInput] = useState("");
  return (
    <>
      <form className="border-none p-0 w-80 flex-auto flex justify-center">
        <input
          className="w-full max-w-xl py-1 pl-10 border border-solid border-gray-300 focus:outline-none rounded-md"
          type="text"
          placeholder="Search..."
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
      </form>
    </>
  );
};

export default CreatePost;
