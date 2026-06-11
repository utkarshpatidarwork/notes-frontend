import {
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  resetPassword
} from "../services/authService";

import toast from "react-hot-toast";

function ResetPasswordPage() {

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const { token } =
    useParams();

  const navigate =
    useNavigate();

  const submitHandler =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const data =
          await resetPassword(
            token,
            password
          );

        toast.success(
          data.message
        );

        navigate("/");

      } catch (error) {

        toast.error(
          error.response?.data?.message
          ||
          "Reset failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-900
        to-slate-700
        flex
        items-center
        justify-center
        px-4
      "
    >

      <div
        className="
          bg-white
          w-full
          max-w-md
          rounded-2xl
          shadow-2xl
          p-8
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            text-center
            mb-8
          "
        >
          Reset Password
        </h1>

        <form
          onSubmit={submitHandler}
          className="space-y-5"
        >

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
            "
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-green-600
              hover:bg-green-700
              text-white
              py-3
              rounded-lg
            "
          >
            {
              loading
                ? "Updating..."
                : "Update Password"
            }
          </button>

        </form>

      </div>

    </div>
  );
}

export default ResetPasswordPage;