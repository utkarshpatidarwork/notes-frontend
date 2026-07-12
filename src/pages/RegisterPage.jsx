//RegisterPage.jsx
import {
  useState
} from "react";

import {
  registerUser
} from "../services/authService";

import toast from "react-hot-toast";

import {
  useNavigate
} from "react-router-dom";

function RegisterPage() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  const registerHandler =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const data =
          await registerUser(
              name,
              email,
              password
          );

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data)
        );

        toast.success(
          "Registration Successful"
        );

        navigate("/dashboard");

      } catch (error) {

        toast.error(
          error.response?.data?.message
          ||
          "Registration Failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-100
        dark:bg-slate-900
      "
    >

      <form
        onSubmit={registerHandler}
        className="
          bg-white
          dark:bg-slate-800
          p-8
          rounded-2xl
          shadow-lg
          w-full
          max-w-md
          flex
          flex-col
          gap-4
        "
      >

        <h1
          className="
            text-4xl
            font-bold
            text-center
            dark:text-white
          "
        >
          WorkNest
        </h1>

        <p
          className="
            text-center
            text-gray-500
            dark:text-gray-400
            mb-2
          "
        >
          Create your account
        </p>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="
            border
            rounded-lg
            px-4
            py-3
            dark:bg-slate-700
            dark:text-white
          "
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="
            border
            rounded-lg
            px-4
            py-3
            dark:bg-slate-700
            dark:text-white
          "
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="
            border
            rounded-lg
            px-4
            py-3
            dark:bg-slate-700
            dark:text-white
          "
        />

        <button
          type="submit"
          disabled={loading}
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            py-3
            rounded-lg
            font-semibold
            disabled:opacity-60
            disabled:cursor-not-allowed
            cursor-pointer
          "
        >
          {
            loading
              ? "Registering..."
              : "Register"
          }
        </button>

        <p
          className="
            text-center
            dark:text-white
          "
        >

          Already have an account?

          <span
            onClick={() =>
              navigate("/")
            }
            className="
              text-blue-600
              cursor-pointer
              ml-2
            "
          >
            Login
          </span>

        </p>

      </form>

    </div>
  );
}

export default RegisterPage;