import { authModalState } from "@/atoms/authModalAtom";
import { Group, groupState } from "@/atoms/groupsAtom";
import { Post, PostVote, postState } from "@/atoms/postsAtom";
import { auth, firestore, storage } from "@/firebase/clientApp";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const usePosts = (groupData?: Group) => {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const [error, setError] = useState("");
  const router = useRouter();
  const groupStateValue = useRecoilValue(groupState);
  const setAuthModalState = useSetRecoilState(authModalState);

  const onSelectPost = (post: Post, postIdx: number) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: { ...post, postIdx },
    }));
    router.push(`/group/${post.groupName}/comments/${post.id}`);
  };

  const onVote = async (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>,
    post: Post,
    vote: number,
    groupName: string
  ) => {
    event.stopPropagation();
    if (!user?.uid) {
      setAuthModalState({ show: true, view: "login" });
      return;
    }

    try {
      let voteChange = vote;
      const { voteStatus } = post;
      const existingVote = postStateValue.postVotes.find(
        (item) => item.postId === post.id
      );

      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];

      const batch = writeBatch(firestore);

      if (!existingVote) {
        const postVoteRef = doc(
          collection(firestore, "users", `${user.uid}/postVotes`)
        );

        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id,
          groupName: groupName,
          voteValue: vote,
        };

        batch.set(postVoteRef, newVote);

        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      } else {
        const postVoteRef = doc(
          firestore,
          "users",
          `${user.uid}/postVotes/${existingVote.id}`
        );

        if (existingVote.voteValue === vote) {
          voteChange *= -1;
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVote.id
          );
          batch.delete(postVoteRef);
        } else {
          voteChange = 2 * vote;
          updatedPost.voteStatus = voteStatus + 2 * vote;
          const voteIdx = postStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVote.id
          );

          if (voteIdx !== -1) {
            updatedPostVotes[voteIdx] = {
              ...existingVote,
              voteValue: vote,
            };
          }
          batch.update(postVoteRef, {
            voteValue: vote,
          });
        }
      }

      let updatedState = { ...postStateValue, postVotes: updatedPostVotes };

      const postIdx = postStateValue.posts.findIndex(
        (item) => item.id === post.id
      );

      updatedPosts[postIdx!] = updatedPost;
      updatedState = {
        ...updatedState,
        posts: updatedPosts,
        postsCache: {
          ...updatedState.postsCache,
          [groupName]: updatedPosts,
        },
      };

      if (updatedState.selectedPost) {
        updatedState = {
          ...updatedState,
          selectedPost: updatedPost,
        };
      }

      setPostStateValue(updatedState);

      const postRef = doc(firestore, "posts", post.id);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });
      await batch.commit();
    } catch (error) {
      console.log("Vote failed", error);
    }
  };

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      // if post has an image url, delete it from storage
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }

      // delete post from posts collection
      const postDocRef = doc(firestore, "posts", post.id);
      await deleteDoc(postDocRef);

      // Update post state
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
        postsCache: {
          ...prev.postsCache,
          [post.groupName]: prev.postsCache[post.groupName].filter(
            (item) => item.id !== post.id
          ),
        },
      }));
      return true;
    } catch (error) {
      console.log("Failed to delete post", error);
      return false;
    }
  };

  const getGroupPostVotes = async (groupName: string) => {
    const postVotesQuery = query(
      collection(firestore, `users/${user?.uid}/postVotes`),
      where("groupName", "==", groupName)
    );
    const postVoteDocs = await getDocs(postVotesQuery);
    const postVotes = postVoteDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }));

    // const unsubscribe = onSnapshot(postVotesQuery, (querySnapshot) => {
    //   const postVotes = querySnapshot.docs.map((postVote) => ({
    //     id: postVote.id,
    //     ...postVote.data(),
    //   }));

    // });

    // return () => unsubscribe();
  };

  useEffect(() => {
    if (!user?.uid || !groupStateValue.currentGroup) return;
    getGroupPostVotes(groupStateValue.currentGroup.name);
  }, [user, groupStateValue.currentGroup]);

  useEffect(() => {
    // Logout or no authenticated user
    if (!user?.uid && !loadingUser) {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
      return;
    }
  }, [user, loadingUser]);

  return {
    postStateValue,
    setPostStateValue,
    onSelectPost,
    onDeletePost,
    loading,
    setLoading,
    onVote,
    error,
  };
};

export default usePosts;
