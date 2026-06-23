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

    const { data } =
      await api.get(
        `/api/notes/trash?workspace=${workspaceId}`
      );

    return data;
  };

export const restoreNote =
  async (id) => {

    const { data } =
      await api.put(
        `/api/notes/restore/${id}`
      );

    return data;
  };

export const permanentlyDeleteNote =
  async (id) => {

    const { data } =
      await api.delete(
        `/api/notes/permanent/${id}`
      );

    return data;
  };

  export const getNoteVersions =
  async (id) => {

    const { data } =
      await api.get(
        `/api/notes/versions/${id}`
      );

    return data;
  };

export const restoreNoteVersion =
  async (
    id,
    versionIndex
  ) => {

    const { data } =
      await api.put(
        `/api/notes/restore-version/${id}`,
        {
          versionIndex
        }
      );

    return data;
  };