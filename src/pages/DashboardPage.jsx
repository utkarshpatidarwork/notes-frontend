//DashboardPage.jsx
import {
  useEffect,
  useState
} from "react";

import {
  getNotes,
  createNote as createNoteService,
  updateNote as updateNoteService,
  deleteNote as deleteNoteService,
  getArchivedNotes,
  restoreNote,
  permanentlyDeleteNote
} from "../services/noteService";

import {
  getWorkspaces,
  createWorkspace,
  joinWorkspace,
  getWorkspaceMembers,
  changeMemberRole,
  removeMember,
  leaveWorkspace,
  deleteWorkspace,
  transferOwnership,
  renameWorkspace
} from "../services/workspaceService";

import {
  uploadFile as uploadFileService
} from "../services/uploadService";

import { getActivities } from "../services/activityService";

import ConfirmModal
  from "../components/ConfirmModal";

import toast from "react-hot-toast";

import { io } from "socket.io-client";

import { formatDistanceToNow } from "date-fns";

import {
  useNavigate
} from "react-router-dom";

import Navbar from "../components/Navbar";

import SearchBar from "../components/SearchBar";

import CategoryFilters from "../components/CategoryFilters";

import NoteCard from "../components/NoteCard";

import NoteModal from "../components/NoteModal";

