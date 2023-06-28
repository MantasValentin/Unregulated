import React, { useState, Dispatch, SetStateAction } from "react";
import { auth } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getFirestore, runTransaction, setDoc } from "firebase/firestore";

interface props {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
}

const CreateGroup: React.FC<props> = ({ modalState, setModalState }) => {
  const [user, loading, error] = useAuthState(auth);

  const [groupName, setGroupName] = useState("");
  const [groupType, setGroupType] = useState("");
  const [nameError, setNameError] = useState("");

  const createGroup = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (
      format.test(groupName) ||
      groupName.length < 3 ||
      groupName.length > 21
    ) {
      return setNameError(
        "Group names must be between 3–21 characters, and can only contain letters, numbers, or underscores."
      );
    } else {
      setNameError("");
    }

    if (groupType == "") {
      return setNameError("Pick a group type");
    } else {
      setNameError("");
    }

    const db = getFirestore();
    const date = new Date(Date.now());
    const id = String(Math.floor(Math.random() * 10000000));

    try {
      const groupDocRef = doc(db, "groups", groupName);
      await runTransaction(db, async (transaction) => {
        const groupDoc = await transaction.get(groupDocRef);
        if (groupDoc.exists()) {
          throw new Error(`Sorry, ${groupName} is taken. Try another.`);
        }

        transaction.set(groupDocRef, {
          id: id,
          name: groupName,
          creatorId: user?.uid,
          numberOfMembers: 1,
          groupType: groupType,
          dateCreated: `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}`,
        });

        transaction.set(
          doc(db, `users/${user?.uid}/groupSnippets`, groupName),
          {
            id: id,
            groupName: groupName,
            isModerator: true,
            imageURL: "",
          }
        );
        
        setModalState(!modalState);
        window.location.reload();
      });
    } catch (error: any) {
      console.log("Transaction error", error);
      setNameError(error.message);
    }
  };

  return (
    <>
      <div className="justify-center items-center flex fixed inset-0 px-6 z-50">
        <div className="flex flex-1 flex-col max-w-xl border-gray-400 border-solid border rounded-lg shadow-xl bg-white pb-4">
          <div className="flex flex-row border-b border-b-gray-300">
            <div className="flex items-center flex-row p-3 text-gray-700 rounded-tl-md">
              <p className="text-xl mr-2">Create a group</p>
            </div>

            <button
              className="flex items-center justify-end flex-1 p-3 text-gray-700 hover:bg-gray-200 rounded-tr-md transition"
              onClick={() => {
                setModalState(!modalState);
              }}
            >
              <span className="text-xl">X</span>
            </button>
          </div>
          <form className="flex flex-col gap-2 items-start px-4 pt-6">
            <div className="flex w-full flex-col items-start">
              <div className="font-semibold pb-1 text-lg">Name</div>
              <input
                className="w-full border border-gray-300 rounded-md shadow-sm opacity-70 focus:outline-none focus:opacity-100 hover:opacity-100 py-1 px-2 transition"
                type="text"
                name="groupname"
                placeholder="Group Name"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setGroupName(e.target.value)
                }
                value={groupName}
                required
              ></input>
            </div>
            <div className="flex w-full flex-col items-start gap-2">
              <div className="font-semibold pb-1 text-lg">Type</div>
              <label className="flex flex-row items-center gap-2">
                <input
                  className=""
                  type="radio"
                  name="groupType"
                  value="public"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setGroupType(e.target.value)
                  }
                  required
                ></input>
                Public{" "}
                <span className="text-start text-sm opacity-60">
                  Anyone can view, post, comment to this group
                </span>
              </label>
              {/* <label className="flex flex-row items-center gap-2">
                <input
                  className="flex items-center justify-center"
                  type="radio"
                  name="groupType"
                  value="restricted"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setGroupType(e.target.value)
                  }
                  required
                ></input>
                Restricted{" "}
                <span className="text-start text-sm opacity-60">
                  Anyone can view this group, but only approved users can post
                </span>
              </label> */}
              {/* <label className="flex flex-row items-center gap-2">
                <input
                  className=""
                  type="radio"
                  name="groupType"
                  value="private"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setGroupType(e.target.value)
                  }
                  required
                ></input>
                Private{" "}
                <span className="text-start text-sm opacity-60">
                  Only appoved users can view and post to this group
                </span>
              </label> */}
            </div>
            <div className="w-full flex justify-center items-center text-center text-red-500">
              {nameError}
            </div>
            <div className="flex justify-center w-full">
              <button
                className="flex-1 max-w-[10rem] border border-gray-300 rounded-full shadow-sm px-3 py-2 hover:bg-gray-200 text-lg transition"
                type="submit"
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                  createGroup(e)
                }
              >
                <span className="">Confirm</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default CreateGroup;
