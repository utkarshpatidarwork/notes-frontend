//workspaceService.js
import api from "./api";

export const getWorkspaces =
  async () => {

    const { data } =
      await api.get(
        "/api/workspaces"
      );

    return data;
  };

export const createWorkspace =
  async (name) => {

    const { data } =
      await api.post(
        "/api/workspaces",
        { name }
      );

    return data;
  };

export const joinWorkspace =
  async (inviteCode) => {

    const { data } =
      await api.post(
        "/api/workspaces/join",
        { inviteCode }
      );

    return data;
  };