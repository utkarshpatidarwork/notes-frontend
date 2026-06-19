//ConfirmModal.jsx
function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "bg-red-600",
  onConfirm,
  onCancel
}) {

  if (!open) return null;

  return (

    <div
      className="
        fixed
        inset-0
        bg-black/50
        flex
        items-center
        justify-center
        z-[100]
        p-4
      "
    >

      <div
        className="
          bg-white
          dark:bg-slate-800
          rounded-2xl
          shadow-xl
          w-full
          max-w-md
          p-6
        "
      >

        <h2
          className="
            text-2xl
            font-bold
            mb-3
            dark:text-white
          "
        >
          {title}
        </h2>

        <p
          className="
            text-gray-600
            dark:text-gray-300
            mb-6
          "
        >
          {message}
        </p>

        <div
          className="
            flex
            justify-end
            gap-3
          "
        >

          <button
            onClick={onCancel}
            className="
              px-4
              py-2
              rounded-lg
              border
              dark:text-white
            "
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`
              ${confirmColor}
              text-white
              px-4
              py-2
              rounded-lg
            `}
          >
            {confirmText}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ConfirmModal;