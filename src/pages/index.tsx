import { groupState } from "@/atoms/groupsAtom";
import Layout from "@/components/Layout";
import { auth, firestore } from "@/firebase/clientApp";
import useGroupData from "@/hooks/useGroupData";
import usePosts from "@/hooks/usePosts";
import {
  DocumentData,
  QuerySnapshot,
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Inter } from "next/font/google";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { useEffect } from "react";
import { Post, PostVote } from "@/atoms/postsAtom";
import PostItem from "@/components/Post/PostItem";
import PostLoader from "@/components/Post/Loader";
import TopGroups from "@/components/Group/TopGroups";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const {} = useGroupData();
  const [user, loadingUser] = useAuthState(auth);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
    loading,
    setLoading,
  } = usePosts();
  const groupStateValue = useRecoilValue(groupState);

  const getUserHomePosts = async () => {
    setLoading(true);
    try {
      const feedPosts: Post[] = [];

      if (groupStateValue.mySnippets.length) {
        const myGroupIds = groupStateValue.mySnippets.map(
          (snippet) => snippet.groupName
        );
        let postPromises: Array<Promise<QuerySnapshot<DocumentData>>> = [];
        [0, 1, 2].forEach((index) => {
          if (!myGroupIds[index]) return;

          postPromises.push(
            getDocs(
              query(
                collection(firestore, "posts"),
                where("groupName", "==", myGroupIds[index]),
                limit(3)
              )
            )
          );
        });
        const queryResults = await Promise.all(postPromises);
        queryResults.forEach((result) => {
          const posts = result.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Post[];
          feedPosts.push(...posts);
        });
      } else {
        const postQuery = query(
          collection(firestore, "posts"),
          orderBy("voteStatus", "desc"),
          limit(10)
        );
        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        feedPosts.push(...posts);
      }

      setPostStateValue((prev) => ({
        ...prev,
        posts: feedPosts,
      }));
    } catch (error: any) {
      console.log("getUserHomePosts error", error.message);
    }
    setLoading(false);
  };

  const getNoUserHomePosts = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(10)
      );
      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.log("getNoUserHomePosts error", error.message);
    }
    setLoading(false);
  };

  const getUserPostVotes = async () => {
    const postIds = postStateValue.posts.map((post) => post.id);
    const postVotesQuery = query(
      collection(firestore, `users/${user?.uid}/postVotes`),
      where("postId", "in", postIds)
    );
    const unsubscribe = onSnapshot(postVotesQuery, (querySnapshot) => {
      const postVotes = querySnapshot.docs.map((postVote) => ({
        id: postVote.id,
        ...postVote.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    if (!groupStateValue.initSnippetsFetched) return;

    if (user) {
      getUserHomePosts();
    }
  }, [user, groupStateValue.initSnippetsFetched]);

  useEffect(() => {
    if (!user && !loadingUser) {
      getNoUserHomePosts();
    }
  }, [user, loadingUser]);

  useEffect(() => {
    if (!user?.uid || !postStateValue.posts.length) return;
    getUserPostVotes();

    // Clear postVotes on dismount
    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    };
  }, [postStateValue.posts, user?.uid]);

  return (
    <Layout>
      {loading ? (
        <PostLoader />
      ) : (
        <div className="flex flex-1 justify-center">
          <div className="flex flex-1 flex-row max-w-6xl p-4 gap-4 max-md:flex-col-reverse ">
            <div className="flex flex-col gap-4">
              {postStateValue.posts.map((post: Post, index) => (
                <PostItem
                  key={post.id}
                  post={post}
                  onVote={onVote}
                  onDeletePost={onDeletePost}
                  userIsCreator={user?.uid === post.creatorId}
                  userVoteValue={
                    postStateValue.postVotes.find(
                      (item) => item.postId === post.id
                    )?.voteValue
                  }
                  homePage
                />
              ))}
            </div>
            <TopGroups />
          </div>
        </div>
      )}
    </Layout>
  );
}
