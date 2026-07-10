//AdminDashboard.jsx
import {
    useEffect,
    useState,
    useRef
} from "react";

import {
    useNavigate
} from "react-router-dom";

import toast
    from "react-hot-toast";

import socket
    from "../socket";

import {
    getDashboard,
    getUsers,
    getWorkspaces,
    getNotes,
    getActivities
} from "../services/adminService";

import UsersSection
    from "../components/admin/UsersSection";

import WorkspacesSection
    from "../components/admin/WorkspacesSection";

import NotesSection
    from "../components/admin/NotesSection";

import ActivitiesSection
    from "../components/admin/ActivitiesSection";

import AnalyticsSection
    from "../components/admin/AnalyticsSection";

import SettingsSection
    from "../components/admin/SettingsSection";

import ConfirmModal 
    from "../components/ConfirmModal";

function AdminDashboard() {

    const navigate =
        useNavigate();

    const user =
        JSON.parse(
            localStorage.getItem(
                "user"
            )
        );

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [sidebarOpen, setSidebarOpen] =
        useState(() => {

            const saved =
                localStorage.getItem(
                    "adminSidebarOpen"
                );

            return saved === null
                ? true
                : JSON.parse(saved);

        });

    const [users, setUsers] =
        useState([]);

    const [usersPage, setUsersPage] =
        useState(1);

    const [usersTotalPages, setUsersTotalPages] =
        useState(1);

    const [usersSearch, setUsersSearch] =
        useState("");

    const [usersProcessingId, setUsersProcessingId] =
        useState(null);

    const [darkMode, setDarkMode] =
        useState(
            localStorage.getItem("theme")
            === "dark"
        );

    const [activeSection, setActiveSection] =
        useState(() =>
            localStorage.getItem(
                "adminActiveSection"
            ) || "dashboard"
        );

    const [workspaces, setWorkspaces] =
        useState([]);

    const [workspacePage, setWorkspacePage] =
        useState(1);

    const [workspaceTotalPages, setWorkspaceTotalPages] =
        useState(1);

    const [workspaceSearch, setWorkspaceSearch] =
        useState("");

    const [workspaceProcessingId, setWorkspaceProcessingId] =
        useState(null);

    const [notes, setNotes] =
        useState([]);

    const [notesPage, setNotesPage] =
        useState(1);

    const [notesTotalPages, setNotesTotalPages] =
        useState(1);

    const [notesSearch, setNotesSearch] =
        useState("");

    const [notesProcessingId, setNotesProcessingId] =
        useState(null);

    const [activities, setActivities] =
        useState([]);

    const [activitiesPage, setActivitiesPage] =
        useState(1);

    const [activitiesTotalPages, setActivitiesTotalPages] =
        useState(1);

    const [activitiesSearch, setActivitiesSearch] =
        useState("");

    const [debouncedUserSearch, setDebouncedUserSearch] =
        useState("");

    const [debouncedWorkspaceSearch, setDebouncedWorkspaceSearch] =
        useState("");

    const [debouncedNoteSearch, setDebouncedNoteSearch] =
        useState("");

    const [debouncedActivitiesSearch, setDebouncedActivitiesSearch] =
        useState("");

    const [
        confirmOpen,
        setConfirmOpen
    ] = useState(false);

    const [
        confirmConfig,
        setConfirmConfig
    ] = useState({});

    const dashboardRequestRef =
        useRef(0);

    const usersRequestRef =
        useRef(0);

    const workspacesRequestRef =
        useRef(0);

    const notesRequestRef =
        useRef(0);

    const activitiesRequestRef =
        useRef(0);

    const usersPageRef =
        useRef(usersPage);

    const workspacePageRef =
        useRef(workspacePage);

    const notesPageRef =
        useRef(notesPage);

    const activitiesPageRef =
        useRef(activitiesPage);

    const debouncedUserSearchRef =
        useRef(
            debouncedUserSearch
        );

    const debouncedWorkspaceSearchRef =
        useRef(
            debouncedWorkspaceSearch
        );

    const debouncedNoteSearchRef =
        useRef(
            debouncedNoteSearch
        );

    const debouncedActivitiesSearchRef =
        useRef(
            debouncedActivitiesSearch
        );

    const fetchDashboard =
        async () => {

            const requestId =
                ++dashboardRequestRef.current;

            try {

                const data =
                    await getDashboard();

                if (
                    requestId !==
                    dashboardRequestRef.current
                ) {
                    return;
                }

                setDashboard(data);

            } catch (error) {

                if (
                    requestId !==
                    dashboardRequestRef.current
                ) {
                    return;
                }

                toast.error("Failed to load dashboard");

            } finally {

                if (
                    requestId ===
                    dashboardRequestRef.current
                ) {

                    setLoading(false);

                }
            }
        };

    const fetchUsers =
        async () => {

            const requestId =
                ++usersRequestRef.current;

            try {

                const data =
                    await getUsers(
                        usersPageRef.current,
                        debouncedUserSearchRef.current
                    );

                if (
                    requestId !==
                    usersRequestRef.current
                ) {
                    return;
                }

                setUsers(
                    data.users
                );

                setUsersTotalPages(
                    data.totalPages
                );

            } catch {

                if (
                    requestId !==
                    usersRequestRef.current
                ) {
                    return;
                }

                toast.error(
                    "Failed to load users"
                );
            }
        };

    const fetchWorkspaces =
        async () => {

            const requestId =
                ++workspacesRequestRef.current;

            try {

                const data =
                    await getWorkspaces(
                        workspacePageRef.current,
                        debouncedWorkspaceSearchRef.current
                    );

                if (
                    requestId !==
                    workspacesRequestRef.current
                ) {
                    return;
                }

                setWorkspaces(
                    data.workspaces
                );

                setWorkspaceTotalPages(
                    data.totalPages
                );

            } catch {

                if (
                    requestId !==
                    workspacesRequestRef.current
                ) {
                    return;
                }

                toast.error(
                    "Failed to load workspaces"
                );

            }

        };

    const fetchNotes =
        async () => {

            const requestId =
                ++notesRequestRef.current;

            try {

                const data =
                    await getNotes(
                        notesPageRef.current,
                        debouncedNoteSearchRef.current
                    );

                if (
                    requestId !==
                    notesRequestRef.current
                ) {
                    return;
                }

                setNotes(
                    data.notes
                );

                setNotesTotalPages(
                    data.totalPages
                );

            } catch {

                if (
                    requestId !==
                    notesRequestRef.current
                ) {
                    return;
                }

                toast.error(
                    "Failed to load notes"
                );

            }

        };

    const fetchActivities =
        async () => {

            const requestId =
                ++activitiesRequestRef.current;

            try {

                const data =
                    await getActivities(
                        activitiesPageRef.current,
                        debouncedActivitiesSearchRef.current
                    );

                if (
                    requestId !==
                    activitiesRequestRef.current
                ) {
                    return;
                }

                setActivities(
                    data.activities
                );

                setActivitiesTotalPages(
                    data.totalPages
                );

            } catch {

                if (
                    requestId !==
                    activitiesRequestRef.current
                ) {
                    return;
                }

                toast.error(
                    "Failed to load activities"
                );

            }

        };

    const formatAction = (action) => {

        switch (action) {

            case "NOTE_CREATED":
                return "Created a note";

            case "NOTE_UPDATED":
                return "Updated a note";

            case "NOTE_DELETED":
                return "Deleted a note";

            case "WORKSPACE_CREATED":
                return "Created a workspace";

            case "WORKSPACE_UPDATED":
                return "Updated a workspace";

            case "WORKSPACE_DELETED":
                return "Deleted a workspace";

            case "MEMBER_JOINED":
                return "Joined a workspace";

            case "MEMBER_REMOVED":
                return "Removed a member";

            case "ROLE_CHANGED":
                return "Changed a user role";

            default:
                return action
                    ?.replaceAll("_", " ")
                    ?.toLowerCase()
                    ?.replace(/\b\w/g, c => c.toUpperCase());

        }

    };

    const sidebarItems = [

        {
            key: "dashboard",
            icon: "📊",
            label: "Dashboard"
        },

        {
            key: "users",
            icon: "👤",
            label: "Users"
        },

        {
            key: "workspaces",
            icon: "📂",
            label: "Workspaces"
        },

        {
            key: "notes",
            icon: "📝",
            label: "Notes"
        },

        {
            key: "activities",
            icon: "📜",
            label: "Activities"
        },

        {
            key: "analytics",
            icon: "📈",
            label: "Analytics"
        },

        {
            key: "settings",
            icon: "⚙️",
            label: "Settings"
        }

    ];

    useEffect(() => {

        usersPageRef.current =
            usersPage;

    }, [usersPage]);

    useEffect(() => {

        workspacePageRef.current =
            workspacePage;

    }, [workspacePage]);

    useEffect(() => {

        notesPageRef.current =
            notesPage;

    }, [notesPage]);

    useEffect(() => {

        activitiesPageRef.current =
            activitiesPage;

    }, [activitiesPage]);

    useEffect(() => {

        debouncedUserSearchRef.current =
            debouncedUserSearch;

    }, [debouncedUserSearch]);

    useEffect(() => {

        debouncedWorkspaceSearchRef.current =
            debouncedWorkspaceSearch;

    }, [debouncedWorkspaceSearch]);

    useEffect(() => {

        debouncedNoteSearchRef.current =
            debouncedNoteSearch;

    }, [debouncedNoteSearch]);

    useEffect(() => {

        debouncedActivitiesSearchRef.current =
            debouncedActivitiesSearch;

    }, [debouncedActivitiesSearch]);

    useEffect(() => {

        fetchDashboard();

    }, []);

    useEffect(() => {

        localStorage.setItem(

            "adminSidebarOpen",

            JSON.stringify(
                sidebarOpen
            )

        );

    }, [sidebarOpen]);

    useEffect(() => {

        const timer =
            setTimeout(() => {

                setDebouncedUserSearch(
                    usersSearch
                );

            }, 300);

        return () =>
            clearTimeout(
                timer
            );

    }, [usersSearch]);

    useEffect(() => {

        const timer =
            setTimeout(() => {

                setDebouncedWorkspaceSearch(
                    workspaceSearch
                );

            }, 300);

        return () =>
            clearTimeout(
                timer
            );

    }, [workspaceSearch]);

    useEffect(() => {

        const timer =
            setTimeout(() => {

                setDebouncedNoteSearch(
                    notesSearch
                );

            }, 300);

        return () =>
            clearTimeout(
                timer
            );

    }, [notesSearch]);

    useEffect(() => {

        const timer =
            setTimeout(() => {

                setDebouncedActivitiesSearch(
                    activitiesSearch
                );

            }, 300);

        return () =>
            clearTimeout(
                timer
            );

    }, [activitiesSearch]);

    useEffect(() => {

        fetchUsers();

    }, [
        usersPage,
        debouncedUserSearch
    ]);

    useEffect(() => {

        fetchWorkspaces();

    }, [
        workspacePage,
        debouncedWorkspaceSearch
    ]);

    useEffect(() => {

        fetchNotes();

    }, [
        notesPage,
        debouncedNoteSearch
    ]);

    useEffect(() => {

        fetchActivities();

    }, [
        activitiesPage,
        debouncedActivitiesSearch
    ]);

    useEffect(() => {

        localStorage.setItem(
            "adminActiveSection",
            activeSection
        );

    }, [activeSection]);

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

        socket.on(
            "usersUpdated",
            () => {

                fetchUsers();
                fetchDashboard();

            }
        );

        socket.on(
            "workspacesUpdated",
            () => {

                fetchWorkspaces();
                fetchDashboard();

            }
        );

        socket.on(
            "notesUpdated",
            () => {

                fetchNotes();
                fetchDashboard();

            }
        );

        socket.on(
            "activityUpdated",
            () => {

                fetchActivities();
                fetchDashboard();

            }
        );

        return () => {

            socket.off("usersUpdated");

            socket.off("workspacesUpdated");

            socket.off("notesUpdated");

            socket.off("activityUpdated");

        };

    }, []);

    const logoutHandler =
        () => {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "selectedWorkspace"
            );

            localStorage.removeItem(
                "adminActiveSection"
            );

            navigate("/");
        };

    if (!loading && !dashboard) {

        return (

            <div
                className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                    text-slate-900
                    dark:text-white
                "
            >
                Failed to load dashboard.
            </div>

        );
    }

    return (

        <div
            className="
                min-h-screen
                bg-slate-100
                dark:bg-slate-900
            "
        >

            <div
                className="
                    sticky
                    top-0
                    z-40
                    bg-white
                    dark:bg-slate-800
                    border-b
                    border-slate-200
                    dark:border-slate-700
                    px-8
                    py-4
                    flex
                    justify-between
                    items-center
                "
            >

                <h1
                    className="
                        text-2xl
                        font-bold
                        text-slate-900
                        dark:text-white
                    "
                >
                    Admin Panel
                </h1>

                <div
                    className="
                        flex
                        items-center
                        gap-4
                        text-slate-900
                        dark:text-white
                    "
                >

                    <span>

                        Welcome,

                        {" "}

                        {user?.name}

                    </span>

                    <button

                        aria-label={
                            darkMode
                                ? "Switch to light mode"
                                : "Switch to dark mode"
                        }

                        onClick={() =>
                            setDarkMode(
                                !darkMode
                            )
                        }

                        className="
                            border
                            border-slate-300
                            dark:border-slate-600
                            rounded-lg
                            px-4
                            py-2
                            hover:bg-slate-100
                            dark:hover:bg-slate-700
                            transition
                            cursor-pointer
                        "
                    >

                        {
                            darkMode
                                ? "☀️"
                                : "🌙"
                        }

                    </button>

                    <button
                        onClick={
                            logoutHandler
                        }
                        className="
                            bg-red-600
                            hover:bg-red-700
                            transition
                            px-4
                            py-2
                            rounded-lg
                            cursor-pointer
                        "
                    >
                        Logout
                    </button>

                </div>

            </div>

            <div
                className="
                    flex
                    min-h-[calc(100vh-72px)]
                    overflow-visible
                "
            >

                <aside
                    className={`
                        relative
                        sticky
                        top-[72px]
                        h-[calc(100vh-72px)]
                        shrink-0
                        overflow-visible
                        bg-white
                        dark:bg-slate-800
                        border-r
                        border-slate-200
                        dark:border-slate-700
                        transition-all
                        duration-300
                        ${
                            sidebarOpen
                                ? "w-64 p-6"
                                : "w-20 p-4"
                        }
                    `}
                >

                    <ul
                        className="
                            space-y-3
                            font-medium
                            dark:text-white
                        "
                    >

                        {

                            sidebarItems.map(
                                (item) => (

                                    <li

                                        key={
                                            item.key
                                        }

                                        onClick={() =>
                                            setActiveSection(
                                                item.key
                                            )
                                        }

                                        className={`
                                            flex
                                            items-center
                                            ${
                                                sidebarOpen
                                                    ? "gap-3 px-3 py-2"
                                                    : "justify-center py-3"
                                            }
                                            rounded-lg
                                            cursor-pointer
                                            transition-all
                                            duration-200
                                            ${
                                                activeSection === item.key
                                                    ? "bg-blue-600 text-white"
                                                    : "hover:bg-slate-100 dark:hover:bg-slate-700"
                                            }
                                        `}
                                    >

                                        <>
                                            <span>
                                                {item.icon}
                                            </span>

                                            {
                                                sidebarOpen && (

                                                    <span>
                                                        {item.label}
                                                    </span>

                                                )
                                            }
                                        </>

                                    </li>

                                )
                            )

                        }

                    </ul>

                    <button

                        aria-label={
                            sidebarOpen
                                ? "Collapse sidebar"
                                : "Expand sidebar"
                        }

                        onClick={() =>
                            setSidebarOpen(
                                !sidebarOpen
                            )
                        }

                        className="
                            absolute
                            top-1/2
                            -right-4
                            -translate-y-1/2
                            w-8
                            h-20
                            flex
                            items-center
                            justify-center
                            bg-white
                            dark:bg-slate-800
                            rounded-r-xl
                            hover:bg-slate-200
                            dark:hover:bg-slate-700
                            transition-all
                            duration-300
                            z-50
                            cursor-pointer
                            text-slate-900
                            dark:text-white
                        "
                    >

                        {
                            sidebarOpen
                                ? "❮"
                                : "❯"
                        }

                    </button>

                </aside>

                <main
                    className="
                        flex-1
                        overflow-y-auto
                        p-8
                    "
                >

                    {
                        loading ? (

                            <div
                                className="
                                    flex
                                    flex-col
                                    justify-center
                                    items-center
                                    h-80
                                    gap-4
                                "
                            >

                                <div
                                    className="
                                        w-12
                                        h-12
                                        border-4
                                        border-slate-300
                                        dark:border-slate-500
                                        border-t-blue-600
                                        dark:border-t-blue-400
                                        rounded-full
                                        animate-spin
                                    "
                                />

                                <p
                                    className="
                                        text-slate-600
                                        dark:text-slate-300
                                        font-medium
                                    "
                                >
                                    Loading dashboard...
                                </p>

                            </div>

                        ) : (

                            <>

                                {
                                    activeSection === "dashboard" && (

                                        <>

                                            <div
                                                className="
                                                    grid
                                                    grid-cols-1
                                                    sm:grid-cols-2
                                                    xl:grid-cols-4
                                                    gap-5
                                                    mb-10
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        flex-col
                                                        gap-2
                                                        bg-white
                                                        dark:bg-slate-800
                                                        text-slate-900
                                                        dark:text-white
                                                        border
                                                        border-slate-200
                                                        dark:border-slate-700
                                                        p-6
                                                        rounded-xl
                                                        transition-all
                                                        duration-200
                                                        hover:shadow-lg
                                                        hover:-translate-y-1
                                                        dark:hover:bg-slate-700
                                                    "
                                                >
                                                    👤 Users
                                                    <div className="text-3xl font-bold">
                                                        {dashboard.stats.users}
                                                    </div>
                                                </div>

                                                <div
                                                    className="
                                                        flex
                                                        flex-col
                                                        gap-2
                                                        bg-white
                                                        dark:bg-slate-800
                                                        text-slate-900
                                                        dark:text-white
                                                        border
                                                        border-slate-200
                                                        dark:border-slate-700
                                                        p-6
                                                        rounded-xl
                                                        transition-all
                                                        duration-200
                                                        hover:shadow-lg
                                                        hover:-translate-y-1
                                                        dark:hover:bg-slate-700
                                                    "
                                                >
                                                    📂 Workspaces
                                                    <div className="text-3xl font-bold">
                                                        {dashboard.stats.workspaces}
                                                    </div>
                                                </div>

                                                <div
                                                    className="
                                                        flex
                                                        flex-col
                                                        gap-2
                                                        bg-white
                                                        dark:bg-slate-800
                                                        text-slate-900
                                                        dark:text-white
                                                        border
                                                        border-slate-200
                                                        dark:border-slate-700
                                                        p-6
                                                        rounded-xl
                                                        transition-all
                                                        duration-200
                                                        hover:shadow-lg
                                                        hover:-translate-y-1
                                                        dark:hover:bg-slate-700
                                                    "
                                                >
                                                    📝 Notes
                                                    <div className="text-3xl font-bold">
                                                        {dashboard.stats.notes}
                                                    </div>
                                                </div>

                                                <div
                                                    className="
                                                        flex
                                                        flex-col
                                                        gap-2
                                                        bg-white
                                                        dark:bg-slate-800
                                                        text-slate-900
                                                        dark:text-white
                                                        border
                                                        border-slate-200
                                                        dark:border-slate-700
                                                        p-6
                                                        rounded-xl
                                                        transition-all
                                                        duration-200
                                                        hover:shadow-lg
                                                        hover:-translate-y-1
                                                        dark:hover:bg-slate-700
                                                    "
                                                >
                                                    📜 Activities
                                                    <div className="text-3xl font-bold">
                                                        {dashboard.stats.activities}
                                                    </div>
                                                </div>

                                            </div>

                                            <div
                                                className="
                                                    grid
                                                    grid-cols-1
                                                    xl:grid-cols-2
                                                    gap-6
                                                    mb-6
                                                "
                                            >

                                                <div
                                                    className="
                                                        bg-white
                                                        dark:bg-slate-800
                                                        border
                                                        border-slate-200
                                                        dark:border-slate-700
                                                        rounded-xl
                                                        p-6
                                                    "
                                                >

                                                    <h3
                                                        className="
                                                            text-lg
                                                            font-semibold
                                                            mb-4
                                                            text-slate-900
                                                            dark:text-white
                                                        "
                                                    >
                                                        👤 Recent Users
                                                    </h3>

                                                    <div
                                                        className="
                                                            divide-y
                                                            divide-slate-200
                                                            dark:divide-slate-700
                                                        "
                                                    >

                                                        {
                                                            dashboard.recentUsers?.length > 0
                                                                ? (

                                                                    dashboard.recentUsers.map(
                                                                        (user) => (

                                                                            <div
                                                                                key={user._id}
                                                                                className="
                                                                                    py-3
                                                                                "
                                                                            >

                                                                                <div
                                                                                    className="
                                                                                        font-semibold
                                                                                        text-slate-900
                                                                                        dark:text-white
                                                                                    "
                                                                                >
                                                                                    {user.name}
                                                                                </div>

                                                                                <div
                                                                                    className="
                                                                                        text-sm
                                                                                        text-slate-500
                                                                                        dark:text-slate-400
                                                                                    "
                                                                                >
                                                                                    {user.email}
                                                                                </div>

                                                                            </div>

                                                                        )
                                                                    )

                                                                ) : (

                                                                    <div
                                                                        className="
                                                                            py-4
                                                                            text-center
                                                                            text-slate-500
                                                                            dark:text-slate-400
                                                                        "
                                                                    >
                                                                        No recent users
                                                                    </div>

                                                                )
                                                        }

                                                    </div>

                                                </div>

                                                <div
                                                    className="
                                                        bg-white
                                                        dark:bg-slate-800
                                                        border
                                                        border-slate-200
                                                        dark:border-slate-700
                                                        rounded-xl
                                                        p-6
                                                    "
                                                >

                                                    <h3
                                                        className="
                                                            text-lg
                                                            font-semibold
                                                            mb-4
                                                            text-slate-900
                                                            dark:text-white
                                                        "
                                                    >
                                                        📂 Recent Workspaces
                                                    </h3>

                                                    <div
                                                        className="
                                                            divide-y
                                                            divide-slate-200
                                                            dark:divide-slate-700
                                                        "
                                                    >

                                                        {
                                                            dashboard.recentWorkspaces?.length > 0
                                                                ? (

                                                                    dashboard.recentWorkspaces.map(
                                                                        (workspace) => (

                                                                            <div
                                                                                key={workspace._id}
                                                                                className="
                                                                                    py-3
                                                                                "
                                                                            >

                                                                                <div
                                                                                    className="
                                                                                        font-semibold
                                                                                        text-slate-900
                                                                                        dark:text-white
                                                                                    "
                                                                                >
                                                                                    {workspace.name}
                                                                                </div>

                                                                                <div
                                                                                    className="
                                                                                        text-sm
                                                                                        text-slate-500
                                                                                        dark:text-slate-400
                                                                                    "
                                                                                >
                                                                                    Owner: {workspace.owner?.name}
                                                                                </div>

                                                                            </div>

                                                                        )
                                                                    )

                                                                ) : (

                                                                    <div
                                                                        className="
                                                                            py-4
                                                                            text-center
                                                                            text-slate-500
                                                                            dark:text-slate-400
                                                                        "
                                                                    >
                                                                        No recent workspaces
                                                                    </div>

                                                                )
                                                        }

                                                    </div>

                                                </div>

                                            </div>

                                            <div
                                                className="
                                                    grid
                                                    grid-cols-1
                                                    xl:grid-cols-2
                                                    gap-6
                                                "
                                            >

                                                <div
                                                    className="
                                                        bg-white
                                                        dark:bg-slate-800
                                                        border
                                                        border-slate-200
                                                        dark:border-slate-700
                                                        rounded-xl
                                                        p-6
                                                    "
                                                >

                                                    <h3
                                                        className="
                                                            text-lg
                                                            font-semibold
                                                            mb-4
                                                            text-slate-900
                                                            dark:text-white
                                                        "
                                                    >
                                                        📝 Recent Notes
                                                    </h3>

                                                    <div
                                                        className="
                                                            divide-y
                                                            divide-slate-200
                                                            dark:divide-slate-700
                                                        "
                                                    >

                                                        {
                                                            dashboard.recentNotes?.length > 0
                                                                ? (

                                                                    dashboard.recentNotes.map(
                                                                        (note) => (

                                                                            <div
                                                                                key={note._id}
                                                                                className="
                                                                                    py-3
                                                                                "
                                                                            >

                                                                                <div
                                                                                    className="
                                                                                        font-semibold
                                                                                        text-slate-900
                                                                                        dark:text-white
                                                                                    "
                                                                                >
                                                                                    {note.title}
                                                                                </div>

                                                                                <div
                                                                                    className="
                                                                                        text-sm
                                                                                        text-slate-500
                                                                                        dark:text-slate-400
                                                                                    "
                                                                                >
                                                                                    By {note.user?.name}
                                                                                </div>

                                                                            </div>

                                                                        )
                                                                    )

                                                                ) : (

                                                                    <div
                                                                        className="
                                                                            py-4
                                                                            text-center
                                                                            text-slate-500
                                                                            dark:text-slate-400
                                                                        "
                                                                    >
                                                                        No recent notes
                                                                    </div>

                                                                )
                                                        }

                                                    </div>

                                                </div>

                                                <div
                                                    className="
                                                        bg-white
                                                        dark:bg-slate-800
                                                        border
                                                        border-slate-200
                                                        dark:border-slate-700
                                                        rounded-xl
                                                        p-6
                                                    "
                                                >

                                                    <h3
                                                        className="
                                                            text-lg
                                                            font-semibold
                                                            mb-4
                                                            text-slate-900
                                                            dark:text-white
                                                        "
                                                    >
                                                        📜 Recent Activities
                                                    </h3>

                                                    <div
                                                        className="
                                                            divide-y
                                                            divide-slate-200
                                                            dark:divide-slate-700
                                                        "
                                                    >

                                                        {
                                                            dashboard.recentActivities?.length > 0
                                                                ? (

                                                                    dashboard.recentActivities.map(
                                                                        (activity) => (

                                                                            <div
                                                                                key={activity._id}
                                                                                className="
                                                                                    py-3
                                                                                "
                                                                            >

                                                                                <div
                                                                                    className="
                                                                                        font-semibold
                                                                                        text-slate-900
                                                                                        dark:text-white
                                                                                    "
                                                                                >
                                                                                    {formatAction(activity.action)}
                                                                                </div>

                                                                                <div
                                                                                    className="
                                                                                        text-sm
                                                                                        text-slate-500
                                                                                        dark:text-slate-400
                                                                                    "
                                                                                >
                                                                                    By {activity.user?.name || "Unknown"}
                                                                                    {" • "}
                                                                                    Workspace: {activity.workspace?.name || "Unknown"}
                                                                                </div>

                                                                            </div>

                                                                        )
                                                                    )

                                                                ) : (

                                                                    <div
                                                                        className="
                                                                            py-4
                                                                            text-center
                                                                            text-slate-500
                                                                            dark:text-slate-400
                                                                        "
                                                                    >
                                                                        No recent activities
                                                                    </div>

                                                                )
                                                        }

                                                    </div>

                                                </div>

                                            </div>

                                        </>

                                    )

                                }

                                {
                                    activeSection === "users" && (

                                        <UsersSection

                                            users={users}

                                            search={usersSearch}
                                            setSearch={setUsersSearch}

                                            page={usersPage}
                                            setPage={setUsersPage}

                                            totalPages={usersTotalPages}

                                            fetchUsers={fetchUsers}
                                            fetchDashboard={fetchDashboard}

                                            processingId={usersProcessingId}
                                            setProcessingId={setUsersProcessingId}

                                            user={user}

                                            setConfirmConfig={setConfirmConfig}
                                            setConfirmOpen={setConfirmOpen}

                                        />

                                    )
                                }

                                {

                                    activeSection === "workspaces" && (

                                        <WorkspacesSection

                                            workspaces={workspaces}

                                            search={workspaceSearch}
                                            setSearch={setWorkspaceSearch}

                                            page={workspacePage}
                                            setPage={setWorkspacePage}

                                            totalPages={workspaceTotalPages}

                                            fetchWorkspaces={fetchWorkspaces}
                                            fetchDashboard={fetchDashboard}

                                            processingId={workspaceProcessingId}
                                            setProcessingId={setWorkspaceProcessingId}

                                            setConfirmConfig={setConfirmConfig}
                                            setConfirmOpen={setConfirmOpen}

                                        />

                                    )
                                }

                                {

                                    activeSection === "notes" && (

                                        <NotesSection

                                            notes={notes}

                                            search={notesSearch}
                                            setSearch={setNotesSearch}

                                            page={notesPage}
                                            setPage={setNotesPage}

                                            totalPages={notesTotalPages}

                                            fetchNotes={fetchNotes}
                                            fetchDashboard={fetchDashboard}

                                            processingId={notesProcessingId}
                                            setProcessingId={setNotesProcessingId}

                                            setConfirmConfig={setConfirmConfig}
                                            setConfirmOpen={setConfirmOpen}

                                        />

                                    )
                                }

                                {

                                    activeSection === "activities" && (

                                        <ActivitiesSection

                                            activities={activities}

                                            search={activitiesSearch}
                                            setSearch={setActivitiesSearch}

                                            page={activitiesPage}
                                            setPage={setActivitiesPage}

                                            totalPages={activitiesTotalPages}

                                        />

                                    )

                                }

                                {
                                    activeSection === "analytics"
                                    && (

                                        <AnalyticsSection

                                            dashboard={
                                                dashboard
                                            }

                                        />

                                    )
                                }

                                {
                                    activeSection === "settings"
                                    && (

                                        <SettingsSection

                                            dashboard={
                                                dashboard
                                            }

                                        />

                                    )
                                }

                            </>

                        )
                    }

                </main>

            </div>

            <ConfirmModal

                open={confirmOpen}

                title={confirmConfig.title}

                message={confirmConfig.message}

                confirmText={confirmConfig.confirmText}

                confirmColor={confirmConfig.confirmColor}

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

export default
    AdminDashboard;