//ActivitiesSection.jsx
function ActivitiesSection({

    activities,

    search,
    setSearch,

    page,
    setPage,

    totalPages

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
                    Activities
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
                                Action
                            </th>

                            <th className="py-3 text-left font-semibold">
                                Workspace
                            </th>

                            <th className="py-3 text-left font-semibold">
                                User
                            </th>

                            <th className="py-3 text-left font-semibold">
                                Target
                            </th>

                            <th className="py-3 text-left font-semibold">
                                Created
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            activities.length === 0 ? (

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

                                        No activities found matching your search.

                                    </td>

                                </tr>

                            ) : (

                                activities.map(
                                    (activity) => (

                                        <tr
                                            key={activity._id}
                                            className="
                                                border-b
                                                border-slate-200
                                                dark:border-slate-700
                                                align-middle
                                            "
                                        >

                                            <td className="py-3">

                                                {
                                                    activity.action

                                                        .replaceAll(
                                                            "_",
                                                            " "
                                                        )

                                                        .toLowerCase()

                                                        .replace(
                                                            /\b\w/g,
                                                            (char) =>
                                                                char.toUpperCase()
                                                        )
                                                }

                                            </td>

                                            <td className="py-3">
                                                {
                                                    activity.workspace?.name
                                                    ??
                                                    "-"
                                                }
                                            </td>

                                            <td className="py-3">
                                                {
                                                    activity.user?.name
                                                    ??
                                                    "-"
                                                }
                                            </td>

                                            <td className="py-3">

                                                <span
                                                    className="
                                                        block
                                                        max-w-md
                                                        truncate
                                                    "
                                                    title={activity.target}
                                                >

                                                    {
                                                        activity.target
                                                        ||
                                                        "-"
                                                    }

                                                </span>

                                            </td>

                                            <td className="py-3">

                                                {
                                                    new Date(
                                                        activity.createdAt
                                                    ).toLocaleDateString()
                                                }

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
    ActivitiesSection;