//NotesSection.jsx
import toast
    from "react-hot-toast";

import {
    deleteNote
} from "../../services/adminService";

function NotesSection({

    notes,

    search,
    setSearch,

    page,
    setPage,

    totalPages,

    fetchNotes,
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
                    Notes
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
                        w-full
                        md:w-64
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
                            "
                        >

                            <th className="py-3 text-left font-semibold">
                                Title
                            </th>

                            <th className="py-3 text-left font-semibold">
                                Workspace
                            </th>

                            <th className="py-3 text-left font-semibold">
                                User
                            </th>

                            <th className="py-3 text-left font-semibold">
                                Category
                            </th>

                            <th className="py-3 text-left font-semibold">
                                Created
                            </th>

                            <th className="py-3 text-left font-semibold">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            notes.length === 0 ? (

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

                                        No notes found matching your search.

                                    </td>

                                </tr>

                            ) : (

                                notes.map(
                                    (note) => (

                                        <tr
                                            key={note._id}
                                            className="
                                                border-b
                                                border-slate-200
                                                dark:border-slate-700
                                                align-middle
                                            "
                                        >

                                            <td className="py-3">

                                                <span
                                                    className="
                                                        block
                                                        max-w-md
                                                        truncate
                                                    "
                                                    title={note.title}
                                                >

                                                    {note.title}

                                                </span>

                                            </td>

                                            <td className="py-3">
                                                {
                                                    note.workspace?.name
                                                    ??
                                                    "-"
                                                }
                                            </td>

                                            <td className="py-3">
                                                {note.user?.name || "Deleted User"}
                                            </td>

                                            <td className="py-3">
                                                {note.category || "-"}
                                            </td>

                                            <td className="py-3">

                                                {
                                                    new Date(
                                                        note.createdAt
                                                    ).toLocaleDateString()
                                                }

                                            </td>

                                            <td className="py-3">

                                                <button

                                                    onClick={() => {

                                                        setConfirmConfig({

                                                            title:
                                                                "Delete Note",

                                                            message:
                                                                "This action cannot be undone. Permanently delete this note?",

                                                            confirmText:
                                                                "Delete",

                                                            confirmColor:
                                                                "bg-red-600",

                                                            onConfirm: async () => {

                                                                setProcessingId(
                                                                    note._id
                                                                );

                                                                try {

                                                                    const data =
                                                                        await deleteNote(
                                                                            note._id
                                                                        );

                                                                    toast.success(
                                                                        data.message
                                                                    );

                                                                    await Promise.all([

                                                                        fetchNotes(),

                                                                        fetchDashboard()

                                                                    ]);

                                                                } catch (error) {

                                                                    toast.error(
                                                                        error.response?.data?.message
                                                                        ||
                                                                        "Failed to delete note"
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
                                                        processingId
                                                        ===
                                                        note._id
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

                                                        processingId
                                                        ===
                                                        note._id

                                                            ? "..."

                                                            : "Delete Permanently"

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
                        page <= 1
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
    NotesSection;