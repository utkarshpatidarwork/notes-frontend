//EmptyWorkspace.jsx
function EmptyWorkspace() {

  return (

    <div
      className="
        bg-white
        dark:bg-slate-800
        rounded-2xl
        shadow-md
        p-16
        text-center
      "
    >

      <div className="text-6xl mb-6">
        🚀
      </div>

      <h2
        className="
          text-3xl
          font-bold
          mb-4
          dark:text-white
        "
      >
        No Workspace Selected
      </h2>

      <p
        className="
          text-gray-500
          dark:text-gray-400
        "
      >
        Create a workspace or join one using an invite code to start managing notes.
      </p>

    </div>

  );
}

export default EmptyWorkspace;