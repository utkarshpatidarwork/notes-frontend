//Navbar.jsx
import { useNavigate } from "react-router-dom";

function Navbar({
  user,
  darkMode,
  setDarkMode,
  logoutHandler
}) {

  const navigate =
    useNavigate();

  return (

    <div
      className="
        bg-slate-900
        text-white
        px-8
        py-4
        flex
        justify-between
        items-center
        gap-4
      "
    >

      <h1
        className="
          text-2xl
          font-bold
        "
      >
        WorkNest
      </h1>

      <div className="flex gap-3">

        <span
          className="
            flex
            items-center
            text-base
            font-medium
          "
        >
          Welcome, {user?.name}
        </span>

        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }
          aria-label={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          title={
            darkMode
              ? "Light mode"
              : "Dark mode"
          }
          className="
            w-10
            h-10
            rounded-full
            bg-slate-700
            hover:bg-slate-600
            flex
            items-center
            justify-center
            transition
            cursor-pointer
          "
        >
          {
            darkMode
              ? "☀️"
              : "🌙"
          }
        </button>

        <button
          onClick={() =>
            navigate("/settings")
          }
          aria-label="Settings"
          title="Settings"
          className="
            w-10
            h-10
            rounded-full
            bg-slate-700
            hover:bg-slate-600
            flex
            items-center
            justify-center
            transition
            cursor-pointer
          "
        >
          ⚙️
        </button>

        <button
          onClick={logoutHandler}
          className="
            bg-red-500
            hover:bg-red-600
            px-4
            py-2
            rounded-lg
            cursor-pointer
          "
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Navbar;