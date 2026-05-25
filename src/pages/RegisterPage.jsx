import {
  useState
} from "react";

import axios from "axios";

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

  const navigate =
    useNavigate();

  const API =
    import.meta.env.VITE_API_URL;

  const registerHandler =
    async (e) => {

      e.preventDefault();

      try {

        const { data } =
          await axios.post(
            `${API}/api/users/register`,
            {
              name,
              email,
              password
            }
          );

        localStorage.setItem(
          "token",
          data.token
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
            text-3xl
            font-bold
            text-center
            dark:text-white
          "
        >
          Register
        </h1>

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
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            py-3
            rounded-lg
            font-semibold
          "
        >
          Register
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