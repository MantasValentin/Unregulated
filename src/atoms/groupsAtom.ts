import { atom } from "recoil";

export interface Group {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  groupType: "public" | "restrictied" | "private";
  dateCreated?: string;
  imageURL?: string;
}

export interface GroupSnippet {
  communityId: string;
  isModerator?: boolean;
  imageURL?: string;
}

export const defaultGroup: Group = {
  id: "",
  creatorId: "",
  numberOfMembers: 0,
  groupType: "public",
};
