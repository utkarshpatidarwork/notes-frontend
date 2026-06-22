//TrashSection.jsx
function TrashSection({
  trashNotes,
  fetchTrashNotes,
  fetchNotes,
  restoreNote,
  permanentlyDeleteNote,
  toast,
  setConfirmConfig,
  setConfirmOpen
}) {

  return (

    <div
      className="
        bg-white
        dark:bg-slate-800
        rounded-2xl
        shadow-md
        p-6
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
        Trash
      </h2>

      {
        trashNotes.length === 0 ? (

          <div
            className="
              text-gray-500
              dark:text-gray-400
            "
          >
            Trash is empty
          </div>

        ) : (

          trashNotes.map(
            (note) => (

              <div
                key={note._id}
                className="
                  border-b
                  py-4
                  flex
                  justify-between
                  items-center
                "
              >

                <div
                  className="
                    dark:text-white
                  "
                >
                  {note.title}
                </div>

                <div className="flex gap-2">

                  <button
                    onClick={async () => {

                      const data =
                        await restoreNote(
                          note._id
                        );

                      fetchTrashNotes();
                      fetchNotes();

                      toast.success(
                        data.message
                      );
                    }}
                    className="
                      bg-green-600
                      text-white
                      px-3
                      py-1
                      rounded
                    "
                  >
                    Restore
                  </button>

                  <button
                    onClick={() => {

                      setConfirmConfig({

                        title:
                          "Delete Forever",

                        message:
                          `Permanently delete "${note.title}"? This cannot be undone.`,

                        confirmText:
                          "Delete Forever",

                        confirmColor:
                          "bg-red-700",

                        onConfirm: async () => {

                          try {

                            const data =
                              await permanentlyDeleteNote(
                                note._id
                              );

                            fetchTrashNotes();

                            toast.success(
                              data.message
                            );

                          } catch (error) {

                            toast.error(
                              error.response?.data?.message
                              ||
                              "Delete failed"
                            );
                          }
                        }
                      });

                      setConfirmOpen(true);
                    }}
                    className="
                      bg-red-600
                      text-white
                      px-3
                      py-1
                      rounded
                    "
                  >
                    Delete Forever
                  </button>

                </div>

              </div>

            )
          )

        )
      }

    </div>

  );
}

export default TrashSection;