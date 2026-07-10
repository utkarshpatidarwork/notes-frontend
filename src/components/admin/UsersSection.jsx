//UsersSection.jsx
import toast
    from "react-hot-toast";

import {

    toggleAdmin,

    toggleStatus,

    deleteUser

} from "../../services/adminService";

function UsersSection({

    users,

    search,
    setSearch,

    page,
    setPage,

    totalPages,

    fetchUsers,
    fetchDashboard,

    processingId,
    setProcessingId,

    user,

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
                    justify-between
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
                    Users
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
                        md:w-64
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

                            <th
                                className="
                                    py-3
                                    text-left
                                    font-semibold
                                "
                            >
                                Name
                            </th>

                            <th
                                className="
                                    py-3
                                    text-left
                                    font-semibold
                                "
                            >
                                Email
                            </th>

                            <th
                                className="
                                    py-3
                                    text-left
                                    font-semibold
                                "
                            >
                                Role
                            </th>

                            <th
                                className="
                                    py-3
                                    text-left
                                    font-semibold
                                "
                            >
                                Status
                            </th>

                            <th
                                className="
                                    px-4
                                    py-3
                                    text-left
                                "
                            >
                                Joined
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

                            users.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="
                                            text-center
                                            py-8
                                            text-gray-500
                                            dark:text-gray-400
                                        "
                                    >

                                        No users found matching your search.

                                    </td>

                                </tr>

                            ) : (

                                users.map(
                                    (u) => (

                                        <tr
                                            key={u._id}
                                            className="
                                                border-b
                                                border-slate-200
                                                dark:border-slate-700
                                            "
                                        >

                                            <td className="py-3">
                                                {u.name}
                                            </td>

                                            <td className="py-3">
                                                {u.email}
                                            </td>

                                            <td className="py-3">
                                                {u.role}
                                            </td>

                                            <td className="py-3">

                                                {
                                                    u.isActive
                                                        ? "Active"
                                                        : "Disabled"
                                                }

                                            </td>

                                            <td
                                                className="
                                                    px-4
                                                    py-3
                                                "
                                            >
                                                {
                                                    new Date(
                                                        u.createdAt
                                                    ).toLocaleDateString()
                                                }
                                            </td>

                                            <td className="space-x-2">

                                                <button

                                                    onClick={async () => {

                                                        setProcessingId(
                                                            u._id
                                                        );

                                                        try {

                                                            const data =
                                                                await toggleAdmin(
                                                                    u._id
                                                                );

                                                            toast.success(
                                                                data.message
                                                            );

                                                            fetchUsers();

                                                        } catch (error) {

                                                            toast.error(
                                                                error.response?.data?.message
                                                                ||
                                                                "Failed to update role"
                                                            );

                                                        } finally {

                                                            setProcessingId(
                                                                null
                                                            );

                                                        }

                                                    }}

                                                    disabled={
                                                        u._id === user._id
                                                        ||
                                                        processingId === u._id
                                                    }

                                                    className="
                                                        bg-blue-600
                                                        hover:bg-blue-700
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
                                                        processingId === u._id
                                                            ? "..."
                                                            : (
                                                                u.role === "admin"
                                                                    ? "Remove Admin"
                                                                    : "Make Admin"
                                                            )
                                                    }

                                                </button>

                                                <button
                                                    disabled={
                                                        u._id === user._id
                                                        ||
                                                        processingId === u._id
                                                    }

                                                    onClick={async () => {

                                                        setProcessingId(
                                                            u._id
                                                        );

                                                        try {

                                                            const data =
                                                                await toggleStatus(
                                                                    u._id
                                                                );

                                                            toast.success(
                                                                data.message
                                                            );

                                                            fetchUsers();

                                                        } catch (error) {

                                                            toast.error(
                                                                error.response?.data?.message
                                                                ||
                                                                "Failed to update status"
                                                            );
                                                        } finally {

                                                            setProcessingId(
                                                                null
                                                            );

                                                        }

                                                    }}

                                                    className="
                                                        bg-yellow-500
                                                        hover:bg-yellow-600
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
                                                        processingId === u._id
                                                            ? "..."
                                                            : (
                                                                u.isActive
                                                                    ? "Disable"
                                                                    : "Enable"
                                                            )
                                                    }

                                                </button>

                                                <button

                                                    onClick={() => {

                                                        setConfirmConfig({

                                                            title:
                                                                "Delete User",

                                                            message:
                                                                "Are you sure you want to permanently delete this user?",

                                                            confirmText:
                                                                "Delete",

                                                            confirmColor:
                                                                "bg-red-600",

                                                            onConfirm: async () => {

                                                                setProcessingId(
                                                                    u._id
                                                                );

                                                                try {

                                                                    const data =
                                                                        await deleteUser(
                                                                            u._id
                                                                        );

                                                                    toast.success(
                                                                        data.message
                                                                    );

                                                                    await Promise.all([

                                                                        fetchUsers(),

                                                                        fetchDashboard()

                                                                    ]);

                                                                } catch (error) {

                                                                    toast.error(
                                                                        error.response?.data?.message
                                                                        ||
                                                                        "Failed to delete user"
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
                                                        u._id === user._id
                                                        ||
                                                        processingId === u._id
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
                                                        processingId === u._id
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
                        page === totalPages
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

export default UsersSection;