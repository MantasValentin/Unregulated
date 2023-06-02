import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";
import { getDatabase, ref, get, child } from "firebase/database";
import { Group } from "@/atoms/groupsAtom";
import { GetServerSidePropsContext } from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import GroupHeader from "@/components/Group/GroupHeader";
import CreatePost from "@/components/Group/CreatePost";
import AboutGroup from "@/components/Group/AboutGroup";
import NotFound from "@/components/Group/NotFound";
import { useListVals } from "react-firebase-hooks/database";
import { doc, getDoc, getFirestore } from "firebase/firestore";

interface props {
  groupData: Group;
}

const GroupPage: React.FC<props> = ({ groupData }) => {
  return (
    <Layout>
      <>
        {groupData !== null ? (
          <div className="flex flex-col justify-center">
            <GroupHeader
              // user={user as User}
              groupData={groupData}
              // userData={userData}
              // setUserData={setUserData}
            />
            <div className="flex flex-row max-w-6xl p-4 gap-4">
              <div className="flex-1">
                <CreatePost
                // user={user as User}
                // groupData={groupData}
                // userData={userData}
                // setUserData={setUserData}
                />
              </div>
              <AboutGroup
                // user={user as User}
                groupData={groupData}
                // userData={userData}
                // setUserData={setUserData}
              />
            </div>
          </div>
        ) : (
          <NotFound />
        )}
      </>
    </Layout>
  );
};

export default GroupPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const db = getFirestore();
    const groupDocRef = doc(db, "groups", context.query.groupName as string);
    const groupDocs = await getDoc(groupDocRef);
    return {
      props: {
        groupData: groupDocs.data(),
      },
    };
  } catch (error) {
    console.log("getServerSideProps error - [group]", error);
  }
}
