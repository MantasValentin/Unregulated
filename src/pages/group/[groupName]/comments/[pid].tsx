import Layout from "@/components/Layout";
import React, { useEffect } from "react";
import AboutGroup from "@/components/Group/AboutGroup";
import NotFound from "@/components/Group/NotFound";
import useGroupData from "@/hooks/useGroupData";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import { useRouter } from "next/router";
import PostItem from "@/components/Post/PostItem";
import usePosts from "@/hooks/usePosts";
import { Post } from "@/atoms/postsAtom";
import Comments from "@/components/Post/Comments";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface props {}

const PostPage: React.FC<props> = ({}) => {
  const { groupStateValue } = useGroupData();
  const [user, loadingUser, error] = useAuthState(auth);
  const router = useRouter();
  const { groupName, pid } = router.query;
  const {
    postStateValue,
    setPostStateValue,
    onDeletePost,
    loading,
    setLoading,
    onVote,
  } = usePosts(groupStateValue.currentGroup);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const postDocRef = doc(firestore, "posts", pid as string);
      const postDoc = await getDoc(postDocRef);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error: any) {
      console.log("fetchPost error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const { pid } = router.query;

    if (pid && !postStateValue.selectedPost) {
      fetchPost();
    }
  }, [router.query, postStateValue.selectedPost]);

  return (
    <Layout>
      <>
        {loading ? (
          ""
        ) : (
          <>
            {groupStateValue.currentGroup.id !== "" ? (
              <div className="flex flex-col justify-center">
                <div className="flex flex-1 justify-center">
                  <div className="flex flex-1 flex-row max-w-6xl p-4 gap-4 max-md:flex-col-reverse ">
                    <div className="flex flex-1 flex-col gap-4">
                      <PostItem
                        post={postStateValue.selectedPost as Post}
                        onVote={onVote}
                        onDeletePost={onDeletePost}
                        userIsCreator={
                          user?.uid === postStateValue.selectedPost?.creatorId
                        }
                        userVoteValue={
                          postStateValue.postVotes.find(
                            (item) =>
                              item.postId === postStateValue.selectedPost?.id
                          )?.voteValue
                        }
                        router={router}
                        homePage
                      />
                      <Comments
                        user={user as User | null}
                        groupName={groupName as string}
                        SelectedPost={postStateValue.selectedPost as Post}
                      />
                    </div>
                    <AboutGroup groupData={groupStateValue.currentGroup} />
                  </div>
                </div>
              </div>
            ) : (
              <NotFound message="post" />
            )}
          </>
        )}
      </>
    </Layout>
  );
};

export default PostPage;
