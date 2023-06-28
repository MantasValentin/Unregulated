import Layout from "@/components/Layout";
import React from "react";
import { Group, defaultGroup } from "@/atoms/groupsAtom";
import { GetServerSidePropsContext } from "next";
import GroupHeader from "@/components/Group/GroupHeader";
import CreatePost from "@/components/Group/CreatePost";
import AboutGroup from "@/components/Group/AboutGroup";
import NotFound from "@/components/Group/NotFound";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import useGroupData from "@/hooks/useGroupData";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import Posts from "@/components/Post/Posts";

interface props {
  groupData: Group;
}

const GroupPage: React.FC<props> = ({ groupData }) => {
  const { groupStateValue, onJoinOrLeaveGroup } = useGroupData();
  const [user, loadingUser, error] = useAuthState(auth);

  return (
    <Layout>
      <>
        {groupData.id !== "" ? (
          <div className="flex flex-col justify-center">
            <GroupHeader
              groupData={groupData}
              groupStateValue={groupStateValue}
              onJoinOrLeaveGroup={onJoinOrLeaveGroup}
            />
            <div className="flex flex-1 justify-center">
              <div className="flex flex-1 flex-row max-w-6xl p-4 gap-4 max-md:flex-col-reverse ">
                <div className="flex flex-1 flex-col gap-4">
                  <CreatePost />
                  <Posts userId={user?.uid as string} groupData={groupData} />
                </div>
                <AboutGroup groupData={groupData} />
              </div>
            </div>
          </div>
        ) : (
          <NotFound message="group" />
        )}
      </>
    </Layout>
  );
};

export default GroupPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Gets group data from database and returns an empty group if it doesnt exist
  try {
    const db = getFirestore();
    const groupDocRef = doc(db, "groups", context.query.groupName as string);
    const groupDocs = await getDoc(groupDocRef);
    if (groupDocs.exists()) {
      return {
        props: {
          groupData: groupDocs.data(),
        },
      };
    } else {
      return {
        props: {
          groupData: defaultGroup,
        },
      };
    }
  } catch (error) {
    console.log("getServerSideProps error - [group]", error);
  }
}