function DashboardPage() {

  const [notes, setNotes] =
    useState([]);

  const [title, setTitle] =
    useState("");

  const [content, setContent] =
    useState("");

  const [category, setCategory] =
    useState("General");

  const [attachments, setAttachments] =
    useState([]);

  const [editingId, setEditingId] =
    useState(null);

  const [
    uploadCount,
    setUploadCount
  ] = useState(0);

  const uploading =
    uploadCount > 0;

  const [creating, setCreating] =
    useState(false);

  const [
    actionLoading,
    setActionLoading
  ] = useState(null);

  const [
    creatingWorkspace,
    setCreatingWorkspace
  ] = useState(false);

  const [
    joiningWorkspace,
    setJoiningWorkspace
  ] = useState(false);

  const [search, setSearch] =
    useState("");

  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [darkMode, setDarkMode] =
    useState(
      localStorage.getItem("theme")
        === "dark"
    );

  const [selectedNote, setSelectedNote] =
    useState(null);

  const [workspaces, setWorkspaces] =
    useState([]);

  const [workspaceName, setWorkspaceName] =
    useState("");

  const [
    renameWorkspaceName,
    setRenameWorkspaceName
  ] = useState("");

  const [
    workspaceDescription,
    setWorkspaceDescription
  ] = useState("");

  const [
    editingWorkspace,
    setEditingWorkspace
  ] = useState(false);

  const [selectedWorkspace, setSelectedWorkspace] =
    useState(() => {

      const saved =
        localStorage.getItem(
          "selectedWorkspace"
        );

      return saved
        ? JSON.parse(saved)
        : null;
    });

  const [inviteCode, setInviteCode] =
    useState("");

  const [members, setMembers] =
    useState([]);

  const [membersLoading, setMembersLoading] =
    useState(false);

  const [memberSearch, setMemberSearch] = 
    useState("");

  const [notesLoading, setNotesLoading] =
    useState(false);

  const [workspaceLoading, setWorkspaceLoading] =
    useState(false);

  const [activities, setActivities] =
    useState([]);

  const [activityFilter, setActivityFilter] =
    useState("ALL");

  const [trashNotes, setTrashNotes] =
    useState([]);

  const [showTrash, setShowTrash] =
    useState(false);

  const [confirmOpen, setConfirmOpen] =
    useState(false);

  const [confirmConfig, setConfirmConfig] =
    useState({});

  const currentUser =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  const reqUserId =
    currentUser?._id;

  const currentMember =
  members.find(
    (member) =>
      String(member.user._id)
      ===
      String(reqUserId)
  );

const currentRole =
  currentMember?.role;

const canWrite =
  currentRole === "owner"
  ||
  currentRole === "editor";

const isOwner =
  currentRole === "owner";

  const navigate = useNavigate();

  const API =
    import.meta.env.VITE_API_URL;

  const [socket] = useState(
    () => io(API)
  );

  const logoutHandler = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/");
  };

  const fetchWorkspaces =
    async () => {

      try {

        setWorkspaceLoading(true);

        const data =
          await getWorkspaces();

        setWorkspaces(data);

        if (data.length > 0) {

          const currentWorkspace =
            selectedWorkspace
              ? data.find(
                  (workspace) =>
                    workspace._id ===
                    selectedWorkspace._id
                )
              : null;

          const savedId =
            localStorage.getItem(
              "selectedWorkspace"
            );

          const savedWorkspace =
            savedId
              ? data.find(
                  (workspace) =>
                    workspace._id ===
                    JSON.parse(savedId)._id
                )
              : null;

          const updatedWorkspace =
            currentWorkspace
            ||
            savedWorkspace
            ||
            data[0];

          setSelectedWorkspace(
            updatedWorkspace
          );

        } else {

          setSelectedWorkspace(
            null
          );

          setNotes([]);
          setMembers([]);
          setActivities([]);
          setTrashNotes([]);
        }

      } catch (error) {

        toast.error(
          error.response?.data?.message
          ||
          "Workspace fetch failed"
        );

      } finally {

        setWorkspaceLoading(false);
      }
    };

  const fetchNotes = async () => {

    if (!selectedWorkspace) {
      
      setNotes([]);
      
      return;
    }

    try {

      setNotesLoading(true);

      const data =
        await getNotes(
          selectedWorkspace._id
        );

      setNotes(data.notes);

    } catch (error) {

      toast.error(
        error.response?.data?.message
        ||
        "Something went wrong"
      );

    } finally {

      setNotesLoading(false);
    }
  };

  const fetchTrashNotes =
    async () => {

      if (!selectedWorkspace) {
        
        setTrashNotes([]);
        
        return;
      }

      try {

        const data =
          await getArchivedNotes(
            selectedWorkspace._id
          );

        setTrashNotes(data);

      } catch (error) {

        console.log(error);
      }
    };

  const fetchActivities =
    async () => {

      if (
        !selectedWorkspace?._id
      ) {

        setActivities([]);

        return;
      }

      try {

        const data =
          await getActivities(
            selectedWorkspace._id
          );

        setActivities(data);

      } catch (error) {

        console.log(error);
      }
    };

  const fetchMembers =
    async () => {

      if (!selectedWorkspace) {
        
        setMembers([]);
        
        return;
      }

      try {

        setMembersLoading(true);

        const data =
          await getWorkspaceMembers(
            selectedWorkspace._id
          );

        setMembers(data);

      } catch (error) {

        toast.error(
          error.response?.data?.message
          ||
          "Failed to load members"
        );

      } finally {

        setMembersLoading(false);
      }
    };

  useEffect(() => {

    fetchWorkspaces();

  }, []);

  useEffect(() => {

    if (selectedWorkspace) {

      socket.emit(
        "joinWorkspace",
        selectedWorkspace._id
      );

      fetchNotes();
      fetchMembers();
      fetchActivities();
      fetchTrashNotes();
    }

    socket.on(
      "notesUpdated",
      () => {

        fetchNotes();
      }
    );

    socket.on(
      "membersUpdated",
      async () => {

        await fetchMembers();

        await fetchWorkspaces();
      }
    );

    socket.on(
      "activityUpdated",
      () => {

        fetchActivities();
      }
    );

    socket.on(
      "memberRemoved",
      async ({
        workspaceId,
        memberId
      }) => {

        if (
          String(memberId)
          ===
          String(reqUserId)
        ) {

          socket.emit(
            "leaveWorkspace",
            workspaceId
          );

          localStorage.removeItem(
            "selectedWorkspace"
          );

          setSelectedWorkspace(
            null
          );

          setNotes([]);
          setMembers([]);
          setActivities([]);
          setTrashNotes([]);
        }

        await fetchWorkspaces();
      }
    );

    socket.on(
      "workspaceRenamed",
      async () => {

        await fetchWorkspaces();
      }
    );

    socket.on(
      "workspaceDeleted",
      async (workspaceId) => {

        if (
          selectedWorkspace?._id
          ===
          workspaceId
        ) {

          localStorage.removeItem(
            "selectedWorkspace"
          );

          setSelectedWorkspace(
            null
          );
        }

        await fetchWorkspaces();
      }
    );

    return () => {

      socket.off("notesUpdated");

      socket.off("membersUpdated");

      socket.off("activityUpdated");

      socket.off("memberRemoved");

      socket.off("workspaceRenamed");

      socket.off("workspaceDeleted");

      if (selectedWorkspace) {

        socket.emit(
          "leaveWorkspace",
          selectedWorkspace._id
        );
      }
    };

  }, [selectedWorkspace]);

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setDebouncedSearch(search);

      }, 400);

    return () => {

      clearTimeout(timer);
    };

  }, [search]);

  useEffect(() => {

    if (darkMode) {

      document.documentElement
        .classList.add("dark");

      localStorage.setItem(
        "theme",
        "dark"
      );

    } else {

      document.documentElement
        .classList.remove("dark");

      localStorage.setItem(
        "theme",
        "light"
      );
    }

  }, [darkMode]);

  useEffect(() => {

    if (selectedWorkspace) {

      localStorage.setItem(
        "selectedWorkspace",
        JSON.stringify(
          selectedWorkspace
        )
      );

    } else {

      localStorage.removeItem(
        "selectedWorkspace"
      );
    }

  }, [selectedWorkspace]);

  useEffect(() => {

    if (!selectedWorkspace) {
      return;
    }

    setRenameWorkspaceName(
      selectedWorkspace.name || ""
    );

    setWorkspaceDescription(
      selectedWorkspace.description || ""
    );

    setEditingWorkspace(false);

  }, [selectedWorkspace]);

  const uploadFile =
    async (file) => {

      try {

        setUploadCount(
          (prev) => prev + 1
        );

        const data =
          await uploadFileService(
            file
          );

        setAttachments(
          (prev) => [
            ...prev,
            {
              url:
                data.fileUrl,

              type:
                file.type,

              name:
                file.name
            }
          ]
        );

        toast.success(
          "File Uploaded"
        );

      } catch (error) {

        toast.error(
          error.response?.data?.message
          ||
          "Upload failed"
        );

      } finally {

        setUploadCount(
          (prev) => prev - 1
        );
      }
    };

  const createNote = async (e) => {

    e.preventDefault();

    if (uploading) {

      return toast.error(
        "Please wait for files to finish uploading"
      );
    }

    try {

      setCreating(true);

      await createNoteService({
        title,
        content,
        attachments,
        category,
        workspace:
          selectedWorkspace?._id
      });

      clearNoteForm();

      fetchNotes();

      toast.success("Note Created");

    } catch (error) {

      toast.error(
        error.response?.data?.message
        ||
        "Something went wrong"
      );

    } finally {

      setCreating(false);
    }
  };

  const updateNote = async (e) => {

    e.preventDefault();

    if (uploading) {

      return toast.error(
        "Please wait for files to finish uploading"
      );
    }

    try {

      setCreating(true);

      await updateNoteService(
        editingId,
        {
          title,
          content,
          attachments,
          category,
          workspace:
            selectedWorkspace?._id
        }
      );

      clearNoteForm();

      fetchNotes();

      toast.success("Note Updated");

    } catch (error) {

      toast.error(
        error.response?.data?.message
        ||
        "Something went wrong"
      );

    } finally {
      setCreating(false);
    }
  };

  const togglePin = async (note) => {

    try {

      await updateNoteService(
        note._id,
        {
          isPinned:
            !note.isPinned
        }
      );

      fetchNotes();

      toast.success(
        note.isPinned
          ? "Note Unpinned"
          : "Note Pinned"
      );

    } catch (error) {

      toast.error(
        error.response?.data?.message
        ||
        "Something went wrong"
      );
    }
  };

  const deleteNote = (id) => {

    setConfirmConfig({

      title:
        "Delete Note",

      message:
        "Move this note to trash?",

      confirmText:
        "Delete",

      confirmColor:
        "bg-red-600",

      onConfirm: async () => {

        try {

          const data =
            await deleteNoteService(id);

          fetchNotes();
          fetchTrashNotes();

          toast.success(
            data.message
          );

        } catch (error) {

          toast.error(
            error.response?.data?.message
            ||
            "Something went wrong"
          );
        }
      }
    });

    setConfirmOpen(true);
  };

  const editHandler = (note) => {

    setTitle(note.title);

    setContent(note.content);

    setAttachments(note.attachments || []);

    setCategory(note.category);

    setEditingId(note._id);

    document
      .querySelector("form")
      ?.scrollIntoView({
        behavior: "smooth"
      });
  };

  const clearNoteForm = () => {

    setTitle("");

    setContent("");

    setAttachments([]);

    setCategory("General");

    setEditingId(null);
  };

  const filteredNotes = notes.filter(
    (note) => {

      const text =
        `${note.title} ${note.content}`
          .toLowerCase();

      const matchesSearch =
        text.includes(
          debouncedSearch.toLowerCase()
        );

      const matchesCategory =
        selectedCategory === "All"
        ||
        note.category ===
        selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  const pinnedNotes =
    filteredNotes.filter(
      (note) => note.isPinned
    );

  const normalNotes =
    filteredNotes.filter(
      (note) => !note.isPinned
    );

  const formatActivity =
    (activity) => {

      switch (
        activity.action
      ) {

        case "NOTE_CREATED":
          return `created note "${activity.target}"`;

        case "NOTE_UPDATED":
          return `updated note "${activity.target}"`;

        case "NOTE_ARCHIVED":
          return `archived note "${activity.target}"`;

        case "NOTE_RESTORED":
          return `restored note "${activity.target}"`;

        case "NOTE_PERMANENTLY_DELETED":
          return `permanently deleted note "${activity.target}"`;

        case "NOTE_DELETED":
          return `deleted note "${activity.target}"`;

        case "MEMBER_JOINED":
          return `joined workspace`;

        case "ROLE_CHANGED":
          return `changed role: ${activity.target}`;

        case "MEMBER_REMOVED":
          return `removed ${activity.target}`;

        case "MEMBER_LEFT":
          return `left workspace`;

        case "WORKSPACE_CREATED":
          return `created workspace "${activity.target}"`;

        case "WORKSPACE_RENAMED":
          return `renamed workspace to "${activity.target}"`;

        case "OWNERSHIP_TRANSFERRED":
          return `transferred ownership to ${activity.target}`;

        default:
          return activity.action;
      }
    };

  const filteredActivities =
    activities.filter(
      (activity) => {

        if (
          activityFilter === "ALL"
        ) {
          return true;
        }

        if (
          activityFilter === "NOTES"
        ) {

          return [
            "NOTE_CREATED",
            "NOTE_UPDATED",
            "NOTE_ARCHIVED",
            "NOTE_RESTORED",
            "NOTE_DELETED",
            "NOTE_PERMANENTLY_DELETED"
          ].includes(
            activity.action
          );
        }

        if (
          activityFilter === "MEMBERS"
        ) {

          return [
            "MEMBER_JOINED",
            "MEMBER_LEFT",
            "MEMBER_REMOVED",
            "ROLE_CHANGED",
            "OWNERSHIP_TRANSFERRED"
          ].includes(
            activity.action
          );
        }

        if (
          activityFilter === "WORKSPACE"
        ) {

          return [
            "WORKSPACE_CREATED",
            "WORKSPACE_RENAMED"
          ].includes(
            activity.action
          );
        }

        return true;
      }
    );

  const getActivityIcon =
    (action) => {

      switch (action) {

        case "NOTE_CREATED":
          return "📝";

        case "NOTE_UPDATED":
          return "✏️";

        case "NOTE_ARCHIVED":
          return "📦";

        case "NOTE_RESTORED":
          return "♻️";

        case "NOTE_PERMANENTLY_DELETED":
          return "🗑️";

        case "MEMBER_JOINED":
          return "👋";

        case "MEMBER_LEFT":
          return "🚪";

        case "MEMBER_REMOVED":
          return "❌";

        case "ROLE_CHANGED":
          return "🔄";

        case "OWNERSHIP_TRANSFERRED":
          return "👑";

        case "WORKSPACE_CREATED":
          return "🚀";

        case "WORKSPACE_RENAMED":
          return "⚙️";

        default:
          return "📌";
      }
    };

  const filteredMembers =
    members.filter((member) =>

      member.user.name
        .toLowerCase()
        .includes(
          memberSearch.toLowerCase()
        )

      ||

      member.user.email
        .toLowerCase()
        .includes(
          memberSearch.toLowerCase()
        )

    );

  return (

    <div
      className="
        min-h-screen
        bg-slate-100
        dark:bg-slate-900
      "
    >

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        logoutHandler={logoutHandler}
      />

      <div
        className="
          max-w-7xl
          mx-auto
          p-4 md:p-6
        "
      >

        <div
          className="
            bg-white
            dark:bg-slate-800
            p-6
            rounded-2xl
            shadow-md
            mb-6
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              mb-4
              dark:text-white
            "
          >
            Workspaces
          </h2>

          <div className="flex flex-col md:flex-row gap-3 mb-4">

            <input
              type="text"
              placeholder="Workspace Name"
              value={workspaceName}
              onChange={(e) =>
                setWorkspaceName(
                  e.target.value
                )
              }
              className="
                flex-1
                border
                rounded-lg
                px-4
                py-3
                dark:bg-slate-700
                dark:text-white
              "
            />

            <button
              onClick={async () => {

                try {

                  setCreatingWorkspace(true);

                  const workspace =
                    await createWorkspace(
                      workspaceName
                    );

                  setWorkspaceName("");

                  setWorkspaces(
                    (prev) => [
                      ...prev,
                      workspace
                    ]
                  );

                  setSelectedWorkspace(
                    workspace
                  );

                  toast.success(
                    "Workspace Created"
                  );

                } catch (error) {

                  toast.error(
                    error.response?.data?.message
                    ||
                    "Workspace creation failed"
                  );

                } finally {

                  setCreatingWorkspace(false);
                }
              }}
              className="
                bg-blue-600
                hover:bg-blue-700
                active:scale-95
                focus:ring-2
                focus:ring-blue-500
                focus:outline-none
                text-white
                px-6
                rounded-lg
              "
              disabled={creatingWorkspace}
            >
              {
                creatingWorkspace
                  ? "Creating..."
                  : "Create"
              }
            </button>

            <input
              type="text"
              placeholder="Invite Code"
              value={inviteCode}
              onChange={(e) =>
                setInviteCode(
                  e.target.value
                )
              }
              className="
                flex-1
                border
                rounded-lg
                px-4
                py-3
                dark:bg-slate-700
                dark:text-white
              "
            />

            <button
              onClick={async () => {

                try {

                  setJoiningWorkspace(true);

                  const workspace =
                    await joinWorkspace(
                      inviteCode
                    );

                  setInviteCode("");

                  setWorkspaces(
                    (prev) => [
                      ...prev,
                      workspace
                    ]
                  );

                  setSelectedWorkspace(
                    workspace
                  );

                  toast.success(
                    "Joined Workspace"
                  );

                } catch (error) {

                  toast.error(
                    error.response?.data?.message
                    ||
                    "Join failed"
                  );

                } finally {

                  setJoiningWorkspace(false);
                }
              }}
              className="
                bg-green-600
                hover:bg-green-700
                active:scale-95
                focus:ring-2
                focus:ring-blue-500
                focus:outline-none
                text-white
                px-6
                rounded-lg
              "

              disabled={joiningWorkspace}
            >
              {
                joiningWorkspace
                  ? "Joining..."
                  : "Join"
              }
            </button>

          </div>

          {
            workspaceLoading ? (

              <div
                className="
                  text-gray-500
                  dark:text-gray-300
                "
              >
                Loading Workspaces...
              </div>

            ) : (

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  lg:grid-cols-3
                  gap-4
                "
              >

                {
                  workspaces.map(
                    (workspace) => (

                      <div
                        key={workspace._id}
                        onClick={() =>
                          setSelectedWorkspace(
                            workspace
                          )
                        }
                        className={`
                          cursor-pointer
                          rounded-2xl
                          border
                          p-5
                          transition
                          hover:shadow-lg

                          ${
                            selectedWorkspace?._id
                            === workspace._id
                              ? "border-blue-500 bg-blue-50 dark:bg-slate-700"
                              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                          }
                        `}
                      >

                        <div
                          className="
                            flex
                            justify-between
                            items-start
                            mb-4
                          "
                        >

                          <div>

                            <h3
                              className="
                                font-bold
                                text-lg
                                dark:text-white
                              "
                            >
                              {workspace.name}
                            </h3>

                            <div
                              className="
                                text-xs
                                text-gray-500
                                mt-1
                              "
                            >
                              {
                                workspace.owner?._id
                                === reqUserId
                                  ? "👑 Owner"
                                  : "👀 Member"
                              }
                            </div>

                          </div>

                          {
                            selectedWorkspace?._id
                            === workspace._id
                            && (

                              <span
                                className="
                                  text-xs
                                  bg-blue-600
                                  text-white
                                  px-2
                                  py-1
                                  rounded-full
                                "
                              >
                                Active
                              </span>

                            )
                          }

                        </div>

                      </div>

                    )
                  )
                }

              </div>

            )
          }

        </div>

        {
          !selectedWorkspace ? (

            <div
              className="
                bg-white
                dark:bg-slate-800
                rounded-2xl
                shadow-md
                p-16
                text-center
              "
            >

              <div className="text-6xl mb-6">
                🚀
              </div>

              <h2
                className="
                  text-3xl
                  font-bold
                  mb-4
                  dark:text-white
                "
              >
                No Workspace Selected
              </h2>

              <p
                className="
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Create a workspace or join one using an invite code to start managing notes.
              </p>

            </div>

            ) : (

            <>

                  <div
                    className="
                      bg-white
                      dark:bg-slate-800
                      p-6
                      rounded-2xl
                      shadow-md
                      mb-6
                    "
                  >

                    {/* <select
                      value={selectedWorkspace?._id || ""}
                      onChange={(e) => {

                        const workspace =
                          workspaces.find(
                            (workspace) =>
                              workspace._id ===
                              e.target.value
                          );

                        setSelectedWorkspace(
                          workspace
                        );
                      }}
                      className="
                        mb-4
                        w-full
                        md:w-80
                        border
                        rounded-lg
                        px-3
                        py-2
                        dark:bg-slate-700
                        dark:text-white
                      "
                    >

                      {
                        workspaces.map(
                          (workspace) => (

                            <option
                              key={workspace._id}
                              value={workspace._id}
                            >
                              {workspace.name}
                            </option>

                          )
                        )
                      }

                    </select> */}

                    <h1
                      className="
                        text-3xl
                        font-bold
                        dark:text-white
                        mb-2
                      "
                    >
                      📚 {selectedWorkspace.name}
                    </h1>

                    <p
                      className="
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      {
                        selectedWorkspace.description
                        ||
                        "No workspace description yet."
                      }
                    </p>

                  </div>
                  
                  <div
                    className="
                      bg-white
                      dark:bg-slate-800
                      p-6
                      rounded-2xl
                      shadow-md
                      mb-6
                    "
                  >

                    <div
                      className="
                        flex
                        justify-between
                        items-center
                        mb-4
                      "
                    >

                      <h2
                        className="
                          text-2xl
                          font-bold
                          dark:text-white
                        "
                      >
                        Workspace Settings
                      </h2>

                      {
                        isOwner && (

                          <button
                            onClick={() =>
                              setEditingWorkspace(
                                !editingWorkspace
                              )
                            }
                            className="
                              w-9
                              h-9
                              rounded-full
                              bg-slate-100
                              dark:bg-slate-700
                              flex
                              items-center
                              justify-center
                              hover:scale-105
                              transition
                            "
                          >
                            ⚙️
                          </button>

                        )
                      }

                    </div>

                    <div className="space-y-4">

                      <div className="space-y-2 text-sm">

                        <div className="dark:text-white">
                          <span className="font-semibold">
                            Owner:
                          </span>{" "}
                          {selectedWorkspace.owner?.name || "Unknown"}
                        </div>

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            dark:text-white
                          "
                        >

                          <span>
                            <span className="font-semibold">
                              Invite Code:
                            </span>{" "}
                            {selectedWorkspace.inviteCode}
                          </span>

                          <button
                            onClick={() => {

                              navigator.clipboard.writeText(
                                selectedWorkspace.inviteCode
                              );

                              toast.success(
                                "Invite code copied"
                              );
                            }}
                            className="text-sm"
                          >
                            📋
                          </button>

                        </div>

                        <div className="dark:text-white">
                          <span className="font-semibold">
                            Created:
                          </span>{" "}
                          {
                            new Date(
                              selectedWorkspace.createdAt
                            ).toLocaleDateString()
                          }
                        </div>

                      </div>

                      {
                        isOwner
                        &&
                        editingWorkspace
                        && (

                          <div
                            className="
                              border-t
                              pt-4
                              mt-4
                              space-y-3
                            "
                          >

                            <input
                              type="text"
                              value={renameWorkspaceName}
                              onChange={(e) =>
                                setRenameWorkspaceName(
                                  e.target.value
                                )
                              }
                              placeholder="Workspace Name"
                              className="
                                w-full
                                border
                                rounded-lg
                                px-3
                                py-2
                                dark:bg-slate-700
                                dark:text-white
                              "
                            />

                            <textarea
                              value={workspaceDescription}
                              onChange={(e) =>
                                setWorkspaceDescription(
                                  e.target.value
                                )
                              }
                              rows={4}
                              placeholder="Workspace Description"
                              className="
                                w-full
                                border
                                rounded-lg
                                px-3
                                py-2
                                dark:bg-slate-700
                                dark:text-white
                              "
                            />

                            <div className="flex gap-2">

                              <button
                                onClick={async () => {

                                  try {

                                    setActionLoading(
                                      "rename"
                                    );

                                    const data =
                                      await renameWorkspace(
                                        selectedWorkspace._id,
                                        renameWorkspaceName,
                                        workspaceDescription
                                      );

                                    toast.success(
                                      data.message
                                    );

                                    setEditingWorkspace(
                                      false
                                    );

                                    await fetchWorkspaces();

                                  } catch (error) {

                                    toast.error(
                                      error.response?.data?.message
                                      ||
                                      "Save failed"
                                    );

                                  } finally {

                                    setActionLoading(
                                      null
                                    );
                                  }
                                }}
                                disabled={
                                  actionLoading === "rename"
                                }
                                className="
                                  bg-blue-600
                                  hover:bg-blue-700
                                  text-white
                                  px-4
                                  py-2
                                  rounded-lg
                                "
                              >
                                {
                                  actionLoading === "rename"
                                    ? "Saving..."
                                    : "Save Changes"
                                }
                              </button>

                              <button
                                type="button"
                                onClick={() => {

                                  setRenameWorkspaceName(
                                    selectedWorkspace.name
                                  );

                                  setWorkspaceDescription(
                                    selectedWorkspace.description
                                    || ""
                                  );

                                  setEditingWorkspace(
                                    false
                                  );
                                }}
                                className="
                                  border
                                  px-4
                                  py-2
                                  rounded-lg
                                  dark:text-white
                                "
                              >
                                Cancel
                              </button>

                            </div>

                          </div>

                        )
                      }

                      <div className="border-t pt-4 mt-4">

                        {
                          isOwner ? (

                            <button
                              onClick={() => {

                                setConfirmConfig({

                                  title:
                                    "Delete Workspace",

                                  message:
                                    "This will permanently delete the workspace and all notes.",

                                  confirmText:
                                    "Delete",

                                  confirmColor:
                                    "bg-red-700",

                                  onConfirm: async () => {

                                    const data =
                                      await deleteWorkspace(
                                        selectedWorkspace._id
                                      );

                                    toast.success(
                                      data.message
                                    );

                                    localStorage.removeItem(
                                      "selectedWorkspace"
                                    );

                                    setSelectedWorkspace(
                                      null
                                    );

                                    await fetchWorkspaces();
                                  }
                                });

                                setConfirmOpen(true);
                              }}
                              className="
                                bg-red-700
                                text-white
                                px-4
                                py-2
                                rounded-lg
                              "
                            >
                              Delete Workspace
                            </button>

                          ) : (

                            <button
                              onClick={() => {

                                setConfirmConfig({

                                  title:
                                    "Leave Workspace",

                                  message:
                                    "Are you sure you want to leave this workspace?",

                                  confirmText:
                                    "Leave",

                                  confirmColor:
                                    "bg-red-500",

                                  onConfirm: async () => {

                                    const data =
                                      await leaveWorkspace(
                                        selectedWorkspace._id
                                      );

                                    toast.success(
                                      data.message
                                    );

                                    localStorage.removeItem(
                                      "selectedWorkspace"
                                    );

                                    setSelectedWorkspace(
                                      null
                                    );

                                    await fetchWorkspaces();
                                  }
                                });

                                setConfirmOpen(true);
                              }}
                              className="
                                bg-red-500
                                text-white
                                px-4
                                py-2
                                rounded-lg
                              "
                            >
                              Leave Workspace
                            </button>

                          )
                        }

                      </div>

                    </div>

                  </div>

              <div
                className="
                  bg-white
                  dark:bg-slate-800
                  p-6
                  rounded-2xl
                  shadow-md
                  mb-6
                "
              >

                <h2
                  className="
                    text-2xl
                    font-bold
                    mb-4
                    dark:text-white
                  "
                >
                  Members
                </h2>

                <input
                  type="text"
                  placeholder="Search members..."
                  value={memberSearch}
                  onChange={(e) =>
                    setMemberSearch(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    rounded-lg
                    px-3
                    py-2
                    mb-4
                    dark:bg-slate-700
                    dark:text-white
                  "
                />

                {
                  membersLoading ? (

                    <div
                      className="
                        dark:text-white
                      "
                    >
                      Loading Members...
                    </div>

                  ) : (

                    <div className="space-y-4">

                      {
                        filteredMembers.map(
                          (member) => {

                            const memberIsOwner =
                              member.role === "owner";

                            return (

                              <div
                                key={member._id}
                                className="
                                  flex
                                  flex-col
                                  md:flex-row
                                  md:items-center
                                  md:justify-between
                                  gap-3
                                  border-b
                                  pb-3
                                "
                              >

                                <div
                                  className="
                                    flex
                                    justify-between
                                    items-center
                                    flex-1
                                  "
                                >

                                  <div>

                                    <div
                                      className="
                                        font-semibold
                                        dark:text-white
                                      "
                                    >
                                      {member.user.name}
                                    </div>

                                    <div
                                      className="
                                        text-sm
                                        text-gray-500
                                      "
                                    >
                                      {member.user.email}
                                    </div>

                                  </div>

                                  <div
                                    className={`
                                      px-3
                                      py-1
                                      rounded-full
                                      text-xs
                                      font-semibold
                                      capitalize

                                      ${
                                        member.role === "owner"
                                          ? "bg-yellow-100 text-yellow-700"
                                          : member.role === "editor"
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-white"
                                      }
                                    `}
                                  >
                                    {
                                      member.role === "owner"
                                        ? "👑 Owner"
                                        : member.role === "editor"
                                        ? "✏️ Editor"
                                        : "👀 Viewer"
                                    }

                                  </div>

                                </div>

                                {
                                  isOwner
                                  && !memberIsOwner
                                  && (

                                    <div
                                      className="
                                        flex
                                        gap-2
                                        items-center
                                      "
                                    >

                                      <select
                                        disabled={
                                          memberIsOwner
                                          ||
                                          actionLoading ===
                                            `role-${member.user._id}`
                                        }
                                        value={member.role}
                                        onChange={async (e) => {

                                          try {

                                            setActionLoading(
                                              `role-${member.user._id}`
                                            );

                                            const data =
                                              await changeMemberRole(
                                                selectedWorkspace._id,
                                                member.user._id,
                                                e.target.value
                                              );

                                            toast.success(
                                              data.message
                                            );

                                            await fetchMembers();

                                          } catch (error) {

                                            toast.error(
                                              error.response?.data?.message
                                              ||
                                              "Role update failed"
                                            );

                                          } finally {

                                            setActionLoading(
                                              null
                                            );
                                          }
                                        }}
                                        className="
                                          border
                                          border-slate-300
                                          dark:border-slate-600
                                          bg-white
                                          dark:bg-slate-700
                                          dark:text-white
                                          rounded-lg
                                          px-3
                                          py-2
                                          shadow-sm
                                          focus:ring-2
                                          focus:ring-blue-500
                                          focus:outline-none
                                        "
                                      >

                                        <option value="viewer">
                                          Viewer
                                        </option>

                                        <option value="editor">
                                          Editor
                                        </option>

                                      </select>

                                      {
                                        actionLoading ===
                                          `role-${member.user._id}`
                                        && (

                                          <span
                                            className="
                                              text-xs
                                              text-blue-600
                                              ml-2
                                            "
                                          >
                                            Updating...
                                          </span>

                                        )
                                      }

                                      {
                                        isOwner
                                        && !memberIsOwner
                                        && (

                                          <button
                                            onClick={() => {

                                              setConfirmConfig({

                                                title:
                                                  "Transfer Ownership",

                                                message:
                                                  `Transfer ownership to ${member.user.name}? You will no longer be the owner.`,

                                                confirmText:
                                                  "Transfer",

                                                confirmColor:
                                                  "bg-yellow-600",

                                                onConfirm: async () => {

                                                  try {

                                                    setActionLoading(
                                                      `transfer-${member.user._id}`
                                                    );

                                                    const data =
                                                      await transferOwnership(
                                                        selectedWorkspace._id,
                                                        member.user._id
                                                      );

                                                    toast.success(
                                                      data.message
                                                    );

                                                    await fetchMembers();

                                                    await fetchWorkspaces();

                                                  } catch (error) {

                                                    toast.error(
                                                      error.response?.data?.message
                                                      ||
                                                      "Transfer failed"
                                                    );

                                                  } finally {

                                                    setActionLoading(null);
                                                  }
                                                }
                                              });

                                              setConfirmOpen(true);
                                            }}
                                            disabled={
                                              actionLoading ===
                                                `transfer-${member.user._id}`
                                            }
                                            className="
                                              bg-yellow-500
                                              text-white
                                              px-4
                                              py-2
                                              rounded-lg
                                            "
                                          >
                                            {
                                              actionLoading ===
                                                `transfer-${member.user._id}`
                                                  ? "Transferring..."
                                                  : "Make Owner"
                                            }
                                          </button>

                                        )
                                      }

                                      <button
                                        disabled={
                                          memberIsOwner
                                          ||
                                          actionLoading ===
                                            `remove-${member.user._id}`
                                        }
                                        onClick={() => {

                                          setConfirmConfig({

                                            title:
                                              "Remove Member",

                                            message:
                                              `Remove ${member.user.name} from this workspace?`,

                                            confirmText:
                                              "Remove",

                                            confirmColor:
                                              "bg-red-600",

                                            onConfirm: async () => {

                                              try {

                                                setActionLoading(
                                                  `remove-${member.user._id}`
                                                );

                                                await removeMember(
                                                  selectedWorkspace._id,
                                                  member.user._id
                                                );

                                                await fetchMembers();

                                                await fetchActivities();

                                                toast.success(
                                                  "Member Removed"
                                                );

                                              } catch (error) {

                                                toast.error(
                                                  error.response?.data?.message
                                                  ||
                                                  "Remove failed"
                                                );

                                              } finally {

                                                setActionLoading(null);
                                              }
                                            }
                                          });

                                          setConfirmOpen(true);
                                        }}
                                        className="
                                          bg-red-500
                                          text-white
                                          px-4
                                          py-2
                                          rounded-lg
                                        "
                                      >
                                        {
                                          actionLoading ===
                                            `remove-${member.user._id}`
                                              ? "Removing..."
                                              : "Remove"
                                        }
                                      </button>

                                    </div>

                                  )
                                }

                              </div>

                            );

                          }
                        )
                      }

                    </div>

                  )
                }

              </div>

              <div
                className="
                  bg-white
                  dark:bg-slate-800
                  p-6
                  rounded-2xl
                  shadow-md
                  mb-6
                "
              >

                <h2
                  className="
                    text-2xl
                    font-bold
                    mb-4
                    dark:text-white
                  "
                >
                  Recent Activity
                </h2>

                <div
                  className="
                    flex
                    gap-2
                    flex-wrap
                    mb-4
                  "
                >

                  {
                    [
                      "ALL",
                      "NOTES",
                      "MEMBERS",
                      "WORKSPACE"
                    ].map(
                      (filter) => (

                        <button
                          key={filter}
                          onClick={() =>
                            setActivityFilter(
                              filter
                            )
                          }
                          className={`
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            transition

                            ${
                              activityFilter ===
                              filter
                                ? "bg-blue-600 text-white"
                                : "bg-slate-200 dark:bg-slate-700 dark:text-white"
                            }
                          `}
                        >
                          {filter}
                        </button>

                      )
                    )
                  }

                </div>

                <div className="
                    space-y-3
                    max-h-96
                    overflow-y-auto
                    pr-2
                  "
                >

                  {
                    filteredActivities.length === 0
                    ? (
                      <p
                        className="
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        No activity yet
                      </p>
                    )
                    : (
                      filteredActivities
                        .map(
                        (activity) => (

                          <div
                            key={activity._id}
                            className="
                              border-b
                              pb-2
                            "
                          >

                            <div
                              className="
                                space-y-1
                              "
                            >

                              <div
                                className="
                                  dark:text-white
                                "
                              >

                                <span className="mr-2">
                                  {getActivityIcon(
                                    activity.action
                                  )}
                                </span>

                                <strong>
                                  {activity.user?.name}
                                </strong>

                                {" "}

                                {formatActivity(activity)}

                              </div>

                              <div
                                className="
                                  text-xs
                                  text-gray-500
                                "
                              >

                                {
                                  formatDistanceToNow(
                                    new Date(
                                      activity.createdAt
                                    ),
                                    {
                                      addSuffix: true
                                    }
                                  )
                                }

                              </div>

                            </div>

                          </div>

                        )
                      )
                    )
                  }

                </div>

              </div>

              {
                canWrite && (

                  <div
                    className="
                      bg-white
                      dark:bg-slate-800
                      p-6
                      rounded-2xl
                      shadow-md
                      mb-10
                    "
                  >

                    <h2
                      className="
                        text-2xl
                        font-semibold
                        mb-4
                        dark:text-white
                      "
                    >
                      {
                        editingId
                          ? "Update Note"
                          : "Create Note"
                      }
                    </h2>

                    <form
                      onSubmit={
                        editingId
                          ? updateNote
                          : createNote
                      }
                      className="
                        flex
                        flex-col
                        gap-4
                      "
                    >

                      <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) =>
                          setTitle(e.target.value)
                        }
                        className="
                          border
                          rounded-lg
                          px-4
                          py-3
                          outline-none
                          focus:ring-2
                          focus:ring-blue-500
                          dark:bg-slate-700
                          dark:text-white
                          dark:border-slate-600
                        "
                      />

                      <textarea
                        placeholder="Content"
                        value={content}
                        onChange={(e) =>
                          setContent(e.target.value)
                        }
                        rows={10}
                        className="
                          border
                          rounded-lg
                          px-4
                          py-3
                          outline-none
                          focus:ring-2
                          focus:ring-blue-500
                          dark:bg-slate-700
                          dark:text-white
                          dark:border-slate-600
                          resize-y
                          min-h-[250px]
                        "
                      />

                      <select
                        value={category}
                        onChange={(e) =>
                          setCategory(e.target.value)
                        }
                        className="
                          border
                          rounded-lg
                          px-4
                          py-3
                          outline-none
                          focus:ring-2
                          focus:ring-blue-500
                          dark:bg-slate-700
                          dark:text-white
                          dark:border-slate-600
                        "
                      >

                        <option value="General">
                          General
                        </option>

                        <option value="Work">
                          Work
                        </option>

                        <option value="Personal">
                          Personal
                        </option>

                        <option value="Study">
                          Study
                        </option>

                        <option value="Ideas">
                          Ideas
                        </option>

                        <option value="Projects">
                          Projects
                        </option>

                      </select>

                      <label
                        className="
                          flex
                          flex-col
                          items-center
                          justify-center
                          border-2
                          border-dashed
                          border-slate-300
                          dark:border-slate-600
                          rounded-2xl
                          p-10
                          cursor-pointer
                          hover:border-blue-500
                          hover:bg-blue-50
                          dark:hover:bg-slate-700
                          transition
                          duration-300
                          text-gray-600
                          dark:text-gray-300
                          font-medium
                          animate-fadeIn
                        "
                      >

                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => {

                            Array.from(
                              e.target.files
                            ).forEach((file) => {

                              uploadFile(file);
                            });
                          }}
                        />

                        <div className="text-5xl mb-3">
                          📁
                        </div>

                        <div className="text-lg font-semibold">
                          {
                            uploading
                              ? `Uploading ${uploadCount} file(s)...`
                              : "Choose Files"
                          }
                        </div>

                        <div
                          className="
                            text-sm
                            text-gray-500
                            mt-2
                            text-center
                          "
                        >
                          Drag & drop files or click
                          to browse
                        </div>

                      </label>

                      {
                        attachments.length > 0 && (

                          <div
                            className="
                              mt-4
                              flex
                              flex-wrap
                              gap-3
                            "
                          >

                            {
                              attachments.map(
                                (file, index) => (

                                  <div
                                    key={index}
                                    className="
                                      bg-slate-100
                                      dark:bg-slate-700
                                      px-4
                                      py-2
                                      rounded-xl
                                      text-sm
                                      dark:text-white
                                      shadow-sm
                                      flex
                                      items-center
                                      gap-2
                                    "
                                  >

                                    <span>
                                      📎 {file.name}
                                    </span>

                                    <button
                                      type="button"
                                      onClick={() => {

                                        setAttachments(
                                          attachments.filter(
                                            (_, i) =>
                                              i !== index
                                          )
                                        );
                                      }}
                                      className="
                                        text-red-500
                                        font-bold
                                        hover:text-red-700
                                        ml-1
                                      "
                                    >
                                      ✕
                                    </button>

                                  </div>

                                )
                              )
                            }

                          </div>

                        )
                      }

                      <div
                        className="
                          flex
                          gap-3
                        "
                      >

                        <button
                          type="submit"
                          disabled={
                            creating
                            ||
                            uploading
                          }
                          className="
                            flex-1
                            bg-blue-600
                            hover:bg-blue-700
                            active:scale-95
                            focus:ring-2
                            focus:ring-blue-500
                            focus:outline-none
                            text-white
                            py-3
                            rounded-lg
                            font-semibold
                            disabled:opacity-50
                          "
                        >
                          {
                            uploading
                              ? "Uploading Files..."
                              : creating
                                ? (
                                    editingId
                                      ? "Updating..."
                                      : "Creating..."
                                  )
                                : (
                                    editingId
                                      ? "Update Note"
                                      : "Create Note"
                                  )
                          }
                        </button>

                        <button
                          type="button"
                          onClick={clearNoteForm}
                          className="
                            px-6
                            py-3
                            rounded-lg
                            border
                            border-slate-300
                            dark:border-slate-600
                            dark:text-white
                          "
                        >
                          Clear
                        </button>

                      </div>

                    </form>

                  </div>

                )

              }

              <div
                className="
                  bg-white
                  dark:bg-slate-800
                  p-6
                  rounded-2xl
                  shadow-md
                  mb-6
                "
              >
                <h2
                  className="
                    text-2xl
                    font-bold
                    mb-4
                    dark:text-white
                  "
                >
                  Statistics
                </h2>

                <div
                  className="
                    grid
                    grid-cols-2
                    md:grid-cols-4
                    gap-4
                  "
                >

                  <div
                    className="
                      bg-slate-100
                      dark:bg-slate-700
                      p-4
                      rounded-xl
                    "
                  >
                    <div className="text-sm">
                      📝 Total Notes
                    </div>

                    <div className="text-2xl font-bold">
                      {notes.length}
                    </div>
                  </div>

                  <div
                    className="
                      bg-slate-100
                      dark:bg-slate-700
                      p-4
                      rounded-xl
                    "
                  >
                    <div className="text-sm">
                      📌 Pinned Notes
                    </div>

                    <div className="text-2xl font-bold">
                      {
                        notes.filter(
                          (n) => n.isPinned
                        ).length
                      }
                    </div>
                  </div>

                  <div
                    className="
                      bg-slate-100
                      dark:bg-slate-700
                      p-4
                      rounded-xl
                    "
                  >
                    <div className="text-sm">
                      👥 Members
                    </div>

                    <div className="text-2xl font-bold">
                      {members.length}
                    </div>
                  </div>

                  <div
                    className="
                      bg-slate-100
                      dark:bg-slate-700
                      p-4
                      rounded-xl
                    "
                  >
                    <div className="text-sm">
                      📦 Archived Notes
                    </div>

                    <div className="text-2xl font-bold">
                      {trashNotes.length}
                    </div>
                  </div>

                </div>
              </div>

              <SearchBar
                search={search}
                setSearch={setSearch}
              />

              <CategoryFilters
                selectedCategory={
                  selectedCategory
                }
                setSelectedCategory={
                  setSelectedCategory
                }
              />

              {
                canWrite && (

                  <button
                    onClick={() =>
                      setShowTrash(
                        !showTrash
                      )
                    }
                    className="
                      bg-slate-700
                      text-white
                      px-4
                      py-2
                      rounded-lg
                      mb-4
                    "
                  >
                    {
                      showTrash
                        ? "Show Notes"
                        : "Open Trash"
                    }
                  </button>

                )

              }

              {
                showTrash && (

                  <div
                    className="
                      bg-white
                      dark:bg-slate-800
                      rounded-2xl
                      shadow-md
                      p-6
                      mb-6
                    "
                  >

                    <h2
                      className="
                        text-2xl
                        font-bold
                        mb-4
                        dark:text-white
                      "
                    >
                      Trash
                    </h2>

                    {
                      trashNotes.length === 0 ? (

                        <div
                          className="
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          Trash is empty
                        </div>

                      ) : (

                        trashNotes.map(
                          (note) => (

                            <div
                              key={note._id}
                              className="
                                border-b
                                py-4
                                flex
                                justify-between
                                items-center
                              "
                            >

                              <div
                                className="
                                  dark:text-white
                                "
                              >
                                {note.title}
                              </div>

                              <div className="flex gap-2">

                                <button
                                  onClick={async () => {

                                    const data =
                                      await restoreNote(
                                        note._id
                                      );

                                    fetchTrashNotes();
                                    fetchNotes();

                                    toast.success(
                                      data.message
                                    );
                                  }}
                                  className="
                                    bg-green-600
                                    text-white
                                    px-3
                                    py-1
                                    rounded
                                  "
                                >
                                  Restore
                                </button>

                                <button
                                  onClick={() => {

                                    setConfirmConfig({

                                      title:
                                        "Delete Forever",

                                      message:
                                        `Permanently delete "${note.title}"? This cannot be undone.`,

                                      confirmText:
                                        "Delete Forever",

                                      confirmColor:
                                        "bg-red-700",

                                      onConfirm: async () => {

                                        try {

                                          const data =
                                            await permanentlyDeleteNote(
                                              note._id
                                            );

                                          fetchTrashNotes();

                                          toast.success(
                                            data.message
                                          );

                                        } catch (error) {

                                          toast.error(
                                            error.response?.data?.message
                                            ||
                                            "Delete failed"
                                          );
                                        }
                                      }
                                    });

                                    setConfirmOpen(true);
                                  }}
                                  className="
                                    bg-red-600
                                    text-white
                                    px-3
                                    py-1
                                    rounded
                                  "
                                >
                                  Delete Forever
                                </button>

                              </div>

                            </div>

                          )
                        )

                      )
                    }

                  </div>

                )
              }

              {
                notesLoading ? (

                  <div
                    className="
                      text-center
                      py-20
                      dark:text-white
                    "
                  >
                    Loading Notes...
                  </div>

                ) : filteredNotes.length === 0 ? (

                  <div
                    className="
                      bg-white
                      dark:bg-slate-800
                      rounded-3xl
                      shadow-lg
                      border
                      border-slate-200
                      dark:border-slate-700
                      p-16
                      text-center
                      animate-fadeIn
                    "
                  >

                    <div className="text-6xl mb-6">
                      📝
                    </div>

                    <h2
                      className="
                        text-4xl
                        font-bold
                        mb-4
                        dark:text-white
                      "
                    >
                      No Notes Yet
                    </h2>

                    <p
                      className="
                        text-gray-500
                        dark:text-gray-400
                        text-lg
                      "
                    >
                      Create your first note and
                      start organizing your ideas 🚀
                    </p>

                  </div>

                ) : (

                  <>
                    {
                      pinnedNotes.length > 0 && (

                        <>
                          <h2
                            className="
                              text-xl
                              font-bold
                              mb-4
                              dark:text-white
                            "
                          >
                            📌 Pinned Notes
                          </h2>

                          <div
                            className="
                              grid
                              grid-cols-1
                              md:grid-cols-2
                              lg:grid-cols-3
                              gap-6
                              mb-8
                            "
                          >
                            {
                              pinnedNotes.map(
                                (note) => (

                                  <NoteCard
                                    key={note._id}
                                    note={note}
                                    setSelectedNote={setSelectedNote}
                                    togglePin={togglePin}
                                    editHandler={editHandler}
                                    deleteNote={deleteNote}
                                    canWrite={canWrite}
                                  />

                                )
                              )
                            }
                          </div>
                        </>

                      )
                    }

                    <h2
                      className="
                        text-xl
                        font-bold
                        mb-4
                        dark:text-white
                      "
                    >
                      Notes
                    </h2>

                    <div
                      className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-3
                        gap-6
                      "
                    >
                      {
                        normalNotes.map(
                          (note) => (

                            <NoteCard
                              key={note._id}
                              note={note}
                              setSelectedNote={setSelectedNote}
                              togglePin={togglePin}
                              editHandler={editHandler}
                              deleteNote={deleteNote}
                              canWrite={canWrite}
                            />

                          )
                        )
                      }
                    </div>
                  </>

                )
              }

            </>

          )
        }

      </div>

      <NoteModal
        selectedNote={selectedNote}
        setSelectedNote={setSelectedNote}
        canWrite={canWrite}
        editHandler={editHandler}
        deleteNote={deleteNote}
      />

      <ConfirmModal
        open={confirmOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={
          confirmConfig.confirmText
        }
        confirmColor={
          confirmConfig.confirmColor
        }
        onCancel={() =>
          setConfirmOpen(false)
        }
        onConfirm={async () => {

          await confirmConfig.onConfirm?.();

          setConfirmOpen(false);
        }}
      />

    </div>
  );
}

export default DashboardPage;