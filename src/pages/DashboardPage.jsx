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
  deleteWorkspace
} from "../services/workspaceService";

import {
  uploadFile as uploadFileService
} from "../services/uploadService";

import { getActivities } from "../services/activityService";

import {
  updateProfile,
  changePassword
} from "../services/authService";

import toast from "react-hot-toast";

import { io } from "socket.io-client";

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

  const [uploading, setUploading] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

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

  const [notesLoading, setNotesLoading] =
    useState(false);

  const [workspaceLoading, setWorkspaceLoading] =
    useState(false);

  const [activities, setActivities] =
    useState([]);

  const [trashNotes, setTrashNotes] =
    useState([]);

  const [showTrash, setShowTrash] =
    useState(false);

  const currentUser =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  const reqUserId =
    currentUser?._id;

  const [profileName, setProfileName] =
    useState(
      currentUser?.name || ""
    );

  const [profileEmail, setProfileEmail] =
    useState(
      currentUser?.email || ""
    );

  const [
    currentPassword,
    setCurrentPassword
  ] = useState("");

  const [
    newPassword,
    setNewPassword
  ] = useState("");

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

          setSelectedWorkspace(
            currentWorkspace
            ||
            savedWorkspace
            ||
            data[0]
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
      () => {

        fetchMembers();
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

  const uploadFile =
    async (file) => {

      try {

        setUploading(true);

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

        setUploading(false);
      }
    };

  const createNote = async (e) => {

    e.preventDefault();

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

  const deleteNote = async (id) => {

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

  const updateProfileHandler =
    async () => {

      try {

        const data =
          await updateProfile(
            profileName,
            profileEmail
          );

        const updatedUser = {
          ...currentUser,
          name: data.name,
          email: data.email
        };

        localStorage.setItem(
          "user",
          JSON.stringify(
            updatedUser
          )
        );

        toast.success(
          "Profile updated"
        );

      } catch (error) {

        toast.error(
          error.response?.data?.message
          ||
          "Profile update failed"
        );
      }
    };

  const changePasswordHandler =
    async () => {

      try {

        const data =
          await changePassword(
            currentPassword,
            newPassword
          );

        setCurrentPassword("");
        setNewPassword("");

        toast.success(
          data.message
        );

      } catch (error) {

        toast.error(
          error.response?.data?.message
          ||
          "Password change failed"
        );
      }
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
          return `changed role to ${activity.target}`;

        case "MEMBER_REMOVED":
          return `removed member`;

        case "MEMBER_LEFT":
          return `left workspace`;

        case "WORKSPACE_CREATED":
          return `created workspace "${activity.target}"`;

        default:
          return activity.action;
      }
    };

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
              mb-6
              dark:text-white
            "
          >
            Account Settings
          </h2>

          <div
            className="
              grid
              md:grid-cols-2
              gap-6
            "
          >

            <div>

              <h3
                className="
                  font-semibold
                  mb-4
                  dark:text-white
                "
              >
                Update Profile
              </h3>

              <div className="space-y-3">

                <input
                  type="text"
                  placeholder="Name"
                  value={profileName}
                  onChange={(e) =>
                    setProfileName(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    rounded-lg
                    px-4
                    py-3
                    dark:bg-slate-700
                    dark:text-white
                  "
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={profileEmail}
                  onChange={(e) =>
                    setProfileEmail(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    rounded-lg
                    px-4
                    py-3
                    dark:bg-slate-700
                    dark:text-white
                  "
                />

                <button
                  onClick={
                    updateProfileHandler
                  }
                  className="
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    px-5
                    py-3
                    rounded-lg
                  "
                >
                  Update Profile
                </button>

              </div>

            </div>

            <div>

              <h3
                className="
                  font-semibold
                  mb-4
                  dark:text-white
                "
              >
                Change Password
              </h3>

              <div className="space-y-3">

                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    rounded-lg
                    px-4
                    py-3
                    dark:bg-slate-700
                    dark:text-white
                  "
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    rounded-lg
                    px-4
                    py-3
                    dark:bg-slate-700
                    dark:text-white
                  "
                />

                <button
                  onClick={
                    changePasswordHandler
                  }
                  className="
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    px-5
                    py-3
                    rounded-lg
                  "
                >
                  Change Password
                </button>

              </div>

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
            >
              Create
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
            >
              Join
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

              <div className="flex gap-3 flex-wrap">

                {
                  workspaces.map(
                    (workspace) => (

                      <div
                        key={workspace._id}
                        className="
                          flex
                          flex-col
                          items-center
                        "
                      >

                        <button
                          onClick={() =>
                            setSelectedWorkspace(
                              workspace
                            )
                          }
                          className={`
                            px-4
                            py-2
                            rounded-full
                            active:scale-95
                            transition
                            ${
                              selectedWorkspace?._id
                              === workspace._id
                                ? "bg-blue-600 text-white"
                                : "bg-slate-200"
                            }
                          `}
                        >
                          <div>

                            <div>
                              {workspace.name}
                            </div>

                            <div
                              className="
                                text-xs
                                opacity-70
                              "
                            >
                              {workspace.inviteCode}
                            </div>

                          </div>

                        </button>

                        {
                          selectedWorkspace?._id
                          ===
                          workspace._id
                          && (

                           String(
                            workspace.owner
                          )
                          ===
                          String(
                            reqUserId
                          )

                            ? (

                              <button
                                onClick={async () => {

                                  if (
                                    !window.confirm(
                                      "Delete this workspace and all its notes?"
                                    )
                                  ) {
                                    return;
                                  }

                                  try {

                                    const data =
                                      await deleteWorkspace(
                                        workspace._id
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

                                  } catch (error) {

                                    toast.error(
                                      error.response?.data?.message
                                      ||
                                      "Delete failed"
                                    );
                                  }
                                }}
                                className="
                                  mt-2
                                  bg-red-700
                                  text-white
                                  px-3
                                  py-1
                                  rounded-lg
                                  text-xs
                                "
                              >
                                Delete Workspace
                              </button>

                            ) : (

                              <button
                                onClick={async () => {

                                  try {

                                    const data =
                                      await leaveWorkspace(
                                        workspace._id
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

                                  } catch (error) {

                                    toast.error(
                                      error.response?.data?.message
                                      ||
                                      "Failed to leave workspace"
                                    );
                                  }
                                }}
                                className="
                                  mt-2
                                  bg-red-500
                                  text-white
                                  px-3
                                  py-1
                                  rounded-lg
                                  text-xs
                                "
                              >
                                Leave
                              </button>

                            )

                          )
                        }

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
                        members.map(
                          (member) => {

                            const isOwner =
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
                                    className="
                                      px-3
                                      py-1
                                      rounded-full
                                      text-xs
                                      font-semibold
                                      bg-slate-200
                                      dark:bg-slate-700
                                      dark:text-white
                                      capitalize
                                    "
                                  >
                                    {member.role}
                                  </div>

                                </div>

                                {
                                  String(selectedWorkspace?.owner)
                                  ===
                                  String(reqUserId)
                                  && !isOwner
                                  && (

                                    <div
                                      className="
                                        flex
                                        gap-2
                                        items-center
                                      "
                                    >

                                      <select
                                        disabled={isOwner}
                                        value={member.role}
                                        onChange={async (e) => {

                                          try {

                                            await changeMemberRole(
                                              selectedWorkspace._id,
                                              member.user._id,
                                              e.target.value
                                            );

                                            fetchMembers();

                                            toast.success(
                                              "Role Updated"
                                            );

                                          } catch (error) {

                                            toast.error(
                                              error.response?.data?.message
                                              ||
                                              "Update failed"
                                            );
                                          }
                                        }}
                                        className="
                                          border
                                          rounded-lg
                                          px-3
                                          py-2
                                        "
                                      >

                                        <option value="viewer">
                                          Viewer
                                        </option>

                                        <option value="editor">
                                          Editor
                                        </option>

                                      </select>

                                      <button
                                        disabled={isOwner}
                                        onClick={async () => {

                                          try {

                                            await removeMember(
                                              selectedWorkspace._id,
                                              member.user._id
                                            );

                                            fetchMembers();

                                            toast.success(
                                              "Member Removed"
                                            );

                                          } catch (error) {

                                            toast.error(
                                              error.response?.data?.message
                                              ||
                                              "Remove failed"
                                            );
                                          }
                                        }}
                                        className="
                                          bg-red-500
                                          text-white
                                          px-4
                                          py-2
                                          rounded-lg
                                        "
                                      >
                                        Remove
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

                <div className="space-y-3">

                  {
                    activities.length === 0
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
                      activities
                        .slice(0, 5)
                        .map(
                        (activity) => (

                          <div
                            key={activity._id}
                            className="
                              border-b
                              pb-2
                            "
                          >

                            <p
                              className="
                                dark:text-white
                              "
                            >

                              <strong>
                                {activity.user?.name}
                              </strong>

                              {" "}

                              {formatActivity(activity)}

                            </p>

                          </div>

                        )
                      )
                    )
                  }

                </div>

              </div>

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
                          ? "Uploading..."
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
                      disabled={creating}
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
                        creating
                          ? "Saving..."
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
                                  onClick={async () => {

                                    const data =
                                      await permanentlyDeleteNote(
                                        note._id
                                      );

                                    fetchTrashNotes();

                                    toast.success(
                                      data.message
                                    );
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
                      filteredNotes.map(
                        (note) => (

                          <NoteCard
                            key={note._id}
                            note={note}
                            setSelectedNote={
                              setSelectedNote
                            }
                            togglePin={togglePin}
                            editHandler={
                              editHandler
                            }
                            deleteNote={
                              deleteNote
                            }
                          />

                        )
                      )
                    }

                  </div>

                )
              }

            </>

          )
        }

      </div>

      <NoteModal
        selectedNote={selectedNote}
        setSelectedNote={
          setSelectedNote
        }
      />

    </div>
  );
}

export default DashboardPage;