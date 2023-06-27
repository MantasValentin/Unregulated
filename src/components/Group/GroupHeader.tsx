import { Group, GroupState } from "@/atoms/groupsAtom";
import React from "react";
import { HiCubeTransparent } from "react-icons/hi";

interface Props {
  groupData: Group;
  groupStateValue: GroupState;
  onJoinOrLeaveGroup: (
    groupData: Group,
    isJoined?: boolean | undefined
  ) => void;
}

const GroupHeader: React.FC<Props> = ({
  groupData,
  groupStateValue,
  onJoinOrLeaveGroup,
}) => {
  const isJoined = !!groupStateValue.mySnippets.find(
    (item) => item.id === groupData.id
  );

  return (
    <>
      <section className="flex flex-col h-32 w-full">
        <div className="flex-1 h-1/2 bg-gray-300"></div>
        <div className="flex flex-1 h-1/2 bg-white justify-center">
          <div className="flex flex-1 flex-row h-full items-center justify-start gap-4 max-w-6xl px-4">
            <div className="relative bottom-5 p-1 bg-white rounded-full">
            {groupData.imageURL ? (
                      <img src={groupData.imageURL as string} alt="" className="w-14 h-14 p-[2px] rounded-full border-gray-300 border-[1px]"/>
                    ) : (
                      <HiCubeTransparent
                        className="w-14 h-14 p-[2px] rounded-full border-gray-300 border-[1px]"
                        color="black"
                      />
                    )}
            </div>
            <div className="text-xl font-semibold">{groupData.name}</div>
            <div className="flex justify-center">
              <>
                {isJoined ? (
                  <button
                    className="w-24 border border-gray-300 rounded-full shadow-sm px-3 py-2 bg-white hover:bg-gray-200 font-semibold transition"
                    type="submit"
                    onClick={() => onJoinOrLeaveGroup(groupData, isJoined)}
                  >
                    Joined
                  </button>
                ) : (
                  <button
                    className="w-24 border border-gray-300 rounded-full shadow-sm px-3 py-2 bg-white hover:bg-gray-200 font-semibold transition"
                    type="submit"
                    onClick={() => onJoinOrLeaveGroup(groupData, isJoined)}
                  >
                    Join
                  </button>
                )}
              </>{" "}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GroupHeader;
