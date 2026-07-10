//AnalyticsSection.jsx
function AnalyticsSection({

    dashboard

}) {

    const analytics =
        dashboard?.analytics;

    const stats =
        dashboard?.stats;

    return (

        <div
            className="
                space-y-6
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
                Analytics
            </h2>

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
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
                        👤 User Analytics
                    </h3>

                    <div>

                        <div
                            className="
                                flex
                                justify-between
                                items-center
                                py-3
                                border-b
                                border-slate-200
                                dark:border-slate-700
                            "
                        >

                            <span
                                className="
                                    text-slate-700
                                    dark:text-slate-300
                                "
                            >
                                👑 Admins
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-violet-600
                                    dark:text-violet-400
                                "
                            >
                                {analytics.adminUsers}
                            </span>

                        </div>

                       <div
                            className="
                                flex
                                justify-between
                                items-center
                                py-3
                                border-b
                                border-slate-200
                                dark:border-slate-700
                            "
                        >

                            <span
                                className="
                                    text-slate-700
                                    dark:text-slate-300
                                "
                            >
                                🟢 Active Users
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-green-600
                                    dark:text-green-400
                                "
                            >
                                {analytics.activeUsers}
                            </span>

                        </div>

                        <div
                            className="
                                flex
                                justify-between
                                items-center
                                py-3
                            "
                        >

                            <span
                                className="
                                    text-slate-700
                                    dark:text-slate-300
                                "
                            >
                                🔴 Disabled Users
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-red-600
                                    dark:text-red-400
                                "
                            >
                                {analytics.disabledUsers}
                            </span>

                        </div>

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
                        📝 Note Analytics
                    </h3>

                    <div>

                        <div
                            className="
                                flex
                                justify-between
                                items-center
                                py-3
                                border-b
                                border-slate-200
                                dark:border-slate-700
                            "
                        >

                            <span
                                className="
                                    text-slate-700
                                    dark:text-slate-300
                                "
                            >
                                📌 Pinned Notes
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-blue-600
                                    dark:text-blue-400
                                "
                            >
                                {analytics.pinnedNotes}
                            </span>

                        </div>

                        <div
                            className="
                                flex
                                justify-between
                                items-center
                                py-3
                                border-b
                                border-slate-200
                                dark:border-slate-700
                            "
                        >

                            <span
                                className="
                                    text-slate-700
                                    dark:text-slate-300
                                "
                            >
                                🗄️ Archived Notes
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-amber-600
                                    dark:text-amber-400
                                "
                            >
                                {analytics.archivedNotes}
                            </span>

                        </div>

                        <div
                            className="
                                flex
                                justify-between
                                items-center
                                py-3
                            "
                        >

                            <span
                                className="
                                    text-slate-700
                                    dark:text-slate-300
                                "
                            >
                                📝 Total Notes
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-slate-700
                                    dark:text-white
                                "
                            >
                                {stats.notes}
                            </span>

                        </div>

                    </div>

                </div>

            </div>

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
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
                        📜 Activity Analytics
                    </h3>

                    <div>

                        <div
                            className="
                                flex
                                justify-between
                                items-center
                                py-3
                                border-b
                                border-slate-200
                                dark:border-slate-700
                            "
                        >

                            <span
                                className="
                                    text-slate-700
                                    dark:text-slate-300
                                "
                            >
                                🟣 Today
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-purple-600
                                    dark:text-purple-400
                                "
                            >
                                {analytics.todayActivities}
                            </span>

                        </div>

                        <div
                            className="
                                flex
                                justify-between
                                items-center
                                py-3
                                border-b
                                border-slate-200
                                dark:border-slate-700
                            "
                        >

                            <span
                                className="
                                    text-slate-700
                                    dark:text-slate-300
                                "
                            >
                                📅 Last 7 Days
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-indigo-600
                                    dark:text-indigo-400
                                "
                            >
                                {analytics.weekActivities}
                            </span>

                        </div>

                        <div
                            className="
                                flex
                                justify-between
                                items-center
                                py-3
                            "
                        >

                            <span
                                className="
                                    text-slate-700
                                    dark:text-slate-300
                                "
                            >
                                🗓️ Last 30 Days
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-cyan-600
                                    dark:text-cyan-400
                                "
                            >
                                {analytics.monthActivities}
                            </span>

                        </div>

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
                        📊 System Overview
                    </h3>

                    <div>

                        <div
                            className="
                                flex
                                justify-between
                                items-center
                                py-3
                                border-b
                                border-slate-200
                                dark:border-slate-700
                            "
                        >

                            <span
                                className="
                                    text-slate-700
                                    dark:text-slate-300
                                "
                            >
                                👥 Users
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-slate-700
                                    dark:text-white
                                "
                            >
                                {stats.users}
                            </span>

                        </div>

                        <div
                            className="
                                flex
                                justify-between
                                items-center
                                py-3
                                border-b
                                border-slate-200
                                dark:border-slate-700
                            "
                        >

                            <span
                                className="
                                    text-slate-700
                                    dark:text-slate-300
                                "
                            >
                                📂 Workspaces
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-slate-700
                                    dark:text-white
                                "
                            >
                                {stats.workspaces}
                            </span>

                        </div>

                        <div
                            className="
                                flex
                                justify-between
                                items-center
                                py-3
                                border-b
                                border-slate-200
                                dark:border-slate-700
                            "
                        >

                            <span
                                className="
                                    text-slate-700
                                    dark:text-slate-300
                                "
                            >
                                📝 Notes
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-slate-700
                                    dark:text-white
                                "
                            >
                                {stats.notes}
                            </span>

                        </div>

                        <div
                            className="
                                flex
                                justify-between
                                items-center
                                py-3
                            "
                        >

                            <span
                                className="
                                    text-slate-700
                                    dark:text-slate-300
                                "
                            >
                                📜 Activities
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-slate-700
                                    dark:text-white
                                "
                            >
                                {stats.activities}
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default
    AnalyticsSection;