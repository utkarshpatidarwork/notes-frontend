//ActivitySection.jsx
import { formatDistanceToNow } from "date-fns";

function ActivitySection({
  activityFilter,
  setActivityFilter,
  filteredActivities,
  getActivityIcon,
  formatActivity
}) {

  return (

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

      <div
        className="
          flex
          gap-2
          flex-wrap
          mb-4
        "
      >

        {
          [
            "ALL",
            "NOTES",
            "MEMBERS",
            "WORKSPACE"
          ].map(
            (filter) => (

              <button
                key={filter}
                onClick={() =>
                  setActivityFilter(
                    filter
                  )
                }
                className={`
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  transition
                  cursor-pointer

                  ${
                    activityFilter ===
                    filter
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                  }
                `}
              >
                {filter}
              </button>

            )
          )
        }

      </div>

      <div
        className="
          space-y-3
          max-h-96
          overflow-y-auto
          pr-2
        "
      >

        {
          filteredActivities.length === 0
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

            filteredActivities.map(
              (activity) => (

                <div
                  key={activity._id}
                  className="
                    border-b
                    pb-2
                  "
                >

                  <div
                    className="
                      space-y-1
                    "
                  >

                    <div
                      className="
                        dark:text-white
                      "
                    >

                      <span className="mr-2">
                        {
                          getActivityIcon(
                            activity.action
                          )
                        }
                      </span>

                      <strong>
                        {activity.user?.name}
                      </strong>

                      {" "}

                      {
                        formatActivity(
                          activity
                        )
                      }

                    </div>

                    <div
                      className="
                        text-xs
                        text-gray-500
                      "
                    >

                      {
                        formatDistanceToNow(
                          new Date(
                            activity.createdAt
                          ),
                          {
                            addSuffix: true
                          }
                        )
                      }

                    </div>

                  </div>

                </div>

              )
            )

          )
        }

      </div>

    </div>

  );
}

export default ActivitySection;