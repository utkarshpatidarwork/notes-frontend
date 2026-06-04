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