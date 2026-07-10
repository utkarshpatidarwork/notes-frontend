//adminService.js
import api from "./api";

export const getDashboard =
  async () => {

    const { data } =
      await api.get(
        "/api/admin/dashboard"
      );

    return data;
  };

export const getUsers =
  async (
    page = 1,
    search = ""
  ) => {

    const { data } =
      await api.get(
        `/api/admin/users?page=${page}&search=${search}`
      );

    return data;
  };

export const toggleAdmin =
  async (id) => {

    const { data } =
      await api.put(
        `/api/admin/users/${id}/role`
      );

    return data;
  };

export const toggleStatus =
  async (id) => {

    const { data } =
      await api.put(
        `/api/admin/users/${id}/status`
      );

    return data;
  };

export const deleteUser =
  async (id) => {

    const { data } =
      await api.delete(
        `/api/admin/users/${id}`
      );

    return data;
  };

export const getWorkspaces =
  async (
    page = 1,
    search = ""
  ) => {

    const { data } =
      await api.get(
        `/api/admin/workspaces?page=${page}&search=${search}`
      );

    return data;
  };

export const deleteWorkspace =
  async (id) => {

    const { data } =
      await api.delete(
        `/api/admin/workspaces/${id}`
      );

    return data;
  };

export const getNotes =
  async (
    page = 1,
    search = ""
  ) => {

    const { data } =
      await api.get(
        `/api/admin/notes?page=${page}&search=${search}`
      );

    return data;

  };

export const deleteNote =
  async (id) => {

    const { data } =
      await api.delete(
        `/api/admin/notes/${id}`
      );

    return data;

  };

export const getActivities =
  async (
    page = 1,
    search = ""
  ) => {

    const { data } =
      await api.get(
        `/api/admin/activities?page=${page}&search=${search}`
      );

    return data;

  };