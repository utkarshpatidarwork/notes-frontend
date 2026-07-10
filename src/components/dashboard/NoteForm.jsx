//NoteForm.jsx
function NoteForm({
  title,
  setTitle,

  content,
  setContent,

  category,
  setCategory,

  attachments,
  setAttachments,

  uploading,
  uploadCount,

  creating,
  editingId,

  uploadFile,

  createNote,
  updateNote,

  clearNoteForm
}) {
  return (
    <div
        className="
            bg-white
            dark:bg-slate-800
            p-6
            rounded-2xl
            shadow-md
            mb-10
        "
        >

        <h2
            className="
            text-2xl
            font-semibold
            mb-4
            dark:text-white
            "
        >
            {
            editingId
                ? "Update Note"
                : "Create Note"
            }
        </h2>

        <form
            onSubmit={
            editingId
                ? updateNote
                : createNote
            }
            className="
            flex
            flex-col
            gap-4
            "
        >

            <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) =>
                setTitle(e.target.value)
            }
            className="
                border
                rounded-lg
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
                dark:bg-slate-700
                dark:text-white
                dark:border-slate-600
            "
            />

            <textarea
            placeholder="Content"
            value={content}
            onChange={(e) =>
                setContent(e.target.value)
            }
            rows={10}
            className="
                border
                rounded-lg
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
                dark:bg-slate-700
                dark:text-white
                dark:border-slate-600
                resize-y
                min-h-[250px]
            "
            />

            <select
            value={category}
            onChange={(e) =>
                setCategory(e.target.value)
            }
            className="
                border
                rounded-lg
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
                dark:bg-slate-700
                dark:text-white
                dark:border-slate-600
                cursor-pointer
            "
            >

            <option value="General">
                General
            </option>

            <option value="Work">
                Work
            </option>

            <option value="Personal">
                Personal
            </option>

            <option value="Study">
                Study
            </option>

            <option value="Ideas">
                Ideas
            </option>

            <option value="Projects">
                Projects
            </option>

            </select>

            <label
            className="
                flex
                flex-col
                items-center
                justify-center
                border-2
                border-dashed
                border-slate-300
                dark:border-slate-600
                rounded-2xl
                p-10
                cursor-pointer
                hover:border-blue-500
                hover:bg-blue-50
                dark:hover:bg-slate-700
                transition
                duration-300
                text-gray-600
                dark:text-gray-300
                font-medium
                animate-fadeIn
            "
            >

            <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {

                Array.from(
                    e.target.files
                ).forEach((file) => {

                    uploadFile(file);
                });
                }}
            />

            <div className="text-5xl mb-3">
                📁
            </div>

            <div className="text-lg font-semibold">
                {
                uploading
                    ? `Uploading ${uploadCount} file(s)...`
                    : "Choose Files"
                }
            </div>

            <div
                className="
                text-sm
                text-gray-500
                mt-2
                text-center
                "
            >
                Drag & drop files or click
                to browse
            </div>

            </label>

            {
            attachments.length > 0 && (

                <div
                className="
                    mt-4
                    flex
                    flex-wrap
                    gap-3
                "
                >

                {
                    attachments.map(
                    (file, index) => (

                        <div
                        key={index}
                        className="
                            bg-slate-100
                            dark:bg-slate-700
                            px-4
                            py-2
                            rounded-xl
                            text-sm
                            dark:text-white
                            shadow-sm
                            flex
                            items-center
                            gap-2
                        "
                        >

                        <span>
                            📎 {file.name}
                        </span>

                        <button
                            type="button"
                            onClick={() => {

                            setAttachments(
                                attachments.filter(
                                (_, i) =>
                                    i !== index
                                )
                            );
                            }}
                            className="
                            text-red-500
                            font-bold
                            hover:text-red-700
                            ml-1
                            "
                        >
                            ✕
                        </button>

                        </div>

                    )
                    )
                }

                </div>

            )
            }

            <div
            className="
                flex
                gap-3
            "
            >

            <button
                type="submit"
                disabled={
                creating
                ||
                uploading
                }
                className="
                flex-1
                bg-blue-600
                hover:bg-blue-700
                active:scale-95
                focus:ring-2
                focus:ring-blue-500
                focus:outline-none
                text-white
                py-3
                rounded-lg
                font-semibold
                disabled:opacity-50
                cursor-pointer
                "
            >
                {
                uploading
                    ? "Uploading Files..."
                    : creating
                    ? (
                        editingId
                            ? "Updating..."
                            : "Creating..."
                        )
                    : (
                        editingId
                            ? "Update Note"
                            : "Create Note"
                        )
                }
            </button>

            <button
                type="button"
                onClick={clearNoteForm}
                className="
                px-6
                py-3
                rounded-lg
                border
                border-slate-300
                dark:border-slate-600
                dark:text-white
                cursor-pointer
                bg-slate-100
                hover:bg-slate-200
                dark:bg-slate-700
                dark:hover:bg-slate-600
                "
            >
                Clear
            </button>

            </div>

        </form>

        </div>
  );
}

export default NoteForm;