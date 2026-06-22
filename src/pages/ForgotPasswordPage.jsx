//ForgotPasswordPage.jsx
import {
  useState
} from "react";

import {
  forgotPassword
} from "../services/authService";

import {
  useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";

function ForgotPasswordPage() {

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  const submitHandler =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const data =
          await forgotPassword(
            email
          );

        toast.success(
          data.message
        );

      } catch (error) {

        toast.error(
          error.response?.data?.message
          ||
          "Failed to send email"
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
            mb-2
          "
        >
          Forgot Password
        </h1>

        <p
          className="
            text-gray-500
            text-center
            mb-8
          "
        >
          Enter your email
        </p>

        <form
          onSubmit={submitHandler}
          className="space-y-5"
        >

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(
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
              bg-blue-600
              hover:bg-blue-700
              text-white
              py-3
              rounded-lg
            "
          >
            {
              loading
                ? "Sending..."
                : "Send Reset Link"
            }
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            className="
              w-full
              border
              py-3
              rounded-lg
            "
          >
            Back To Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default ForgotPasswordPage;