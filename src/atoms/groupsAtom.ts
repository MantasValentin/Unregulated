import { atom } from "recoil";

export interface Group {
  id: string;
  name: string;
  creatorId: string;
  numberOfMembers: number;
  groupType: "public" | "restrictied" | "private";
  dateCreated?: string;
  imageURL?: string;
}

export interface GroupSnippet {
  id: string;
  groupName: string;
  isModerator?: boolean;
  imageURL?: string;
}

export interface GroupState {
  [key: string]:
    | GroupSnippet[]
    | { [key: string]: Group }
    | Group
    | boolean
    | undefined;
  mySnippets: GroupSnippet[];
  initSnippetsFetched: boolean;
  currentGroup: Group;
}

export const defaultGroup: Group = {
  id: "",
  name: "",
  creatorId: "",
  numberOfMembers: 0,
  groupType: "public",
};

export const defaultGroupState: GroupState = {
  mySnippets: [],
  initSnippetsFetched: false,
  currentGroup: defaultGroup,
};

export const groupState = atom<GroupState>({
  key: "groupState",
  default: defaultGroupState,
});

export const groupsState = atom<Group[]>({
  key: "searchGroupsState",
  default: [],
});
