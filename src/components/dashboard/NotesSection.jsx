//NotesSection.jsx
import NoteCard from "../NoteCard";

function NotesSection({
  notesLoading,

  filteredNotes,

  pinnedNotes,
  normalNotes,

  setSelectedNote,

  togglePin,
  editHandler,
  deleteNote,

  canWrite
}) {

  return (

    <>
      {
        notesLoading ? (

          <div
            className="
              text-center
              py-20
              dark:text-white
            "
          >
            Loading Notes...
          </div>

        ) : filteredNotes.length === 0 ? (

          <div
            className="
              bg-white
              dark:bg-slate-800
              rounded-3xl
              shadow-lg
              border
              border-slate-200
              dark:border-slate-700
              p-16
              text-center
              animate-fadeIn
            "
          >

            <div className="text-6xl mb-6">
              📝
            </div>

            <h2
              className="
                text-4xl
                font-bold
                mb-4
                dark:text-white
              "
            >
              No Notes Yet
            </h2>

            <p
              className="
                text-gray-500
                dark:text-gray-400
                text-lg
              "
            >
              Create your first note and
              start organizing your ideas 🚀
            </p>

          </div>

        ) : (

          <>
            {
              pinnedNotes.length > 0 && (

                <>
                  <h2
                    className="
                      text-xl
                      font-bold
                      mb-4
                      dark:text-white
                    "
                  >
                    📌 Pinned Notes
                  </h2>

                  <div
                    className="
                      grid
                      grid-cols-1
                      md:grid-cols-2
                      lg:grid-cols-3
                      gap-6
                      mb-8
                    "
                  >

                    {
                      pinnedNotes.map(
                        (note) => (

                          <NoteCard
                            key={note._id}
                            note={note}
                            setSelectedNote={setSelectedNote}
                            togglePin={togglePin}
                            editHandler={editHandler}
                            deleteNote={deleteNote}
                            canWrite={canWrite}
                          />

                        )
                      )
                    }

                  </div>

                </>

              )
            }

            <h2
              className="
                text-xl
                font-bold
                mb-4
                dark:text-white
              "
            >
              Notes
            </h2>

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                gap-6
              "
            >

              {
                normalNotes.map(
                  (note) => (

                    <NoteCard
                      key={note._id}
                      note={note}
                      setSelectedNote={setSelectedNote}
                      togglePin={togglePin}
                      editHandler={editHandler}
                      deleteNote={deleteNote}
                      canWrite={canWrite}
                    />

                  )
                )
              }

            </div>

          </>

        )
      }

    </>

  );
}

export default NotesSection;