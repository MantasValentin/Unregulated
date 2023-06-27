import { useState, useEffect } from "react";
import CreateGroup from "@/components/Modal/CreateGroup";
import { useRecoilValue } from "recoil";
import { groupState } from "@/atoms/groupsAtom";
import Link from "next/link";

interface Group {
  id: string;
  groupName: string;
}

const UserGroups: React.FC = () => {
  const [createGroup, setCreateGroup] = useState(false);
  const mySnippets = useRecoilValue(groupState).mySnippets;

  return (
    <>
      <div className="absolute top-[41px] w-60 bg-white border border-gray-300 rounded-md z-20">
        <div className="flex flex-col">
          <p className="text-base text-left pl-2 py-2 border-b-[1px] border-b-gray-300 hover:cursor-default">
            Your Groups
          </p>
          <button
            className="flex items-center m-1 p-1 gap-1 text-left hover:bg-gray-200 hover:rounded-md transition"
            onClick={() => setCreateGroup(!createGroup)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Create Group
          </button>
          {mySnippets.map((group: Group) => {
            return (
              <Link
                href={`/group/${group.groupName}`}
                key={`${group.id}`}
                className="flex items-center m-1 p-1 text-left hover:bg-gray-200 hover:rounded-md transition"
              >
                {group.groupName}
              </Link>
            );
          })}
        </div>
      </div>
      {createGroup ? (
        <CreateGroup modalState={createGroup} setModalState={setCreateGroup} />
      ) : (
        <></>
      )}
    </>
  );
};

export default UserGroups;
