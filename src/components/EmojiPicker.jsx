// EmojiPicker sidan
import { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";

const CUSTOM_EMOJI_KEY = "customMoodEmoji_v1";

export default function EmojiPicker({ selectedMood, onSelect }) {
  const baseMoods = useMemo(
    () => [
      { emoji: "😍", label: "Jättebra" },
      { emoji: "😊", label: "Bra" },
      { emoji: "😐", label: "Okej" },
      { emoji: "😴", label: "Trött" },
      { emoji: "😣", label: "Jobbig" },
    ],
    []
  );

  const [customEmoji, setCustomEmoji] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  // 1) Läs in sparad custom-emoji när komponenten laddas
  useEffect(() => {
    const saved = localStorage.getItem(CUSTOM_EMOJI_KEY);
    if (saved) setCustomEmoji(saved);
  }, []);

  // 2) Listqan: 5 fasta + 1 custom
  const moods = useMemo(() => {
    return [
      ...baseMoods,
      {
        emoji: customEmoji || "➕",
        label: customEmoji ? "Egen emoji" : "Välj egen emoji",
        isCustom: true,
      },
    ];
  }, [baseMoods, customEmoji]);

  const openCustom = () => {
    setInput(customEmoji); 
    setIsOpen(true);
  };

  const saveCustom = () => {
    // Tar första "tecknet" (emoji)
    const first = Array.from((input || "").trim())[0];

    if (!first) {
      setIsOpen(false);
      return;
    }

    setCustomEmoji(first);
    localStorage.setItem(CUSTOM_EMOJI_KEY, first);

    onSelect(first);
    setIsOpen(false);
  };

  return (
    <>
      <div className="emoji-row" role="group" aria-label="Välj humör">
        {moods.map((m) => {
          const isSelected = selectedMood === m.emoji;

          return (
            <button
              key={`${m.label}-${m.emoji}`}
              type="button"
              onClick={() => (m.isCustom ? openCustom() : onSelect(m.emoji))}
              className={`emoji-btn ${isSelected ? "is-selected" : ""}`}
              aria-pressed={isSelected}
              aria-label={m.label}
            >
              <span className="emoji-icon" aria-hidden="true">
                {m.emoji}
              </span>
              <span className="sr-only">{m.label}</span>
            </button>
          );
        })}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h3 style={{ marginBottom: 10 }}>Välj egen emoji</h3>

        <label className="text-secondary" style={{ display: "block", marginBottom: 8 }}>
          Skriv eller klistra in en emoji:
        </label>

        <input
          className="custom-emoji-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="t.ex. 🤍"
          inputMode="text"
        />

        <div className="custom-emoji-actions">
          <button className="btn btn-secondary" type="button" onClick={() => setIsOpen(false)}>
            Avbryt
          </button>
          <button className="btn btn-primary" type="button" onClick={saveCustom}>
            Spara & välj
          </button>
        </div>
      </Modal>
    </>
  );
}

