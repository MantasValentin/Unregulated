import React, { useState, useRef } from "react";
import { Group, groupState } from "@/atoms/groupsAtom";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import {
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "@/firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { postState } from "@/atoms/postsAtom";

interface Props {
  groupData: Group;
  user: User;
}

const NewPostForm: React.FC<Props> = ({ groupData, user }) => {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<string>();
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [selectedTab, setSelectedTab] = useState("Post");
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  const groupStateValue = useRecoilValue(groupState);
  const setPostItems = useSetRecoilState(postState);

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (textInputs.title === "") {
      alert("Please enter a title");
      return;
    } else if (textInputs.body === "" && selectedFile === undefined) {
      alert("Please enter text or attach a file");
      return;
    }
    // adds the post to the database
    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), {
        body: textInputs.body,
        title: textInputs.title,
        creatorId: user.uid,
        groupName: groupData.name,
        voteStatus: 0,
        numberOfComments: 0,
        authorDisplayName: user.email!.split(`@`)[0],
        createdAt: serverTimestamp(),
        editedAt: serverTimestamp(),
      });

      if (groupData.imageURL) {
        await updateDoc(postDocRef, {
          groupImageUrl: groupData.imageURL,
        });
      }

      // if the post contains a image then it gets added to the cloud storage and the URL gets added to the post
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      }
      setPostItems((prev) => ({
        ...prev,
        postUpdateRequired: true,
      }));
      router.back();
    } catch (error: any) {
      console.log("handleSubmit error", error.message);
    }
  };

  // changes the post title or body on user input
  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTextInputs((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  // changes the image
  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const reader = new FileReader();
    const fileTypes = ["jpg", "jpeg", "png"];
    // event.target.files![0].type.split(`/`)[1] gets the file format and then matches it with the accepted file formats
    if (fileTypes.indexOf(event.target.files![0].type.split(`/`)[1]) > -1) {
    } else {
      return setError("Only images with format .jpg, .jpeg, .png are allowed");
    }
    // if a file is selected
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    } else {
      return setError("No file selected");
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string);
      }
    };
  };

  return (
    <>
      <div className="flex flex-1 flex-col bg-white rounded-md">
        <div className="flex border-b-[1px]">
          <div
            className={`flex flex-auto p-4 justify-center rounded-tl-md hover:bg-gray-300 hover:cursor-pointer transition ${
              selectedTab === "Post" ? "bg-gray-300" : "bg-white"
            }`}
            onClick={() => setSelectedTab("Post")}
          >
            Post
          </div>
          <div
            className={`flex flex-auto p-4 justify-center rounded-tr-md hover:bg-gray-300 hover:cursor-pointer transition ${
              selectedTab === "Images & Video" ? "bg-gray-300" : "bg-white"
            }`}
            onClick={() => setSelectedTab("Images & Video")}
          >
            Images
          </div>
        </div>
        {selectedTab === "Post" && (
          <form className="flex flex-1 flex-col p-4 gap-4">
            <input
              className="border border-gray-300 rounded-md shadow-sm opacity-70 focus:outline-none focus:opacity-100 hover:opacity-100 py-1 px-2 transition"
              type="text"
              name="title"
              placeholder="Title"
              value={textInputs.title}
              onChange={onTextChange}
              required
            />
            <textarea
              className="border border-gray-300 rounded-md shadow-sm opacity-70 focus:outline-none focus:opacity-100 hover:opacity-100 py-1 px-2 transition"
              name="body"
              rows={8}
              placeholder="Text (Optional)"
              value={textInputs.body}
              onChange={onTextChange}
            />
            <button
              className="max-w-[8rem] border border-gray-300 rounded-full shadow-sm px-3 py-2 bg-white hover:bg-gray-200"
              onClick={(e) => handleSubmit(e)}
            >
              Post
            </button>
          </form>
        )}
        {selectedTab === "Images & Video" && (
          <div className="flex w-full flex-col h-[28rem] p-4 gap-2 justify-center items-center">
            <button
              className={`w-32 border border-gray-300 rounded-full shadow-sm px-3 py-2 bg-white hover:bg-gray-200 ${
                selectedFile ? "hidden" : ""
              }`}
              onClick={() => {
                selectFileRef.current?.click();
              }}
            >
              Upload
            </button>
            <input
              hidden
              type="file"
              ref={selectFileRef}
              onChange={(e) => {
                onSelectImage(e);
              }}
            ></input>
            <img
              src={selectedFile}
              className="max-h-[24rem] max-w-[48rem]"
            ></img>
            <button
              className={`w-32 border border-gray-300 rounded-full shadow-sm px-3 py-2 bg-white hover:bg-gray-200 ${
                selectedFile ? "" : "hidden"
              }`}
              onClick={() => {
                setSelectedFile(undefined);
              }}
            >
              Remove
            </button>
            {error ? <div className="text-red-500">{error}</div> : <></>}
          </div>
        )}
      </div>
    </>
  );
};

export default NewPostForm;
