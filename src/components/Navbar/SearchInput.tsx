import { Group, groupsState } from "@/atoms/groupsAtom";
import { firestore } from "@/firebase/clientApp";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const SearchInput: React.FC = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchedGroups, setSearchedGroups] = useState<Group[]>([]);
  const [groupsStateValue, setGroupsStateValue] = useRecoilState(groupsState);
  const [searchVisible, setSearchVisible] = useState(false);

  const onBackgroundClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    setSearchVisible(false);
  };

  const getGroups = async () => {
    setLoading(true);
    try {
      const groupQuery = query(collection(firestore, "groups"));
      const groupDocs = await getDocs(groupQuery);
      const groups = groupDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Group[];
      setGroupsStateValue(groups);
    } catch (error: any) {
      console.log("get groups error", error);
    }
    setLoading(false);
  };

  const getSearchedGroups = () => {
    setSearchedGroups(
      groupsStateValue.filter((item) => item.name.toLowerCase().includes(input))
    );
  };

  useEffect(() => {
    if (groupsStateValue.length === 0) {
      getGroups();
    }
  }, []);

  useEffect(() => {
    getSearchedGroups();
  }, [input]);

  return (
    <>
      <div className="flex-auto flex justify-center relative hover:cursor-pointer">
        <form
          className="border-none p-0 w-80 flex-auto flex justify-center z-50"
          onClick={() => setSearchVisible(true)}
        >
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
        {searchVisible ? (
          <>
            <div className="absolute top-[41px] w-full max-w-xl bg-white border border-gray-300 rounded-md z-50">
              <div className="flex flex-col">
                {searchedGroups.map((group: Group) => {
                  return (
                    <Link
                      href={`/group/${group.name}`}
                      key={`${group.id}`}
                      className="flex items-center m-1 p-1 text-left hover:bg-gray-200 hover:rounded-md transition"
                    >
                      {group.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div
              className="opacity-0 fixed inset-0 z-40 bg-transparent"
              onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                onBackgroundClick(e)
              }
            ></div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default SearchInput;
