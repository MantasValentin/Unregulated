import React, { useState, useCallback, useEffect } from "react";
import { Post, postState } from "@/atoms/postsAtom";
import { User } from "firebase/auth";
import CommentInput from "./Input";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import CommentItem, { Comment } from "./CommentItem";
import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";

interface props {
  user: User | null;
  SelectedPost: Post;
  groupName: string;
}

const Comments: React.FC<props> = ({ user, SelectedPost, groupName }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentFetchLoading, setCommentFetchLoading] = useState(false);
  const [commentCreateLoading, setCommentCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState("");
  const setAuthModalState = useSetRecoilState(authModalState);
  const setPostState = useSetRecoilState(postState);

  const onCreateComment = async (comment: string) => {
    if (!user) {
      setAuthModalState({ show: true, view: "login" });
      return;
    }
    
    setCommentCreateLoading(true);
    try {
      const batch = writeBatch(firestore);

      // Create comment document
      const commentDocRef = doc(collection(firestore, "comments"));
      batch.set(commentDocRef, {
        postId: SelectedPost.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split("@")[0],
        creatorPhotoURL: user.photoURL,
        groupName: groupName,
        text: comment,
        postTitle: SelectedPost.title,
        createdAt: serverTimestamp(),
      } as Comment);

      // Update post numberOfComments
      batch.update(doc(firestore, "posts", SelectedPost.id), {
        numberOfComments: increment(1),
      });
      await batch.commit();

      setComment("");
      const { id: postId, title } = SelectedPost;
      setComments((prev) => [
        {
          id: commentDocRef.id,
          creatorId: user.uid,
          creatorDisplayText: user.email!.split("@")[0],
          creatorPhotoURL: user.photoURL,
          groupName: groupName,
          postId,
          postTitle: title,
          text: comment,
          createdAt: {
            seconds: Date.now() / 1000,
          },
        } as Comment,
        ...prev,
      ]);

      // Fetch posts again to update number of comments
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
        postUpdateRequired: true,
      }));
    } catch (error: any) {
      console.log("onCreateComment error", error.message);
    }
    setCommentCreateLoading(false);
  };

  const onDeleteComment = useCallback(
    async (comment: Comment) => {
      setDeleteLoading(comment.id as string);
      try {
        if (!comment.id) throw "Comment has no ID";
        const batch = writeBatch(firestore);
        const commentDocRef = doc(firestore, "comments", comment.id);
        batch.delete(commentDocRef);

        batch.update(doc(firestore, "posts", comment.postId), {
          numberOfComments: increment(-1),
        });

        await batch.commit();

        setPostState((prev) => ({
          ...prev,
          selectedPost: {
            ...prev.selectedPost,
            numberOfComments: prev.selectedPost?.numberOfComments! - 1,
          } as Post,
          postUpdateRequired: true,
        }));

        setComments((prev) => prev.filter((item) => item.id !== comment.id));
      } catch (error: any) {
        console.log("Error deletig comment", error.message);
      }
      setDeleteLoading("");
    },
    [setComments, setPostState]
  );

  const getPostComments = async () => {
    try {
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", SelectedPost.id)
      );
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      comments.sort((a: any, b: any) => b.createdAt - a.createdAt);
      setComments(comments as Comment[]);
    } catch (error: any) {
      console.log("getPostComments error", error.message);
    }
    setCommentFetchLoading(false);
  };

  useEffect(() => {
    getPostComments();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4">
        <CommentInput
          comment={comment}
          setComment={setComment}
          loading={commentCreateLoading}
          user={user}
          onCreateComment={onCreateComment}
        />
        <div className="flex flex-col gap-2">
          <>
            {comments.map((item) => (
              <CommentItem
                key={item.id}
                comment={item}
                onDeleteComment={onDeleteComment}
                isLoading={deleteLoading === (item.id as string)}
                userId={user?.uid}
              />
            ))}
          </>
        </div>
      </div>
    </>
  );
};

export default Comments;
