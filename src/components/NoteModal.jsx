import ReactMarkdown from "react-markdown";

function NoteModal({
  selectedNote,
  setSelectedNote
}) {

  if (!selectedNote) return null;

  return (

    <div
      className="
        fixed
        inset-0
        bg-black/50
        flex
        items-center
        justify-center
        z-50
        p-4
      "
      onClick={() =>
        setSelectedNote(null)
      }
    >

      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="
          bg-white
          dark:bg-slate-900
          rounded-3xl
          overflow-hidden
          max-w-2xl
          w-full
          max-h-[90vh]
          overflow-y-auto
        "
      >

        {
          selectedNote.attachments && (
            <img
              src={selectedNote.attachments}
              alt="note"
              className="
                w-full
                max-h-[80vh]
                object-contain
                bg-black
              "
            />
          )
        }

        <div className="p-6">

          <div
            className="
              flex
              justify-between
              items-start
              mb-4
            "
          >

            <div>

              <h2
                className="
                  text-3xl
                  font-bold
                  dark:text-white
                "
              >

                <div className="flex items-center gap-2">

                  {
                    selectedNote.isPinned && (
                      <span>📌</span>
                    )
                  }

                  <span>
                    {selectedNote.title}
                  </span>

                </div>

              </h2>

              <div
                className="
                  mt-3
                  inline-block
                  bg-blue-100
                  text-blue-700
                  px-3
                  py-1
                  rounded-full
                  text-sm
                "
              >
                {selectedNote.category}
              </div>

            </div>

            <button
              onClick={() =>
                setSelectedNote(null)
              }
              className="
                text-2xl
                dark:text-white
              "
            >
              ✕
            </button>

          </div>

          {
            selectedNote.attachments?.length > 0 && (

              <div className="mb-6">

                {
                  selectedNote.attachments.map(
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

          <div
            className="
              text-gray-700
              dark:text-gray-300
              prose
              dark:prose-invert
              max-w-none
            "
          >
            <ReactMarkdown>
              {selectedNote.content}
            </ReactMarkdown>
          </div>

        </div>

      </div>

    </div>
  );
}

export default NoteModal;