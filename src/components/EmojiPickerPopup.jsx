import { useState } from "react";
import { Image } from "lucide-react";
import EmojiPicker from "emoji-picker-react"; // ✅ import picker

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emojiData) => {
    // `emojiData` contains info about the selected emoji
    onSelect(emojiData.emoji); 
    setIsOpen(false); // close after selecting
  };

  return (
    <div className="flex flex-col md:flex-row items-start gap-5 mb-6 relative">
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-4 cursor-pointer"
      >
        <div className="w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 text-purple-500 rounded-full">
          {icon ? (
            <span className="text-3xl">{icon}</span>
          ) : (
            <Image className="w-8 h-8" />
          )}
        </div>

        <p className="text-sm text-gray-600">
          {icon ? "Change icon" : "Pick Icon"}
        </p>
      </div>

      {/* Emoji Picker Popup */}
      {isOpen && (
        <div className="absolute top-16 left-0 p-2 bg-white border rounded-lg shadow-md z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
          <button
            onClick={() => setIsOpen(false)}
            className="mt-2 px-3 py-1 bg-purple-500 text-white rounded w-full"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPopup;
