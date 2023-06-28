import { Group } from "@/atoms/groupsAtom";
import { firestore } from "@/firebase/clientApp";
import useGroupData from "@/hooks/useGroupData";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HiCubeTransparent } from "react-icons/hi";

const TopGroups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const { groupStateValue, onJoinOrLeaveGroup } = useGroupData();

  const getTopGroups = async () => {
    setLoading(true);
    try {
      const groupQuery = query(
        collection(firestore, "groups"),
        orderBy("numberOfMembers", "desc"),
        limit(5)
      );
      const groupDocs = await getDocs(groupQuery);
      const groups = groupDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Group[];

      setGroups(groups);
    } catch (error: any) {
      console.log("getTopGroups error", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getTopGroups();
  }, []);

  return (
    <div className="min-w-[20rem]">
      <div className="flex flex-col text-lg bg-white rounded-md max-h-fit">
        {loading ? (
          ""
        ) : (
          <>
            <div className="font-semibold p-4 border-b-[1px] bg-gray-300 rounded-t-md">
              Top Groups
            </div>
            <div className="flex flex-col gap-2 p-2">
              {groups.map((item, index) => {
                const isJoined = !!groupStateValue.mySnippets.find(
                  (snippet) => snippet.groupName === item.name
                );
                return (
                  <div
                    key={item.id}
                    className="flex flex-row items-center gap-4"
                  >
                    <Link
                      href={`/group/${item.name}`}
                      className="flex flex-1 flex-row gap-2 items-center"
                    >
                      {item.imageURL ? (
                        <img
                          src={item.imageURL}
                          className="w-10 h-10 p-[2px] rounded-full border-gray-300 border-[1px]"
                        ></img>
                      ) : (
                        <HiCubeTransparent
                          className="w-10 h-10 p-[2px] rounded-full border-gray-300 border-[1px]"
                          color="black"
                        />
                      )}
                      <div className="text-base">{item.name}</div>
                    </Link>
                    <>
                      {isJoined ? (
                        <button
                          className="w-20 border border-gray-300 rounded-full shadow-sm px-2 py-1 bg-white hover:bg-gray-200 font-semibold transition text-base"
                          type="submit"
                          onClick={() => onJoinOrLeaveGroup(item, isJoined)}
                        >
                          Joined
                        </button>
                      ) : (
                        <button
                          className="w-20 border border-gray-300 rounded-full shadow-sm px-2 py-1 bg-white hover:bg-gray-200 font-semibold transition text-base"
                          type="submit"
                          onClick={() => onJoinOrLeaveGroup(item, isJoined)}
                        >
                          Join
                        </button>
                      )}
                    </>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopGroups;
