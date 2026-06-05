//noteService.js
import api from "./api";

export const getNotes =
  async (workspaceId) => {

    const { data } =
      await api.get(
        `/api/notes?workspace=${workspaceId}`
      );

    return data;
  };

export const createNote =
  async (noteData) => {

    const { data } =
      await api.post(
        "/api/notes",
        noteData
      );

    return data;
  };

export const updateNote =
  async (
    noteId,
    noteData
  ) => {

    const { data } =
      await api.put(
        `/api/notes/${noteId}`,
        noteData
      );

    return data;
  };

export const deleteNote =
  async (noteId) => {

    const { data } =
      await api.delete(
        `/api/notes/${noteId}`
      );

    return data;
  };

export const getArchivedNotes =
  async (workspaceId) => {

    const token =
      localStorage.getItem("token");

    const config = {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    };

    const { data } =
      await axios.get(
        `${API_URL}/api/notes/trash?workspace=${workspaceId}`,
        config
      );

    return data;
  };

export const restoreNote =
  async (id) => {

    const token =
      localStorage.getItem("token");

    const config = {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    };

    const { data } =
      await axios.put(
        `${API_URL}/api/notes/restore/${id}`,
        {},
        config
      );

    return data;
  };

export const permanentlyDeleteNote =
  async (id) => {

    const token =
      localStorage.getItem("token");

    const config = {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    };

    const { data } =
      await axios.delete(
        `${API_URL}/api/notes/permanent/${id}`,
        config
      );

    return data;
  };