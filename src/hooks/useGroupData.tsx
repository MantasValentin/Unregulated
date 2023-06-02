import React, { useState, useEffect } from "react";
import {
  Group,
  GroupSnippet,
  defaultGroup,
  groupState,
} from "@/atoms/groupsAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { child, get, getDatabase, ref } from "firebase/database";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  query,
  writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { authModalState } from "@/atoms/authModalAtom";

const useGroupData = () => {
  const [user, userLoading, userError] = useAuthState(auth);
  const [groupStateValue, setGroupStateValue] = useRecoilState(groupState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const db = getFirestore();
  const router = useRouter();

  useEffect(() => {
    // user needs to be logged in and there needs to be no data to fech the snippet data
    if (!user || !!groupStateValue.mySnippets.length) return;

    console.log("get snippet data");
    getSnippets();
  }, [user]);

  // gets the users joined groups
  const getSnippets = async () => {
    setLoading(true);
    try {
      const snippetQuery = query(
        collection(db, `users/${user?.uid}/groupSnippets`)
      );
      const snippetDocs = await getDocs(snippetQuery);
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      setGroupStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as GroupSnippet[],
        initSnippetsFetched: true,
      }));
      setLoading(false);
    } catch (error) {
      console.log("getServerSideProps error - [group]", error);
    }
    setLoading(false);
  };

  // gets the specific group data
  const getGroupData = async (groupName: string) => {
    try {
      const groupDocRef = doc(db, "groups", groupName as string);
      const groupDoc = await getDoc(groupDocRef);
      // setCommunityStateValue((prev) => ({
      //   ...prev,
      //   visitedCommunities: {
      //     ...prev.visitedCommunities,
      //     [communityId as string]: {
      //       id: communityDoc.id,
      //       ...communityDoc.data(),
      //     } as Community,
      //   },
      // }));
      setGroupStateValue((prev) => ({
        ...prev,
        currentGroup: {
          ...groupDoc.data(),
        } as Group,
      }));
    } catch (error) {
      console.log("getGroupData error", error);
    }
    setLoading(false);
  };

  // a function to join or leave a group, used on button click
  const onJoinOrLeaveGroup = (groupData: Group, isJoined?: boolean) => {
    // user needs to be signed in to leave or join a group
    if (!user) {
      setAuthModalState({ show: true, view: "login" });
      return;
    }

    if (isJoined) {
      leaveGroup(groupData.name);
    } else {
      joinGroup(groupData);
    }
  };

  const joinGroup = async (group: Group) => {
    try {
      const batch = writeBatch(db);
      const newSnippet: GroupSnippet = {
        groupId: group.id,
        groupName: group.name,
        imageURL: group.imageURL || "",
      };

      // adds the group to the users joined groups
      batch.set(doc(db, `users/${user?.uid}/groupSnippets/${group.name}`), {
        newSnippet,
      });

      batch.update(doc(db, "groups", group.name), {
        numberOfMembers: increment(1),
      });
    } catch (error) {
      console.log("joinGroup error", error);
    }
    setLoading(false);
  };

  const leaveGroup = async (groupName: string) => {
    try {
      const batch = writeBatch(db);

      // deletes the group from the users joined groups
      batch.delete(doc(db, `users/${user?.uid}/groupSnippets/${groupName}`));

      batch.update(doc(db, "groups", groupName), {
        numberOfMembers: increment(-1),
      });
    } catch (error) {
      console.log("leaveGroup error", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const { groupName } = router.query;
    // if the path exists gets the group data but if it doesnt then returns an empty group
    if (groupName) {
      const groupData = groupStateValue.currentGroup;
      if (!groupData.id) {
        console.log("get group data");
        getGroupData(groupName as string);
        return;
      }
    } else {
      setGroupStateValue((prev) => ({
        ...prev,
        currentGroup: defaultGroup,
      }));
    }
  }, [router.query, groupStateValue.currentGroup]);

  console.log(groupStateValue);

  return {
    groupStateValue,
    onJoinOrLeaveGroup,
    loading,
    setLoading,
    error,
  };
};

export default useGroupData;
