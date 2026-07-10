//ConfirmModal.jsx
import { useState } from "react";

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

  const [loading, setLoading] =
    useState(false);

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
            disabled={loading}
            className="
              px-4
              py-2
              rounded-lg
              border
              dark:text-white
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            {cancelText}
          </button>

          <button
            onClick={async () => {

              if (loading) return;

              try {

                setLoading(true);

                await onConfirm();

              } finally {

                setLoading(false);
              }
            }}
            disabled={loading}
            className={`
              ${confirmColor}
              text-white
              px-4
              py-2
              rounded-lg
              disabled:opacity-60
              disabled:cursor-not-allowed
            `}
          >
            {
              loading
                ? "Processing..."
                : confirmText
            }
          </button>

        </div>

      </div>

    </div>
  );
}

export default ConfirmModal;