//WorkspaceSettings.jsx
function WorkspaceSettings({
  roleResolved,
  isOwner,

  editingWorkspace,
  setEditingWorkspace,

  selectedWorkspace,

  renameWorkspaceName,
  setRenameWorkspaceName,

  workspaceDescription,
  setWorkspaceDescription,

  actionLoading,
  setActionLoading,

  renameWorkspace,
  deleteWorkspace,
  leaveWorkspace,

  fetchWorkspaces,

  setSelectedWorkspace,

  setConfirmConfig,
  setConfirmOpen,

  toast
}) {

  if (!roleResolved) {
    return null;
  }

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

      <div
        className="
          flex
          justify-between
          items-center
          mb-4
        "
      >

        <h2
          className="
            text-2xl
            font-bold
            dark:text-white
          "
        >
          Workspace Settings
        </h2>

        {
          isOwner && (

            <button
              onClick={() =>
                setEditingWorkspace(
                  !editingWorkspace
                )
              }
              className="
                w-9
                h-9
                rounded-full
                bg-slate-100
                dark:bg-slate-700
                flex
                items-center
                justify-center
                hover:scale-105
                transition
                cursor-pointer
              "
            >
              ⚙️
            </button>

          )
        }

      </div>

      <div className="space-y-4">

        <div className="space-y-2 text-sm">

          <div className="dark:text-white">
            <span className="font-semibold">
              Owner:
            </span>{" "}
            {selectedWorkspace.owner?.name || "Unknown"}
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              dark:text-white
            "
          >

            <span>
              <span className="font-semibold">
                Invite Code:
              </span>{" "}
              {selectedWorkspace.inviteCode}
            </span>

            <button
              onClick={async () => {

                try {

                await navigator.clipboard.writeText(
                  selectedWorkspace.inviteCode
                );

                toast.success(
                  "Invite code copied"
                );

                } catch {

                  toast.error("Failed to copy");
                }
              }}
              className="text-sm cursor-pointer hover:scale-105"
            >
              📋
            </button>

          </div>

          <div className="dark:text-white">
            <span className="font-semibold">
              Created:
            </span>{" "}
            {
              new Date(
                selectedWorkspace.createdAt
              ).toLocaleDateString()
            }
          </div>

        </div>

        {
          isOwner
          &&
          editingWorkspace
          && (

            <div
              className="
                border-t
                pt-4
                mt-4
                space-y-3
              "
            >

              <input
                type="text"
                value={renameWorkspaceName}
                onChange={(e) =>
                  setRenameWorkspaceName(
                    e.target.value
                  )
                }
                placeholder="Workspace Name"
                className="
                  w-full
                  border
                  rounded-lg
                  px-3
                  py-2
                  dark:bg-slate-700
                  dark:text-white
                "
              />

              <textarea
                value={workspaceDescription}
                onChange={(e) =>
                  setWorkspaceDescription(
                    e.target.value
                  )
                }
                rows={4}
                placeholder="Workspace Description"
                className="
                  w-full
                  border
                  rounded-lg
                  px-3
                  py-2
                  dark:bg-slate-700
                  dark:text-white
                "
              />

              <div className="flex gap-2">

                <button
                  onClick={async () => {

                    try {

                      setActionLoading(
                        "rename"
                      );

                      const data =
                        await renameWorkspace(
                          selectedWorkspace._id,
                          renameWorkspaceName,
                          workspaceDescription
                        );

                      toast.success(
                        data.message
                      );

                      setEditingWorkspace(
                        false
                      );

                      await fetchWorkspaces();

                    } catch (error) {

                      toast.error(
                        error.response?.data?.message
                        ||
                        "Save failed"
                      );

                    } finally {

                      setActionLoading(
                        null
                      );
                    }
                  }}
                  disabled={
                    actionLoading === "rename"
                  }
                  className="
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    px-4
                    py-2
                    rounded-lg
                  "
                >
                  {
                    actionLoading === "rename"
                      ? "Saving..."
                      : "Save Changes"
                  }
                </button>

                <button
                  type="button"
                  onClick={() => {

                    setRenameWorkspaceName(
                      selectedWorkspace.name
                    );

                    setWorkspaceDescription(
                      selectedWorkspace.description
                      || ""
                    );

                    setEditingWorkspace(
                      false
                    );
                  }}
                  className="
                    border
                    px-4
                    py-2
                    rounded-lg
                    dark:text-white
                  "
                >
                  Cancel
                </button>

              </div>

            </div>

          )
        }

        <div className="border-t pt-4 mt-4">

          {
            isOwner ? (

              <button
                onClick={() => {

                  setConfirmConfig({

                    title:
                      "Delete Workspace",

                    message:
                      "This will permanently delete the workspace and all notes.",

                    confirmText:
                      "Delete",

                    confirmColor:
                      "bg-red-700",

                    onConfirm: async () => {

                      const data =
                        await deleteWorkspace(
                          selectedWorkspace._id
                        );

                      toast.success(
                        data.message
                      );

                      localStorage.removeItem(
                        "selectedWorkspace"
                      );

                      setSelectedWorkspace(
                        null
                      );

                      await fetchWorkspaces();
                    }
                  });

                  setConfirmOpen(true);
                }}
                className="
                  bg-red-600
                  text-white
                  px-4
                  py-2
                  rounded-lg
                  cursor-pointer
                  hover:bg-red-700
                "
              >
                Delete Workspace
              </button>

            ) : (

              <button
                onClick={() => {

                  setConfirmConfig({

                    title:
                      "Leave Workspace",

                    message:
                      "Are you sure you want to leave this workspace?",

                    confirmText:
                      "Leave",

                    confirmColor:
                      "bg-red-500",

                    onConfirm: async () => {

                      const data =
                        await leaveWorkspace(
                          selectedWorkspace._id
                        );

                      toast.success(
                        data.message
                      );

                      localStorage.removeItem(
                        "selectedWorkspace"
                      );

                      setSelectedWorkspace(
                        null
                      );

                      await fetchWorkspaces();
                    }
                  });

                  setConfirmOpen(true);
                }}
                className="
                  bg-red-500
                  text-white
                  px-4
                  py-2
                  rounded-lg
                  cursor-pointer
                "
              >
                Leave Workspace
              </button>

            )
          }

        </div>

      </div>

    </div>

  );
}

export default WorkspaceSettings;