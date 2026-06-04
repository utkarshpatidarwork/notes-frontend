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

export const getWorkspaceMembers =
  async (workspaceId) => {

    const { data } =
      await api.get(
        `/api/workspaces/${workspaceId}/members`
      );

    return data;
  };

export const changeMemberRole =
  async (
    workspaceId,
    memberId,
    role
  ) => {

    const { data } =
      await api.put(
        "/api/workspaces/role",
        {
          workspaceId,
          memberId,
          role
        }
      );

    return data;
  };

export const removeMember =
  async (
    workspaceId,
    memberId
  ) => {

    const { data } =
      await api.delete(
        "/api/workspaces/member",
        {
          data: {
            workspaceId,
            memberId
          }
        }
      );

    return data;
  };