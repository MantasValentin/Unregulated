import { Group } from "@/atoms/groupsAtom";
import { Post } from "@/atoms/postsAtom";
import { firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import PostLoader from "./Loader";
import PostItem from "./PostItem";

interface props {
  userId: string;
  groupData: Group;
}

const Posts: React.FC<props> = ({ groupData, userId }) => {
  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onDeletePost,
    onSelectPost,
    onVote,
  } = usePosts(groupData!);

  useEffect(() => {
    if (
      postStateValue.postsCache[groupData.name] &&
      !postStateValue.postUpdateRequired
    ) {
      setPostStateValue((prev) => ({
        ...prev,
        posts: postStateValue.postsCache[groupData.name],
      }));
      return;
    }

    getPosts();
  }, [groupData.name]);

  const getPosts = async () => {
    setLoading(true);
    try {
      // gets the posts
      const postDocRef = collection(firestore, "posts");
      const postsQuery = query(
        postDocRef,
        where("groupName", "==", groupData.name)
      );
      const postDocs = await getDocs(postsQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // sorts the posts by date in descending order
      posts.sort((a: any, b: any) => b.createdAt - a.createdAt);
      // saves the posts in state
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
        postsCache: {
          ...prev.postsCache,
          [groupData.name]: posts as Post[],
        },
        postUpdateRequired: false,
      }));
    } catch (error) {
      console.log("Failed to get the posts", error);
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <div className="flex flex-col gap-4">
          {postStateValue.posts.map((post: Post, index) => (
            <PostItem
              key={post.id}
              post={post}
              onVote={onVote}
              onDeletePost={onDeletePost}
              userIsCreator={userId === post.creatorId}
              userVoteValue={
                postStateValue.postVotes.find((item) => item.postId === post.id)
                  ?.voteValue
              }
              postIdx={index}
              onSelectPost={onSelectPost}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
