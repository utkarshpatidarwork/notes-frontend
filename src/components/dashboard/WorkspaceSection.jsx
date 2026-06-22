//WorkspaceSection.jsx
function WorkspaceSection({
  workspaceName,
  setWorkspaceName,

  inviteCode,
  setInviteCode,

  creatingWorkspace,
  setCreatingWorkspace,

  joiningWorkspace,
  setJoiningWorkspace,

  workspaces,
  workspaceLoading,

  selectedWorkspace,
  setSelectedWorkspace,

  reqUserId,

  createWorkspace,
  joinWorkspace,

  setWorkspaces,

  toast
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

              setCreatingWorkspace(true);

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

            } finally {

              setCreatingWorkspace(false);
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
          disabled={creatingWorkspace}
        >
          {
            creatingWorkspace
              ? "Creating..."
              : "Create"
          }
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

              setJoiningWorkspace(true);

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

            } finally {

              setJoiningWorkspace(false);
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
          disabled={joiningWorkspace}
        >
          {
            joiningWorkspace
              ? "Joining..."
              : "Join"
          }
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

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              gap-4
            "
          >

            {
              workspaces.map(
                (workspace) => (

                  <div
                    key={workspace._id}
                    onClick={() =>
                      setSelectedWorkspace(
                        workspace
                      )
                    }
                    className={`
                      cursor-pointer
                      rounded-2xl
                      border
                      p-5
                      transition
                      hover:shadow-lg

                      ${
                        selectedWorkspace?._id
                        === workspace._id
                          ? "border-blue-500 bg-blue-50 dark:bg-slate-700"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      }
                    `}
                  >

                    <div
                      className="
                        flex
                        justify-between
                        items-start
                        mb-4
                      "
                    >

                      <div>

                        <h3
                          className="
                            font-bold
                            text-lg
                            dark:text-white
                          "
                        >
                          {workspace.name}
                        </h3>

                        <div
                          className="
                            text-xs
                            text-gray-500
                            mt-1
                          "
                        >
                          {
                            (
                                workspace.owner?._id
                                ||
                                workspace.owner
                            ) === reqUserId
                              ? "👑 Owner"
                              : "👀 Member"
                          }
                        </div>

                      </div>

                      {
                        selectedWorkspace?._id
                        === workspace._id
                        && (

                          <span
                            className="
                              text-xs
                              bg-blue-600
                              text-white
                              px-2
                              py-1
                              rounded-full
                            "
                          >
                            Active
                          </span>

                        )
                      }

                    </div>

                  </div>

                )
              )
            }

          </div>

        )
      }

    </div>

  );
}

export default WorkspaceSection;