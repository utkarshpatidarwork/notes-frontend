import {
  useEffect,
  useState
} from "react";

import axios from "axios";

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

  const [image, setImage] =
    useState("");

  const [preview, setPreview] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [uploading, setUploading] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [search, setSearch] =
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
    useState(null);

  const [inviteCode, setInviteCode] =
    useState("");

  const navigate = useNavigate();

  const API =
    "https://notes-api-m5rs.onrender.com";

  const socket = io(API);

  const token =
    localStorage.getItem("token");

  const logoutHandler = () => {

    localStorage.removeItem("token");

    navigate("/");
  };

  const fetchWorkspaces =
    async () => {

      try {

        const { data } =
          await axios.get(
            `${API}/api/workspaces`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        setWorkspaces(data);

        if (
          data.length > 0 &&
          !selectedWorkspace
        ) {
          setSelectedWorkspace(
            data[0]
          );
        }

      } catch (error) {

        toast.error(
          "Workspace fetch failed"
        );
      }
    };

  const fetchNotes = async () => {

    try {

      const { data } = await axios.get(
        `${API}/api/notes?workspace=${selectedWorkspace?._id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setNotes(data.notes);

    } catch (error) {

      toast.error("Something went wrong");
    }
  };

  useEffect(() => {

    fetchWorkspaces();

  }, []);

  useEffect(() => {

    if (selectedWorkspace) {

      fetchNotes();
    }

    socket.on(
      "notesUpdated",
      () => {

        fetchNotes();
      }
    );

    return () => {

      socket.off("notesUpdated");
    };

  }, [selectedWorkspace]);

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

  const uploadImage = async (file) => {

    try {

      setUploading(true);

      setPreview(
        URL.createObjectURL(file)
      );

      const formData = new FormData();

      formData.append("file", file);

      const { data } = await axios.post(
        `${API}/api/upload`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      setImage(data.imageUrl);

      setUploading(false);

    } catch (error) {

      setUploading(false);

      toast.error("Something went wrong");
    }
  };

  const createNote = async (e) => {

    e.preventDefault();

    try {

      setCreating(true);

      await axios.post(
        `${API}/api/notes`,
        {
          title,
          content,
          image,
          category,

          workspace:
            selectedWorkspace?._id
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setTitle("");
      setContent("");
      setImage("");
      setPreview("");
      setCategory("General");

      fetchNotes();

      toast.success("Note Created");

      setCreating(false);

    } catch (error) {

      setCreating(false);

      toast.error("Something went wrong");
    }
  };

  const updateNote = async (e) => {

    e.preventDefault();

    try {

      await axios.put(
        `${API}/api/notes/${editingId}`,
        {
          title,
          content,
          image,
          category,

          workspace:
            selectedWorkspace?._id
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setTitle("");
      setContent("");
      setImage("");
      setPreview("");
      setCategory("General");
      setEditingId(null);

      fetchNotes();

      toast.success("Note Updated");

    } catch (error) {

      toast.error("Something went wrong");
    }
  };

  const togglePin = async (note) => {

    try {

      await axios.put(
        `${API}/api/notes/${note._id}`,
        {
          isPinned: !note.isPinned
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
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
        "Something went wrong"
      );
    }
  };

  const deleteNote = async (id) => {

    try {

      await axios.delete(
        `${API}/api/notes/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      fetchNotes();

      toast.success("Note Deleted");

    } catch (error) {

      toast.error("Something went wrong");
    }
  };

  const editHandler = (note) => {

    setTitle(note.title);

    setContent(note.content);

    setImage(note.image);

    setCategory(note.category);

    setEditingId(note._id);
  };

  const filteredNotes = notes.filter(
    (note) => {

      const text =
        `${note.title} ${note.content}`
          .toLowerCase();

      const matchesSearch =
        text.includes(
          search.toLowerCase()
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
          p-6
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

          <div className="flex gap-3 mb-4">

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

                  await axios.post(
                    `${API}/api/workspaces`,
                    {
                      name:
                        workspaceName
                    },
                    {
                      headers: {
                        Authorization:
                          `Bearer ${token}`
                      }
                    }
                  );

                  setWorkspaceName("");

                  fetchWorkspaces();

                  toast.success(
                    "Workspace Created"
                  );

                } catch (error) {

                  toast.error(
                    "Workspace creation failed"
                  );
                }
              }}
              className="
                bg-blue-600
                hover:bg-blue-700
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

                  await axios.post(
                    `${API}/api/workspaces/join`,
                    {
                      inviteCode
                    },
                    {
                      headers: {
                        Authorization:
                          `Bearer ${token}`
                      }
                    }
                  );

                  setInviteCode("");

                  fetchWorkspaces();

                  toast.success(
                    "Joined Workspace"
                  );

                } catch (error) {

                  toast.error(
                    "Join failed"
                  );
                }
              }}
              className="
                bg-green-600
                hover:bg-green-700
                text-white
                px-6
                rounded-lg
              "
            >
              Join
            </button>

          </div>

          <div className="flex gap-3 flex-wrap">

            {
              workspaces.map(
                (workspace) => (

                  <button
                    key={workspace._id}
                    onClick={() =>
                      setSelectedWorkspace(
                        workspace
                      )
                    }
                    className={`
                      px-4
                      py-2
                      rounded-full
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
                items-center
                justify-center
                border-2
                border-dashed
                border-gray-300
                rounded-xl
                p-6
                cursor-pointer
                hover:border-blue-500
                hover:bg-blue-50
                transition
                text-gray-600
                font-medium
              "
            >

              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  uploadImage(
                    e.target.files[0]
                  )
                }
              />

              {
                uploading
                  ? "Uploading..."
                  : "Choose Image"
              }

            </label>

            {
              preview && (

                <img
                  src={preview}
                  alt="preview"
                  className="
                    w-full
                    h-60
                    object-cover
                    rounded-xl
                  "
                />

              )
            }

            <button
              type="submit"
              disabled={creating}
              className="
                bg-blue-600
                hover:bg-blue-700
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

        {
          filteredNotes.length === 0 ? (

            <div
              className="
                bg-white
                dark:bg-slate-800
                rounded-2xl
                shadow-md
                p-10
                text-center
              "
            >

              <h2
                className="
                  text-3xl
                  font-bold
                  mb-3
                  dark:text-white
                "
              >
                📝 No Notes Yet
              </h2>

              <p
                className="
                  text-gray-600
                  dark:text-gray-300
                "
              >
                Create your first note 🚀
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