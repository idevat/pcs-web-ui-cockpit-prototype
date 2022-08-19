import { Root } from "./types";
export * from "./login";

export const getClusterNameList = (state: Root) =>
  state.dashboard.clusterNameList;

export const authError = (state: Root) => state.auth.error;
