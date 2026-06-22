//NoteCard.jsx
function NoteCard({
  note,
  setSelectedNote,
  togglePin,
  editHandler,
  deleteNote,
  canWrite
}) {

  return (

    <div
      onClick={() =>
        setSelectedNote(note)
      }
      className="
        bg-white
        dark:bg-slate-800
        rounded-2xl
        shadow-md
        overflow-hidden
        cursor-pointer
        hover:-translate-y-1
        hover:shadow-2xl
        duration-300
        transition
      "
    >

      {
        note.attachments?.[0]?.type?.startsWith("image") && (
          <img
            src={note.attachments[0].url}
            alt="note"
            className="
              w-full
              h-48
              object-cover
            "
          />
        )
      }

      <div className="p-5">

        <h3
          className="
            text-xl
            font-bold
            mb-2
            dark:text-white
          "
        >

          <div className="flex items-center gap-2">

            {
              note.isPinned && (
                <span>📌</span>
              )
            }

            <span>
              {note.title}
            </span>

          </div>

        </h3>

        <div
          className="
            inline-block
            bg-blue-100
            text-blue-700
            text-sm
            px-3
            py-1
            rounded-full
            mb-3
          "
        >
          {note.category}
        </div>

        <div
          className="
            text-sm
            text-gray-500
            dark:text-gray-400
            mb-3
          "
        >
          👤 {note.user?.name}
        </div>

        {
          note.attachments?.length > 0 && (

            <div className="mb-4">

              {
                note.attachments.map(
                  (file, index) => (

                    <a
                      key={index}
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        block
                        text-blue-600
                        underline
                        mb-2
                      "
                    >
                      📎 {file.name}
                    </a>

                  )
                )
              }

            </div>
          )
        }

        <p
          className="
            text-gray-600
            dark:text-gray-300
            line-clamp-3
          "
        >
          {
            note.content.length > 120
              ? `${note.content.slice(0, 120)}...`
              : note.content
          }
        </p>

        {
          canWrite && (
        
            <div
              className="
                mt-4
                flex
                gap-3
              "
            >

              <button
                onClick={(e) => {

                  e.stopPropagation();

                  togglePin(note);
                }}
                className="
                  bg-yellow-400
                  hover:bg-yellow-500
                  active:scale-95
                  text-black
                  px-3
                  py-1
                  rounded-full
                  text-sm
                "
              >
                {
                  note.isPinned
                    ? "📌"
                    : "📍"
                }
              </button>

              <button
                onClick={(e) => {

                  e.stopPropagation();

                  editHandler(note);
                }}
                className="
                  bg-blue-500
                  hover:bg-blue-600
                  active:scale-95
                  text-white
                  px-4
                  py-2
                  rounded-lg
                "
              >
                Edit
              </button>

              <button
                onClick={(e) => {

                  e.stopPropagation();

                  deleteNote(note._id);
                }}
                className="
                  bg-red-500
                  hover:bg-red-600
                  active:scale-95
                  text-white
                  px-4
                  py-2
                  rounded-lg
                "
              >
                Delete
              </button>

            </div>

          )

        }

      </div>

    </div>
  );
}

export default NoteCard;