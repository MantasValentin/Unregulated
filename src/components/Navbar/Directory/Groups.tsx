import { useState, useEffect } from "react";
import CreateGroup from "@/components/Modal/CreateGroup";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { auth } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { useListVals } from "react-firebase-hooks/database";

interface Group {
  id: string;
  groupName: string;
}

const UserGroups: React.FC = () => {
  const [createGroup, setCreateGroup] = useState(false);
  const [user, userLoading, userError] = useAuthState(auth);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  // const db = getDatabase();
  // const [values, loading, error] = useListVals(
  //   ref(db, "users/" + user?.uid + "/groups")
  // );
  // setUserGroups(values as unknown as Group[]);

  useEffect(() => {
    // get(child(ref(db), "users/" + user?.uid + "/groups"))
    //   .then((snapshot) => {
    //     if (snapshot.exists()) {
    //       const data: Group[] = Object.keys(snapshot.val()).map((key: any) => {
    //         return snapshot.val()[key];
    //       });
    // setUserGroups(data);
    //     } else {
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  }, []);

  console.log(userGroups);

  return (
    <>
      <div className="absolute top-[41px] w-60 bg-white border border-gray-300 rounded-md">
        <div className="flex flex-col">
          <p className="text-base text-left pl-2 py-2 border-b-[1px] border-b-gray-300 hover:cursor-default">
            Your Groups
          </p>
          <button
            className="flex items-center m-1 p-1 text-left hover:bg-gray-200 hover:rounded-md"
            onClick={() => setCreateGroup(!createGroup)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Create Group
          </button>
          {userGroups?.map((group: Group) => {
            return (
              <div
                key={`${group.id}`}
                className="flex items-center m-1 p-1 text-left hover:bg-gray-200 hover:rounded-md"
              >
                {group.groupName}
              </div>
            );
          })}
        </div>
      </div>
      {createGroup ? (
        <CreateGroup modalState={createGroup} setModalState={setCreateGroup} />
      ) : (
        <></>
      )}
    </>
  );
};

export default UserGroups;
