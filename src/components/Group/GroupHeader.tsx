import { Group } from "@/atoms/groupsAtom";
import { User } from "firebase/auth";
import React from "react";
import { HiCubeTransparent } from "react-icons/hi";
import useGroupData from "../../hooks/useGroupData";

interface Props {
  // user: User;
  groupData: Group;
  // userData: any;
  // setUserData: React.Dispatch<any>;
}

const GroupHeader: React.FC<Props> = ({ groupData }) => {
  const { groupStateValue, onJoinOrLeaveGroup } = useGroupData();
  const isJoined = !!groupStateValue.mySnippets.find(
    (item) => item.groupId === groupData.id
  );

  return (
    <>
      <section className="flex flex-col h-32 w-full">
        <div className="flex-1 h-1/2 bg-gray-500"></div>
        <div className="flex flex-1 h-1/2 bg-white justify-center">
          <div className="flex flex-1 flex-row h-full items-center justify-start gap-4 max-w-6xl px-4">
            <div className="relative bottom-5 p-1 bg-white rounded-full">
              <HiCubeTransparent
                className="text-5xl p-[2px] rounded-full border-gray-300 border-[1px]"
                color="black"
              />
            </div>
            <div className="text-xl font-semibold">{groupData.name}</div>
            <div className="flex justify-center">
              <button
                className="w-24 border border-gray-300 rounded-full shadow-sm px-3 py-2 bg-white hover:bg-gray-200 font-semibold"
                type="submit"
                onClick={() => onJoinOrLeaveGroup(groupData, isJoined)}
              >
                <span className="">Join</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GroupHeader;
