//SettingsPage.jsx
import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    updateProfile,
    changePassword,
    deleteAccount
} from "../services/authService";

import ConfirmModal
  from "../components/ConfirmModal";

import toast from "react-hot-toast";

function SettingsPage() {

const currentUser =
    JSON.parse(
        localStorage.getItem(
        "user"
    )
);

const navigate =
    useNavigate();

const [profileName, setProfileName] =
    useState(
        currentUser?.name || ""
);

const [profileEmail, setProfileEmail] =
    useState(
        currentUser?.email || ""
    );

const [
    currentPassword,
    setCurrentPassword
] = useState("");

const [
    newPassword,
    setNewPassword
] = useState("");

const [
  deleteText,
  setDeleteText
] = useState("");

const [
  confirmOpen,
  setConfirmOpen
] = useState(false);

const [
  confirmConfig,
  setConfirmConfig
] = useState({});

const updateProfileHandler =
async () => {

  try {

    const data =
      await updateProfile(
        profileName,
        profileEmail
      );

    const updatedUser = {
      ...currentUser,
      name: data.name,
      email: data.email
    };

    localStorage.setItem(
      "user",
      JSON.stringify(
        updatedUser
      )
    );

    toast.success(
      "Profile updated"
    );

  } catch (error) {

    toast.error(
      error.response?.data?.message
      ||
      "Profile update failed"
    );
  }
};

const changePasswordHandler =
async () => {

  try {

    const data =
      await changePassword(
        currentPassword,
        newPassword
      );

    setCurrentPassword("");
    setNewPassword("");

    toast.success(
      data.message
    );

  } catch (error) {

    toast.error(
      error.response?.data?.message
      ||
      "Password change failed"
    );
  }
};

const deleteAccountHandler =
  async () => {

    if (
      deleteText !== "DELETE"
    ) {

      return toast.error(
        'Type "DELETE" to continue'
      );
    }

    try {

      const data =
        await deleteAccount();

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "selectedWorkspace"
      );

      toast.success(
        data.message
      );

      navigate("/");

    } catch (error) {

      toast.error(
        error.response?.data?.message
        ||
        "Delete account failed"
      );
    }
  };

  return (

    <div
      className="
        min-h-screen
        bg-slate-100
        dark:bg-slate-900
        p-6
      "
    >

      <div
        className="
          max-w-4xl
          mx-auto
        "
      >

        <div
          className="
            flex
            items-center
            gap-4
            mb-8
          "
        >

          <button
            onClick={() =>
              navigate(-1)
            }
            className="
              bg-slate-700
              hover:bg-slate-600
              text-white
              px-4
              py-2
              rounded-lg
              cursor-pointer
              transition
            "
          >
            ← Back
          </button>

          <div>

            <h1
              className="
                text-4xl
                font-bold
                dark:text-white
              "
            >
              Settings
            </h1>

            <p
              className="
                text-gray-500
                dark:text-gray-400
                mt-2
              "
            >
              Manage your account and security
            </p>

          </div>

        </div>

        <div
          className="
            bg-white
            dark:bg-slate-800
            rounded-2xl
            shadow-md
            p-6
            mb-6
          "
        >

          <h2
            className="
              text-2xl
              font-semibold
              mb-6
              dark:text-white
            "
          >
            👤 Profile
          </h2>

          <div className="space-y-4">

            <div>

              <label
                className="
                  block
                  font-medium
                  mb-2
                  dark:text-white
                "
              >
                Name
              </label>

              <input
                type="text"
                value={profileName}
                onChange={(e) =>
                  setProfileName(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  rounded-lg
                  px-4
                  py-3
                  dark:bg-slate-700
                  dark:text-white
                "
              />

            </div>

            <div>

              <label
                className="
                  block
                  font-medium
                  mb-2
                  dark:text-white
                "
              >
                Email
              </label>

              <input
                type="email"
                value={profileEmail}
                onChange={(e) =>
                  setProfileEmail(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  rounded-lg
                  px-4
                  py-3
                  dark:bg-slate-700
                  dark:text-white
                "
              />

            </div>

            <button
              onClick={
                updateProfileHandler
              }
              className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-6
                py-3
                rounded-lg
                font-semibold
                cursor-pointer
                transition
              "
            >
              Update Profile
            </button>

          </div>

        </div>

        <div
          className="
            bg-white
            dark:bg-slate-800
            rounded-2xl
            shadow-md
            p-6
            mb-6
          "
        >

          <h2
            className="
              text-2xl
              font-semibold
              mb-6
              dark:text-white
            "
          >
            🔒 Security
          </h2>

          <div className="space-y-4">

            <div>

              <label
                className="
                  block
                  font-medium
                  mb-2
                  dark:text-white
                "
              >
                Current Password
              </label>

              <input
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  rounded-lg
                  px-4
                  py-3
                  dark:bg-slate-700
                  dark:text-white
                "
              />

            </div>

            <div>

              <label
                className="
                  block
                  font-medium
                  mb-2
                  dark:text-white
                "
              >
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  rounded-lg
                  px-4
                  py-3
                  dark:bg-slate-700
                  dark:text-white
                "
              />

            </div>

            <button
              onClick={
                changePasswordHandler
              }
              className="
                bg-green-600
                hover:bg-green-700
                text-white
                px-6
                py-3
                rounded-lg
                font-semibold
                cursor-pointer
                transition
              "
            >
              Change Password
            </button>

          </div>

        </div>

        <div
          className="
            bg-white
            dark:bg-slate-800
            rounded-2xl
            shadow-md
            p-6
            border
            border-red-300
            dark:border-red-800
          "
        >

          <h2
            className="
              text-2xl
              font-semibold
              mb-3
              text-red-600
            "
          >
            ⚠️ Danger Zone
          </h2>

          <p
            className="
              text-gray-500
              dark:text-gray-400
            "
          >
            Permanently delete your account.
          </p>

          <p
            className="
              text-sm
              text-red-600
              dark:text-red-400
              mt-2
              mb-4
            "
          >
            This will permanently delete all workspaces you own. Notes you've created in shared workspaces will remain available to other collaborators.
          </p>

          <div className="space-y-4">

            <input
                type="text"
                placeholder='Type "DELETE"'
                value={deleteText}
                onChange={(e) =>
                setDeleteText(
                    e.target.value
                )
                }
                className="
                w-full
                border
                rounded-lg
                px-4
                py-3
                dark:bg-slate-700
                dark:text-white
                "
            />

            <button
              onClick={() => {

                setConfirmConfig({

                  title:
                    "Delete Account",

                  message:
                    "This action cannot be undone. Permanently delete your account?",

                  confirmText:
                    "Delete",

                  confirmColor:
                    "bg-red-600",

                  onConfirm:
                    deleteAccountHandler

                });

                setConfirmOpen(true);

              }}
                className="
                  bg-red-600
                  hover:bg-red-700
                  text-white
                  px-5
                  py-3
                  rounded-lg
                  font-semibold
                  cursor-pointer
                  transition
                "
            >
                Delete Account
            </button>

            </div>

        </div>

      </div>
      
      <ConfirmModal
        open={confirmOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
        confirmColor={confirmConfig.confirmColor}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
      
    </div>

  );
  
}

export default SettingsPage;
