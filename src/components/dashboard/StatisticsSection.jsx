//StatisticsSection.jsx
function StatisticsSection({
  notes,
  members,
  trashNotes
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
        Statistics
      </h2>

      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-4
        "
      >

        <div
          className="
            bg-slate-100
            dark:bg-slate-700
            p-4
            rounded-xl
          "
        >
          <div className="text-sm">
            📝 Total Notes
          </div>

          <div className="text-2xl font-bold">
            {notes.length}
          </div>
        </div>

        <div
          className="
            bg-slate-100
            dark:bg-slate-700
            p-4
            rounded-xl
          "
        >
          <div className="text-sm">
            📌 Pinned Notes
          </div>

          <div className="text-2xl font-bold">
            {
              notes.filter(
                (n) => n.isPinned
              ).length
            }
          </div>
        </div>

        <div
          className="
            bg-slate-100
            dark:bg-slate-700
            p-4
            rounded-xl
          "
        >
          <div className="text-sm">
            👥 Members
          </div>

          <div className="text-2xl font-bold">
            {members.length}
          </div>
        </div>

        <div
          className="
            bg-slate-100
            dark:bg-slate-700
            p-4
            rounded-xl
          "
        >
          <div className="text-sm">
            🗑️ Trash Notes
          </div>

          <div className="text-2xl font-bold">
            {trashNotes.length}
          </div>
        </div>

      </div>

    </div>

  );
}

export default StatisticsSection;