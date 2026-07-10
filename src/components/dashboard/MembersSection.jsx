//MembersSection.jsx
function MembersSection({
  memberSearch,
  setMemberSearch,

  membersLoading,
  filteredMembers,

  isOwner,
  actionLoading,

  selectedWorkspace,

  fetchMembers,
  fetchActivities,
  fetchWorkspaces,

  changeMemberRole,
  removeMember,
  transferOwnership,

  setActionLoading,
  setConfirmConfig,
  setConfirmOpen,

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
          Members
        </h2>

        <input
            type="text"
            placeholder="Search members..."
            value={memberSearch}
            onChange={(e) =>
            setMemberSearch(
                e.target.value
            )
            }
            className="
            w-full
            border
            rounded-lg
            px-3
            py-2
            mb-4
            dark:bg-slate-700
            dark:text-white
            "
        />

        {
            membersLoading ? (

            <div
                className="
                dark:text-white
                "
            >
                Loading Members...
            </div>

            ) : (

            <div className="space-y-4">

                {
                filteredMembers.map(
                    (member) => {

                    const memberIsOwner =
                        member.role === "owner";

                    return (

                        <div
                        key={member._id}
                        className="
                            flex
                            flex-col
                            md:flex-row
                            md:items-center
                            md:justify-between
                            gap-3
                            border-b
                            pb-3
                        "
                        >

                        <div
                            className="
                            flex
                            justify-between
                            items-center
                            flex-1
                            "
                        >

                            <div>

                            <div
                                className="
                                font-semibold
                                dark:text-white
                                "
                            >
                                {member.user.name}
                            </div>

                            <div
                                className="
                                text-sm
                                text-gray-500
                                "
                            >
                                {member.user.email}
                            </div>

                            </div>

                            <div
                            className={`
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-semibold
                                capitalize

                                ${
                                member.role === "owner"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : member.role === "editor"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-white"
                                }
                            `}
                            >
                            {
                                member.role === "owner"
                                ? "👑 Owner"
                                : member.role === "editor"
                                ? "✏️ Editor"
                                : "👀 Viewer"
                            }

                            </div>

                        </div>

                        {
                            isOwner
                            && !memberIsOwner
                            && (

                            <div
                                className="
                                flex
                                gap-2
                                items-center
                                "
                            >

                                <select
                                disabled={
                                    memberIsOwner
                                    ||
                                    actionLoading ===
                                    `role-${member.user._id}`
                                }
                                value={member.role}
                                onChange={async (e) => {

                                    try {

                                    setActionLoading(
                                        `role-${member.user._id}`
                                    );

                                    const data =
                                        await changeMemberRole(
                                        selectedWorkspace._id,
                                        member.user._id,
                                        e.target.value
                                        );

                                    toast.success(
                                        data.message
                                    );

                                    await fetchMembers();

                                    } catch (error) {

                                    toast.error(
                                        error.response?.data?.message
                                        ||
                                        "Role update failed"
                                    );

                                    } finally {

                                    setActionLoading(
                                        null
                                    );
                                    }
                                }}
                                className="
                                    border
                                    border-slate-300
                                    dark:border-slate-600
                                    bg-white
                                    dark:bg-slate-700
                                    dark:text-white
                                    rounded-lg
                                    px-3
                                    py-2
                                    shadow-sm
                                    focus:ring-2
                                    focus:ring-blue-500
                                    focus:outline-none
                                    cursor-pointer
                                "
                                >

                                <option value="viewer">
                                    Viewer
                                </option>

                                <option value="editor">
                                    Editor
                                </option>

                                </select>

                                {
                                actionLoading ===
                                    `role-${member.user._id}`
                                && (

                                    <span
                                    className="
                                        text-xs
                                        text-blue-600
                                        ml-2
                                    "
                                    >
                                    Updating...
                                    </span>

                                )
                                }

                                {
                                isOwner
                                && !memberIsOwner
                                && (

                                    <button
                                    onClick={() => {

                                        setConfirmConfig({

                                        title:
                                            "Transfer Ownership",

                                        message:
                                            `Transfer ownership to ${member.user.name}? You will no longer be the owner.`,

                                        confirmText:
                                            "Transfer",

                                        confirmColor:
                                            "bg-yellow-600",

                                        onConfirm: async () => {

                                            try {

                                            setActionLoading(
                                                `transfer-${member.user._id}`
                                            );

                                            const data =
                                                await transferOwnership(
                                                selectedWorkspace._id,
                                                member.user._id
                                                );

                                            toast.success(
                                                data.message
                                            );

                                            await fetchMembers();

                                            await fetchWorkspaces();

                                            } catch (error) {

                                            toast.error(
                                                error.response?.data?.message
                                                ||
                                                "Transfer failed"
                                            );

                                            } finally {

                                            setActionLoading(null);
                                            }
                                        }
                                        });

                                        setConfirmOpen(true);
                                    }}
                                    disabled={
                                        actionLoading ===
                                        `transfer-${member.user._id}`
                                    }
                                    className="
                                        bg-yellow-500
                                        text-white
                                        px-4
                                        py-2
                                        rounded-lg
                                        cursor-pointer
                                        hover:bg-yellow-600
                                    "
                                    >
                                    {
                                        actionLoading ===
                                        `transfer-${member.user._id}`
                                            ? "Transferring..."
                                            : "Make Owner"
                                    }
                                    </button>

                                )
                                }

                                <button
                                disabled={
                                    memberIsOwner
                                    ||
                                    actionLoading ===
                                    `remove-${member.user._id}`
                                }
                                onClick={() => {

                                    setConfirmConfig({

                                    title:
                                        "Remove Member",

                                    message:
                                        `Remove ${member.user.name} from this workspace?`,

                                    confirmText:
                                        "Remove",

                                    confirmColor:
                                        "bg-red-600",

                                    onConfirm: async () => {

                                        try {

                                        setActionLoading(
                                            `remove-${member.user._id}`
                                        );

                                        await removeMember(
                                            selectedWorkspace._id,
                                            member.user._id
                                        );

                                        await fetchMembers();

                                        await fetchActivities();

                                        toast.success(
                                            "Member Removed"
                                        );

                                        } catch (error) {

                                        toast.error(
                                            error.response?.data?.message
                                            ||
                                            "Remove failed"
                                        );

                                        } finally {

                                        setActionLoading(null);
                                        }
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
                                    hover:bg-red-600
                                "
                                >
                                {
                                    actionLoading ===
                                    `remove-${member.user._id}`
                                        ? "Removing..."
                                        : "Remove"
                                }
                                </button>

                            </div>

                            )
                        }

                        </div>

                    );

                    }
                )
                }

            </div>

            )
        }

        </div>

  );
}

export default MembersSection;