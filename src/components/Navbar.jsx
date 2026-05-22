function Navbar({
  darkMode,
  setDarkMode,
  logoutHandler
}) {

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
        Notes Dashboard
      </h1>

      <div className="flex gap-3">

        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }
          className="
            bg-slate-700
            hover:bg-slate-600
            px-4
            py-2
            rounded-lg
          "
        >
          {
            darkMode
              ? "☀️ Light"
              : "🌙 Dark"
          }
        </button>

        <button
          onClick={logoutHandler}
          className="
            bg-red-500
            hover:bg-red-600
            px-4
            py-2
            rounded-lg
          "
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Navbar;