//LoginPage.jsx
import { useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import {
  useNavigate
} from "react-router-dom";

function LoginPage() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const { data } = await axios.post(
        "https://notes-api-m5rs.onrender.com/api/users/login",
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        data.token
      );

      toast.success("Login Successful");

      navigate("/dashboard");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Login Failed"
      );
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
            text-4xl
            font-bold
            text-center
            mb-2
          "
        >
          Notes App
        </h1>

        <p
          className="
            text-gray-500
            text-center
            mb-8
          "
        >
          Login to continue
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="
              w-full
              border
              border-gray-300
              rounded-lg
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="
              w-full
              border
              border-gray-300
              rounded-lg
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

          <button
            type="submit"
            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-semibold
              py-3
              rounded-lg
              transition
            "
          >
            Login
          </button>

          <p className="text-center">

            Don't have an account?

            <span
              onClick={() =>
                navigate("/register")
              }
              className="
                text-blue-600
                cursor-pointer
                ml-2
              "
            >
              Register
            </span>

          </p>

        </form>

      </div>

    </div>
  );
}

export default LoginPage;