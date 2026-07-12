//SystemSection.jsx
function SystemSection({

    dashboard

}) {

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
                System
            </h2>

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-6
                "
            >

                {/* Application */}

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
                        📱 Application
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
                                Application
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-slate-700
                                    dark:text-white
                                "
                            >
                                WorkNest
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
                                Version
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-slate-700
                                    dark:text-white
                                "
                            >
                                v1.0.0
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
                                Theme
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-slate-700
                                    dark:text-white
                                "
                            >
                                Auto
                            </span>

                        </div>

                    </div>

                </div>

                {/* Database */}

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
                        🗄️ Database
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
                                Users
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
                                Workspaces
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
                                Notes
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
                                Activities
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
                        🖥️ System
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
                                Environment
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-green-600
                                    dark:text-green-400
                                "
                            >
                                Production
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
                                Admin Panel
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-blue-600
                                    dark:text-blue-400
                                "
                            >
                                Enabled
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
                                Status
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-green-600
                                    dark:text-green-400
                                "
                            >
                                Online
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
                        🚀 Future Features
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
                                Maintenance Mode
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-amber-600
                                    dark:text-amber-400
                                "
                            >
                                Coming Soon
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
                                Backup & Restore
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-amber-600
                                    dark:text-amber-400
                                "
                            >
                                Coming Soon
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
                                Activity Cleanup
                            </span>

                            <span
                                className="
                                    font-bold
                                    text-amber-600
                                    dark:text-amber-400
                                "
                            >
                                Coming Soon
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default
    SystemSection;