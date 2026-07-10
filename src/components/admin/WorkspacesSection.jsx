//WorkspacesSection.jsx
import toast
    from "react-hot-toast";

import {
    deleteWorkspace
} from "../../services/adminService";

function WorkspacesSection({

    workspaces,

    search,
    setSearch,

    page,
    setPage,

    totalPages,

    fetchWorkspaces,
    fetchDashboard,

    processingId,
    setProcessingId,

    setConfirmConfig,
    setConfirmOpen

}) {

    return (

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

            <div
                className="
                    flex
                    flex-col
                    md:flex-row
                    md:justify-between
                    gap-4
                    mb-5
                "
            >

                <h2
                    className="
                        text-2xl
                        font-bold
                        text-slate-900
                        dark:text-white
                    "
                >
                    Workspaces
                </h2>

                <input

                    value={search}

                    onChange={(e) => {

                        setPage(1);

                        setSearch(
                            e.target.value
                        );

                    }}

                    placeholder="Search..."

                    className="
                        border
                        border-slate-300
                        dark:border-slate-600
                        bg-white
                        dark:bg-slate-700
                        text-slate-900
                        dark:text-white
                        rounded-lg
                        px-3
                        py-2
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        w-full
                        md:max-w-xs
                    "
                />

            </div>

            <div
                className="
                    overflow-x-auto
                    rounded-xl
                "
            >

                <table
                    className="
                        w-full
                        text-slate-900
                        dark:text-white
                    "
                >

                    <thead>

                        <tr
                            className="
                                border-b
                                border-slate-200
                                dark:border-slate-700
                                align-middle
                            "
                        >

                            <th
                                className="
                                    py-3
                                    text-left
                                    font-semibold
                                "
                            >
                                Workspace
                            </th>

                            <th
                                className="
                                    py-3
                                    text-left
                                    font-semibold
                                "
                            >
                                Owner
                            </th>

                            <th
                                className="
                                    py-3
                                    text-left
                                    font-semibold
                                "
                            >
                                Members
                            </th>

                            <th
                                className="
                                    py-3
                                    text-left
                                    font-semibold
                                "
                            >
                                Notes
                            </th>

                            <th
                                className="
                                    py-3
                                    text-left
                                    font-semibold
                                "
                            >
                                Created
                            </th>

                            <th
                                className="
                                    py-3
                                    text-left
                                    font-semibold
                                "
                            >
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            workspaces.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="
                                            text-center
                                            py-8
                                            text-gray-500
                                            dark:text-gray-400
                                        "
                                    >

                                        No workspaces found matching your search.

                                    </td>

                                </tr>

                            ) : (

                                workspaces.map(
                                    (workspace) => (

                                        <tr
                                            key={workspace._id}
                                            className="
                                                border-b
                                                border-slate-200
                                                dark:border-slate-700
                                                align-middle
                                            "
                                        >

                                            <td
                                                className="py-3"
                                            >
                                                {workspace.name}
                                            </td>

                                            <td
                                                className="py-3"
                                            >
                                                {workspace.owner?.name}
                                            </td>

                                            <td
                                                className="py-3"
                                            >
                                                {workspace.memberCount}
                                            </td>

                                            <td
                                                className="py-3"
                                            >
                                                {workspace.noteCount ?? "-"}
                                            </td>

                                            <td className="py-3">

                                                {
                                                    new Date(
                                                        workspace.createdAt
                                                    ).toLocaleDateString()
                                                }

                                            </td>

                                            <td
                                                className="
                                                    py-3
                                                "
                                            >

                                                <button

                                                    onClick={() => {

                                                        setConfirmConfig({

                                                            title:
                                                                "Delete Workspace",

                                                            message:
                                                                "This will permanently delete the workspace and all its notes.",

                                                            confirmText:
                                                                "Delete",

                                                            confirmColor:
                                                                "bg-red-600",

                                                            onConfirm: async () => {

                                                                setProcessingId(
                                                                    workspace._id
                                                                );

                                                                try {

                                                                    const data =
                                                                        await deleteWorkspace(
                                                                            workspace._id
                                                                        );

                                                                    toast.success(
                                                                        data.message
                                                                    );

                                                                    await Promise.all([

                                                                        fetchWorkspaces(),

                                                                        fetchDashboard()

                                                                    ]);

                                                                } catch (error) {

                                                                    toast.error(

                                                                        error.response?.data?.message
                                                                        ||
                                                                        "Failed to delete workspace"

                                                                    );

                                                                } finally {

                                                                    setProcessingId(
                                                                        null
                                                                    );

                                                                }

                                                            }

                                                        });

                                                        setConfirmOpen(true);

                                                    }}

                                                    disabled={
                                                        processingId ===
                                                        workspace._id
                                                    }

                                                    className="
                                                        bg-red-600
                                                        hover:bg-red-700
                                                        transition
                                                        text-white
                                                        px-3
                                                        py-1
                                                        rounded
                                                        disabled:opacity-50
                                                        disabled:cursor-not-allowed
                                                        cursor-pointer
                                                    "
                                                >

                                                    {

                                                        processingId ===
                                                        workspace._id

                                                            ? "..."

                                                            : "Delete"

                                                    }

                                                </button>

                                            </td>

                                        </tr>

                                    )

                                )

                            )

                        }

                    </tbody>

                </table>

            </div>

            <div
                className="
                    flex
                    justify-center
                    gap-3
                    mt-6
                "
            >

                <button

                    disabled={
                        page === 1
                    }

                    onClick={() =>
                        setPage(
                            page - 1
                        )
                    }

                    className="
                        bg-slate-700
                        hover:bg-slate-800
                        dark:bg-slate-600
                        dark:hover:bg-slate-500
                        text-white
                        px-4
                        py-2
                        rounded
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        cursor-pointer
                    "
                >

                    Prev

                </button>

                <span
                    className="
                        text-slate-900
                        dark:text-white
                    "
                >

                    {page}

                    /

                    {totalPages}

                </span>

                <button

                    disabled={
                        page >= totalPages
                        ||
                        totalPages === 0

                    }

                    onClick={() =>
                        setPage(
                            page + 1
                        )
                    }

                    className="
                        bg-slate-700
                        hover:bg-slate-800
                        dark:bg-slate-600
                        dark:hover:bg-slate-500
                        text-white
                        px-4
                        py-2
                        rounded
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        cursor-pointer
                    "
                >

                    Next

                </button>

            </div>

        </div>

    );

}

export default
    WorkspacesSection;