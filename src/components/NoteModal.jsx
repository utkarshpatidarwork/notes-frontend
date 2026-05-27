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
          selectedNote.attachments?.[0]?.type?.startsWith("image") && (
            <img
              src={selectedNote.attachments[0].url}
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

                      <div
                        key={index}
                        className="
                          mb-6
                          border
                          rounded-xl
                          p-4
                          dark:border-slate-700
                        "
                      >

                        {
                          file.type.startsWith(
                            "image"
                          ) && (

                            <img
                              src={file.url}
                              alt={file.name}
                              className="
                                w-full
                                rounded-xl
                                mb-4
                              "
                            />

                          )
                        }

                        {
                          file.type.includes(
                            "pdf"
                          ) && (

                            <iframe
                              src={`https://docs.google.com/gview?url=${encodeURIComponent(file.url)}&embedded=true`}
                              title={file.name}
                              className="
                                w-full
                                h-[500px]
                                rounded-xl
                                mb-4
                              "
                            />

                          )
                        }

                        {
                          file.type.includes(
                            "word"
                          ) && (

                            <iframe
                              src={`https://docs.google.com/gview?url=${encodeURIComponent(file.url)}&embedded=true`}
                              title={file.name}
                              className="
                                w-full
                                h-[500px]
                                rounded-xl
                                mb-4
                              "
                            />

                          )
                        }

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-4
                          "
                        >

                          <button
                            onClick={() =>
                              window.open(
                                file.url,
                                "_blank"
                              )
                            }
                            className="
                              text-blue-600
                              underline
                              break-all
                              text-left
                            "
                          >
                            📎 {file.name}
                          </button>

                          <a
                            href={file.url}
                            download
                            className="
                              bg-blue-600
                              hover:bg-blue-700
                              text-white
                              px-4
                              py-2
                              rounded-lg
                              text-sm
                            "
                          >
                            Download
                          </a>

                        </div>

                      </div>

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