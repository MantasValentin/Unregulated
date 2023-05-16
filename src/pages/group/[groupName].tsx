import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getDatabase, ref, set, get, child, onValue } from "firebase/database";
import { Group, defaultGroup } from "@/atoms/groupsAtom";

const GroupPage: React.FC = () => {
  const [groupData, setGroupData] = useState<Group>(defaultGroup);

  const { query } = useRouter();
  const { groupName } = query;
  const db = getDatabase();

  // gets groups data
  useEffect(() => {
    get(child(ref(db), `groups/${groupName}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setGroupData(snapshot.val());
          console.log(groupData, snapshot.val(), groupName);
        } else {
        }
      })
      .catch((error) => {
        console.error(error);
      });
    return () => {
    };
  }, []);

  return (
    <Layout>
      <div>{groupData.creatorId}</div>
    </Layout>
  );
};

export default GroupPage;
