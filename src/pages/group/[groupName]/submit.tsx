import Layout from "@/components/Layout";
import React, { useEffect } from "react";
import { groupState } from "@/atoms/groupsAtom";
import AboutGroup from "@/components/Group/AboutGroup";
import { useRecoilValue } from "recoil";
import NewPostForm from "@/components/Post/PostForm/NewPostForm";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { useRouter } from "next/router";
import { User } from "firebase/auth";

const CreateGroupPostPage: React.FC = ({}) => {
  const groupStateValue = useRecoilValue(groupState);
  const [user, loadingUser, error] = useAuthState(auth);
  const router = useRouter();
  
  useEffect(() => {
    if (groupStateValue.currentGroup.name === "") {
      router.push(`/`);
    } else if (!user && !loadingUser)
      if (!user && !loadingUser) {
        router.push(`/group/${groupStateValue.currentGroup.name}`);
      }
  }, [user, loadingUser, groupStateValue.currentGroup]);

  return (
    <Layout>
      <div className="flex flex-1 justify-center">
        <div className="flex flex-1 flex-col max-w-6xl p-4 gap-4">
          <div className="text-xl font-semibold p-4">Create a post</div>
          <div className="flex flex-row gap-4">
            <NewPostForm
              groupData={groupStateValue.currentGroup}
              user={user as User}
            />
            <AboutGroup groupData={groupStateValue.currentGroup} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateGroupPostPage;
