import { Group } from "@/atoms/groupsAtom";
import { User } from "firebase/auth";
import React from "react";

interface Props {
  // user: User;
  groupData: Group;
  // userData: any;
  // setUserData: React.Dispatch<any>;
}

const AboutGroup: React.FC<Props> = ({ groupData }) => {
  return (
    <>
      <section className="flex flex-col font-semibold text-lg gap-4">
        <div className="">About Group</div>
        <div className="flex flex-col gap-2">
        <div className="">Members: {groupData.numberOfMembers}</div>
        <div className="">Created: {groupData.dateCreated}</div>
        </div>
      </section>
    </>
  );
};

export default AboutGroup;
