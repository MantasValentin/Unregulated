import { authModalState } from "@/atoms/authModalAtom";
import { Group, groupState } from "@/atoms/groupsAtom";
import { auth, firestore, storage } from "@/firebase/clientApp";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { HiCubeTransparent } from "react-icons/hi";
import { useSetRecoilState } from "recoil";

interface Props {
  groupData: Group;
}

const AboutGroup: React.FC<Props> = ({ groupData }) => {
  const [user] = useAuthState(auth);
  const [selectedFile, setSelectedFile] = useState<string>();
  const setGroupStateValue = useSetRecoilState(groupState);
  const selectFileRef = useRef<HTMLInputElement>(null);

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target?.result as string);
      }
    };
  };

  const updateImage = async () => {
    if (!selectedFile) return;
    try {
      const imageRef = ref(storage, `groups/${groupData.name}/image`);
      await uploadString(imageRef, selectedFile, "data_url");
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, "groups", groupData.name), {
        imageURL: downloadURL,
      });

      setGroupStateValue((prev) => ({
        ...prev,
        currentGroup: {
          ...prev.currentGroup,
          imageURL: downloadURL,
        },
      }));
    } catch (error: any) {}
  };

  return (
    <>
      <section className="min-w-[20rem]">
        <div className="flex flex-col text-lg bg-white rounded-md max-h-fit">
          <div className="font-semibold p-4 border-b-[1px] bg-gray-300 rounded-t-md">
            About Group
          </div>
          <div className="flex flex-col p-4 gap-2">
            <div className="">Members: {groupData.numberOfMembers}</div>
            <div className="flex gap-2">Created: {groupData.dateCreated}</div>
            {groupData.creatorId === user?.uid ? (
              <div className="flex flex-col gap-2 pt-8">
                <div className="font-semibold">Admin</div>
                <div className="flex flex-row items-center">
                  <div
                    className="flex-1 text-blue-500 hover:cursor-pointer"
                    onClick={() => selectFileRef.current?.click()}
                  >
                    Change Image
                  </div>
                  <div className="">
                    {selectedFile || groupData.imageURL ? (
                      <img
                        src={selectedFile || (groupData.imageURL as string)}
                        alt=""
                        className="w-14 h-14 p-[2px] rounded-full border-gray-300 border-[1px]"
                      />
                    ) : (
                      <HiCubeTransparent
                        className="w-14 h-14 p-[2px] rounded-full border-gray-300 border-[1px]"
                        color="black"
                      />
                    )}
                  </div>
                  <input
                    hidden
                    type="file"
                    accept="image/x-png,image/gif,image/jpeg,image/jpg,image/png"
                    ref={selectFileRef}
                    onChange={(e) => {
                      onSelectImage(e);
                    }}
                  ></input>
                </div>
                {selectedFile ? (
                  <div
                    className="text-blue-500 hover:cursor-pointer"
                    onClick={updateImage}
                  >
                    Save Image
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutGroup;
