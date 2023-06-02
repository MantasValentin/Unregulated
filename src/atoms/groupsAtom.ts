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
  groupId: string;
  groupName: string;
  isModerator?: boolean;
  imageURL?: string;
}

interface GroupState {
  [key: string]:
    | GroupSnippet[]
    | { [key: string]: Group }
    | Group
    | boolean
    | undefined;
  mySnippets: GroupSnippet[];
  initSnippetsFetched: boolean;
  visitedGroups: {
    [key: string]: Group;
  };
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
  visitedGroups: {},
  currentGroup: defaultGroup,
};

export const groupState = atom<GroupState>({
  key: "groupState",
  default: defaultGroupState,
});
