//DashboardPage.jsx
import {
  useEffect,
  useState,
  useRef
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

import {
  getNoteVersions,
  restoreNoteVersion
} from "../services/noteService";

import ConfirmModal
  from "../components/ConfirmModal";

import toast from "react-hot-toast";
/*
import { io } from "socket.io-client";
*/

import socket from "../socket";

import {
  useNavigate
} from "react-router-dom";

import Navbar from "../components/Navbar";

import SearchBar from "../components/SearchBar";

import CategoryFilters from "../components/CategoryFilters";

import NoteModal from "../components/NoteModal";

import StatisticsSection from "../components/dashboard/StatisticsSection";

import EmptyWorkspace from "../components/dashboard/EmptyWorkspace";

import ActivitySection from "../components/dashboard/ActivitySection";

import TrashSection from "../components/dashboard/TrashSection";

import MembersSection from "../components/dashboard/MembersSection";

import NoteForm from "../components/dashboard/NoteForm";

import WorkspaceSettings from "../components/dashboard/WorkspaceSettings";

import WorkspaceSection from "../components/dashboard/WorkspaceSection";

import NotesSection from "../components/dashboard/NotesSection";

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

  const [membersWorkspaceId, setMembersWorkspaceId] =
    useState(null);

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

  const [
    versionHistoryOpen,
    setVersionHistoryOpen
  ] = useState(false);

  const [
    selectedVersionNote,
    setSelectedVersionNote
  ] = useState(null);

  const [
    versions,
    setVersions
  ] = useState([]);

  const [
    restoreIndex,
    setRestoreIndex
  ] = useState(null);

  const [
    showRestoreConfirm,
    setShowRestoreConfirm
  ] = useState(false);

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

  const selectedWorkspaceRef =
    useRef(selectedWorkspace);

  const membersRef =
    useRef(members);

  const membersWorkspaceIdRef =
    useRef(membersWorkspaceId);

  const reqUserIdRef =
    useRef(reqUserId);

  const workspacesRequestRef = useRef(0);

  const membersRequestRef = useRef(0);

  const notesRequestRef = useRef(0);

  const activitiesRequestRef = useRef(0);

  const trashRequestRef = useRef(0);
/*
  const API =
    import.meta.env.VITE_API_URL;

  const [socket] = useState(
    () => io(API)
  );
*/
  const logoutHandler = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    localStorage.removeItem("selectedWorkspace");

    navigate("/");
  };

  const fetchWorkspaces =
    async () => {

      const requestId =
        ++workspacesRequestRef.current;

      try {

        setWorkspaceLoading(true);

        const data =
          await getWorkspaces();

        if (
          requestId
          !==
          workspacesRequestRef.current
        ) {
          return;
        }

        setWorkspaces(data);

        if (data.length > 0) {

          const currentWorkspace =
            selectedWorkspaceRef.current
              ? data.find(
                  (workspace) =>
                    workspace._id ===
                    selectedWorkspaceRef.current._id
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

          setSelectedWorkspace(null);
          setNotes([]);
          setMembers([]);
          setActivities([]);
          setTrashNotes([]);
          setMembersWorkspaceId(null);
        }

      } catch (error) {

        if (
          requestId
          !==
          workspacesRequestRef.current
        ) {
          return;
        }

        toast.error(
          error.response?.data?.message
          ||
          "Workspace fetch failed"
        );

      } finally {

        if (
          requestId
          ===
          workspacesRequestRef.current
        ) {

          setWorkspaceLoading(
            false
          );

        }

      }
    };

  const fetchNotes = async () => {

    if (!selectedWorkspaceRef.current
      ||
      !membersRef.current.some(
        (member) =>
          String(member.user?._id)
          ===
          String(reqUserIdRef.current)
      )
    ) {
      
      setNotes([]);
      
      return;
    }

    const workspaceId =
      selectedWorkspaceRef.current._id;

     const requestId =
      ++notesRequestRef.current;

    try {

      setNotesLoading(true);

      const data =
        await getNotes(
          workspaceId
        );

      if (
        requestId
        !==
        notesRequestRef.current
      ) {
        return;
      }

      if (
        selectedWorkspaceRef.current?._id
        !==
        workspaceId
      ) {
        return;
      }

      setNotes(data.notes);

    } catch (error) {

      if (
        requestId !==
        notesRequestRef.current
      ) {
        return;
      }

      toast.error(
        error.response?.data?.message
        ||
        "Something went wrong"
      );

    } finally {
      
        if (
        requestId ===
        notesRequestRef.current
      ) {

        setNotesLoading(false);

      }
    }
  };

  const fetchTrashNotes =
    async () => {

      const me =
        membersRef.current.find(
          (member) =>
            String(member.user?._id) ===
            String(reqUserIdRef.current)
        );

      if (
        !selectedWorkspaceRef.current ||
        !me ||
        me.role === "viewer"
      ) {

        setTrashNotes([]);

        return;
      }

      const workspaceId =
        selectedWorkspaceRef.current._id;

      const requestId =
        ++trashRequestRef.current;

      try {

        const data =
          await getArchivedNotes(
            workspaceId
          );

        if (
          requestId
          !==
          trashRequestRef.current
        ) {
          return;
        }

        if (
          selectedWorkspaceRef.current?._id
          !==
          workspaceId
        ) {
          return;
        }

        setTrashNotes(data);

      } catch (error) {

        if (
          requestId
          !==
          trashRequestRef.current
        ) {
          return;
        }

        console.log(error);
      }
    };

  const fetchActivities =
    async () => {

      if (
        !selectedWorkspaceRef.current?._id
        ||
        !membersRef.current.some(
          (member) =>
            String(member.user?._id)
            ===
            String(reqUserIdRef.current)
        )
      ) {

        setActivities([]);

        return;
      }

      const workspaceId =
        selectedWorkspaceRef.current._id;

      const requestId =
        ++activitiesRequestRef.current;

      try {

        const data =
          await getActivities(
            workspaceId
          );

        if (
          requestId
          !==
          activitiesRequestRef.current
        ) {
          return;
        }

        if (
          selectedWorkspaceRef.current?._id
          !==
          workspaceId
        ) {
          return;
        }

        setActivities(data.activities);

      } catch (error) {

        if (
          requestId
          !==
          activitiesRequestRef.current
        ) {
          return;
        }

        if (
          error.response?.status === 403
        ) {

          setActivities([]);

          return;
        }

        console.log(error);
      }
    };

  const openVersionHistory =
    async (note) => {

      try {

        const data =
          await getNoteVersions(
            note._id
          );

        setVersions(data);

        setSelectedVersionNote(
          note
        );

        setVersionHistoryOpen(
          true
        );

      } catch (error) {

        toast.error(
          error.response?.data?.message
          ||
          "Failed to load versions"
        );
      }
    };

  const restoreVersion =
    async (index) => {

      try {

        await restoreNoteVersion(
          selectedVersionNote._id,
          index
        );

        setVersionHistoryOpen(
          false
        );

        await fetchNotes();

        toast.success(
          "Version Restored"
        );

      } catch (error) {

        toast.error(
          error.response?.data?.message
          ||
          "Failed to restore version"
        );
      }
    };

  const fetchMembers =
    async () => {

      if (!selectedWorkspaceRef.current) {
        
        setMembers([]);

        setMembersWorkspaceId(null);
        
        return;
      }

      const workspaceId =
        selectedWorkspaceRef.current._id;

      const requestId =
        ++membersRequestRef.current;

      try {

        setMembersLoading(true);

        const data =
          await getWorkspaceMembers(
            workspaceId
          );

        if (
          requestId !==
          membersRequestRef.current
        ) {
          return;
        }

        if (
          selectedWorkspaceRef.current?._id !==
          workspaceId
        ) {
          return;
        }

        setMembers(data);

        setMembersWorkspaceId(
          workspaceId
        );

      } catch (error) {

        if (
          requestId !==
          membersRequestRef.current
        ) {
          return;
        }

        if (
          error.response?.status === 404
        ) {

          setMembers([]);
          setMembersWorkspaceId(null);

          return;
        }

        toast.error(
          error.response?.data?.message
          ||
          "Failed to load members"
        );

      } finally {

        if (
          requestId ===
          membersRequestRef.current
        ) {

          setMembersLoading(false);

        }
      }
    };

  useEffect(() => {

    if (currentUser?._id) {

      socket.emit(
        "joinUser",
        currentUser._id
      );

    }

  }, [currentUser]);

  useEffect(() => {

    selectedWorkspaceRef.current =
      selectedWorkspace;

  }, [selectedWorkspace]);

  useEffect(() => {

    membersRef.current =
      members;

  }, [members]);

  useEffect(() => {

    membersWorkspaceIdRef.current =
      membersWorkspaceId;

  }, [membersWorkspaceId]);

  useEffect(() => {

    reqUserIdRef.current =
      reqUserId;

  }, [reqUserId]);

  useEffect(() => {

    fetchWorkspaces();

  }, []);

  useEffect(() => {

    if (selectedWorkspace) {

      socket.emit(
        "joinWorkspace",
        selectedWorkspace._id
      );

      setMembers([]);
      setMembersWorkspaceId(null);
      setNotes([]);
      setActivities([]);
      setTrashNotes([]);

      fetchMembers();

    }

    socket.on(
      "workspacesUpdated",
      async () => {

        await fetchWorkspaces();

      }
    );

    socket.on(
      "notesUpdated",
      () => {

        if (!selectedWorkspace) return;

        fetchNotes();
      }
    );

    socket.on(
      "membersUpdated",
      async () => {

        const workspace =
          selectedWorkspaceRef.current;

        if (!workspace) {
          return;
        }

        await fetchWorkspaces();

        if (
          selectedWorkspaceRef.current?._id !==
          workspace._id
        ) {
          return;
        }

        await fetchMembers();
      }
    );

    socket.on(
      "activityUpdated",
      () => {

        const workspace =
          selectedWorkspaceRef.current;

        if (!workspace) {
          return;
        }

        if (
          membersWorkspaceIdRef.current !==
          workspace._id
        ) {
          return;
        }

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
          String(reqUserIdRef.current)
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
          setMembersWorkspaceId(null);
          setActivities([]);
          setTrashNotes([]);

          await fetchWorkspaces();

          return;
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
          selectedWorkspaceRef.current?._id
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

    socket.on(
      "trashUpdated",
      () => {

        const workspace =
          selectedWorkspaceRef.current;

        if (!workspace) {
          return;
        }

        const me =
          membersRef.current.find(
            (member) =>
              String(member.user?._id) ===
              String(reqUserIdRef.current)
          );

        if (
          !me ||
          me.role === "viewer"
        ) {
          return;
        }

        fetchTrashNotes();
      }
    );

    return () => {

      socket.off("workspacesUpdated");

      socket.off("notesUpdated");

      socket.off("membersUpdated");

      socket.off("activityUpdated");

      socket.off("memberRemoved");

      socket.off("workspaceRenamed");

      socket.off("workspaceDeleted");

      socket.off("trashUpdated");

      if (selectedWorkspace?._id) {

        socket.emit(
          "leaveWorkspace",
          selectedWorkspace._id
        );
      }
    };

  }, [selectedWorkspace]);

  useEffect(() => {

    if (
      !selectedWorkspace ||
      membersWorkspaceId !==
        selectedWorkspace._id ||
      members.length === 0
    ) {
      return;
    }

    const me =
      members.find(
        (member) =>
          String(member.user?._id) ===
          String(reqUserId)
      );

    if (!me) {

      setNotes([]);
      setActivities([]);
      setTrashNotes([]);

      return;
    }

    fetchNotes();
    fetchActivities();

    const canViewTrash =
      me.role === "owner" ||
      me.role === "editor";

    if (canViewTrash) {

      fetchTrashNotes();

    } else {

      setTrashNotes([]);
    }

  }, [
    selectedWorkspace,
    members,
    membersWorkspaceId
  ]);

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

      setTitle("");
      setContent("");
      setAttachments([]);
      setCategory("General");
      setEditingId(null);

      return;
    }

    setRenameWorkspaceName(
      selectedWorkspace.name || ""
    );

    setWorkspaceDescription(
      selectedWorkspace.description || ""
    );

    setEditingWorkspace(false);

    setTitle("");
    setContent("");
    setAttachments([]);
    setCategory("General");
    setEditingId(null);

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
          selectedWorkspaceRef.current?._id
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
            selectedWorkspaceRef.current?._id
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
        
        case "NOTE_VERSION_RESTORED":
          return `restored version of "${activity.target}"`;

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

        case "NOTE_VERSION_RESTORED":
          return "⏪";

        default:
          return "📌";
      }
    };

  const filteredMembers =
    members.filter((member) => {

        if (!member.user) {
          return false;
        }

        return (

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

      });

  return (

    <div
      className="
        min-h-screen
        bg-slate-100
        dark:bg-slate-900
      "
    >

      <Navbar
        user={currentUser}
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

        <WorkspaceSection
          workspaceName={workspaceName}
          setWorkspaceName={setWorkspaceName}

          inviteCode={inviteCode}
          setInviteCode={setInviteCode}

          creatingWorkspace={creatingWorkspace}
          setCreatingWorkspace={setCreatingWorkspace}

          joiningWorkspace={joiningWorkspace}
          setJoiningWorkspace={setJoiningWorkspace}

          workspaces={workspaces}
          workspaceLoading={workspaceLoading}

          selectedWorkspace={selectedWorkspace}
          setSelectedWorkspace={setSelectedWorkspace}

          reqUserId={reqUserId}

          createWorkspace={createWorkspace}
          joinWorkspace={joinWorkspace}

          setWorkspaces={setWorkspaces}

          toast={toast}
        />

        {
          !selectedWorkspace ? (

            <EmptyWorkspace />

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
                  
                  <WorkspaceSettings
                    isOwner={isOwner}

                    editingWorkspace={editingWorkspace}
                    setEditingWorkspace={setEditingWorkspace}

                    selectedWorkspace={selectedWorkspace}

                    renameWorkspaceName={renameWorkspaceName}
                    setRenameWorkspaceName={setRenameWorkspaceName}

                    workspaceDescription={workspaceDescription}
                    setWorkspaceDescription={setWorkspaceDescription}

                    actionLoading={actionLoading}
                    setActionLoading={setActionLoading}

                    renameWorkspace={renameWorkspace}
                    deleteWorkspace={deleteWorkspace}
                    leaveWorkspace={leaveWorkspace}

                    fetchWorkspaces={fetchWorkspaces}

                    setSelectedWorkspace={setSelectedWorkspace}

                    setConfirmConfig={setConfirmConfig}
                    setConfirmOpen={setConfirmOpen}

                    toast={toast}
                  />

              <MembersSection
                memberSearch={memberSearch}
                setMemberSearch={setMemberSearch}

                membersLoading={membersLoading}
                filteredMembers={filteredMembers}

                isOwner={isOwner}
                actionLoading={actionLoading}

                selectedWorkspace={selectedWorkspace}

                fetchMembers={fetchMembers}
                fetchActivities={fetchActivities}
                fetchWorkspaces={fetchWorkspaces}

                changeMemberRole={changeMemberRole}
                removeMember={removeMember}
                transferOwnership={transferOwnership}

                setActionLoading={setActionLoading}
                setConfirmConfig={setConfirmConfig}
                setConfirmOpen={setConfirmOpen}

                toast={toast}
              />

              <ActivitySection
                activityFilter={activityFilter}
                setActivityFilter={setActivityFilter}
                filteredActivities={filteredActivities}
                getActivityIcon={getActivityIcon}
                formatActivity={formatActivity}
              />

              {
                canWrite && (

                  <NoteForm
                    title={title}
                    setTitle={setTitle}

                    content={content}
                    setContent={setContent}

                    category={category}
                    setCategory={setCategory}

                    attachments={attachments}
                    setAttachments={setAttachments}

                    uploading={uploading}
                    uploadCount={uploadCount}

                    creating={creating}
                    editingId={editingId}

                    uploadFile={uploadFile}

                    createNote={createNote}
                    updateNote={updateNote}

                    clearNoteForm={clearNoteForm}
                  />

                )

              }

              <StatisticsSection
                notes={notes}
                members={members}
                trashNotes={trashNotes}
              />

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
                      cursor-pointer
                      hover:bg-slate-600
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

                  <TrashSection
                    trashNotes={trashNotes}
                    fetchTrashNotes={fetchTrashNotes}
                    fetchNotes={fetchNotes}
                    restoreNote={restoreNote}
                    permanentlyDeleteNote={permanentlyDeleteNote}
                    toast={toast}
                    setConfirmConfig={setConfirmConfig}
                    setConfirmOpen={setConfirmOpen}
                  />

                )
              }

              <NotesSection
                notesLoading={notesLoading}

                filteredNotes={filteredNotes}

                pinnedNotes={pinnedNotes}
                normalNotes={normalNotes}

                setSelectedNote={setSelectedNote}

                togglePin={togglePin}
                editHandler={editHandler}
                deleteNote={deleteNote}

                canWrite={canWrite}
              />

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
        openVersionHistory={openVersionHistory}
      />

      {
        versionHistoryOpen && (

          <div
            className="
              fixed
              inset-0
              bg-black/50
              flex
              items-center
              justify-center
              z-50
              p-4
            "
          >

            <div
              className="
                bg-white
                dark:bg-slate-900
                rounded-3xl
                w-full
                max-w-3xl
                p-6
                max-h-[80vh]
                overflow-y-auto
              "
            >

              <div className="flex justify-between mb-6">

                <h2
                  className="
                    text-2xl
                    font-bold
                    dark:text-white
                  "
                >
                  Version History
                </h2>

                <button
                  onClick={() =>
                    setVersionHistoryOpen(false)
                  }
                  className="
                    text-2xl
                    dark:text-white
                  "
                >
                  ✕
                </button>

              </div>

              {
                versions.length === 0 ? (

                  <p className="dark:text-white">
                    No versions found
                  </p>

                ) : (

                  versions
                    .slice()
                    .reverse()
                    .map(
                      (
                        version,
                        index
                      ) => (

                        <div
                          key={index}
                          className="
                            border
                            rounded-xl
                            p-4
                            mb-4
                            dark:border-slate-700
                          "
                        >

                          <div
                            className="
                              flex
                              justify-between
                              items-start
                              mb-3
                            "
                          >

                            <div>

                              <h3
                                className="
                                  font-semibold
                                  dark:text-white
                                "
                              >
                                {version.title}
                              </h3>

                              <p
                                className="
                                  text-sm
                                  text-gray-500
                                "
                              >
                                {
                                  version.updatedBy?.name
                                }
                                {" • "}
                                {
                                  new Date(
                                    version.updatedAt
                                  ).toLocaleString()
                                }
                              </p>

                            </div>

                            {
                              canWrite && (

                                <button
                                  onClick={() => {

                                    setConfirmConfig({
                                      title:
                                        "Restore Version",

                                      message:
                                        "Restore this version? Current content will be saved in version history.",

                                      confirmText:
                                        "Restore",

                                      confirmColor:
                                        "bg-green-600",

                                      onConfirm: async () => {

                                        await restoreVersion(
                                          versions.length
                                          - 1
                                          - index
                                        );
                                      }
                                    });

                                    setConfirmOpen(true);
                                  }}
                                  className="
                                    bg-green-600
                                    hover:bg-green-700
                                    text-white
                                    px-4
                                    py-2
                                    rounded-lg
                                  "
                                >
                                  Restore
                                </button>

                              )
                            }

                          </div>

                          <div
                            className="
                              text-sm
                              text-gray-600
                              dark:text-gray-300
                              whitespace-pre-wrap
                            "
                          >
                            {version.content}
                          </div>

                        </div>

                      )
                    )

                )
              }

            </div>

          </div>

        )
      }

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