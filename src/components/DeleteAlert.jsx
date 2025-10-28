import { useState } from "react";
import { LoaderCircle } from "lucide-react"; // ✅ FIXED

const DeleteAlert = ({ content, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="text-sm">{content}</p>
      <div className="flex justify-end mt-6">
        <button
          onClick={handleDelete}
          disabled={loading}
          type="button"
          className="add-btn add-btn-fill flex items-center gap-2"
        >
          {loading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" /> {/* ✅ animate-spin (correct Tailwind class) */}
              Deleting...
            </>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
