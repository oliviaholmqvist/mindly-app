// MoodPage: sidan där användaren loggar dagens mående.
// Användaren väljer humör (emoji), flera taggar och skriver en anteckning.
// Loggen sparas i localStorage under "moodEntries".

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EmojiPicker from "../components/EmojiPicker";
import Tags from "../components/Tags";

export default function MoodPage({ displayName }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Om vi redigerar en befintlig logg (från HomePage)
  const editEntry = location.state?.editEntry || null;

  // Förvalda taggar
  const defaultTags = useMemo(
    () => ["stress", "jobb", "skola", "relationer", "ångest"],
    []
  );

  // State för formuläret
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [note, setNote] = useState("");

  // State för taggar
  const [tags, setTags] = useState(defaultTags);
  const [customTag, setCustomTag] = useState("");

  // Fyll i formuläret automatiskt vid redigering
  useEffect(() => {
    if (!editEntry) return;

    setSelectedMood(editEntry.mood || "");
    setNote(editEntry.note || "");
    setSelectedTags(editEntry.tags || []);
  }, [editEntry]);

  // Enkel validering
  const canSave =
    selectedMood && selectedTags.length > 0 && note.trim().length > 0;

  // Slå av/på tagg (flera tillåtna)
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Lägg till egen tagg
  const handleAddTag = () => {
    const cleaned = customTag.trim().toLowerCase();
    if (!cleaned) return;

    if (!tags.includes(cleaned)) {
      setTags((prev) => [...prev, cleaned]);
    }

    // Välj den nya taggen direkt (utan att ta bort andra)
    setSelectedTags((prev) =>
      prev.includes(cleaned) ? prev : [...prev, cleaned]
    );

    setCustomTag("");
  };

  // Spara logg
  const handleSave = () => {
    if (!canSave) return;

    const existing = JSON.parse(localStorage.getItem("moodEntries") || "[]");

    const entry = {
      id: editEntry?.id || crypto.randomUUID(),
      date: new Date().toISOString(),
      mood: selectedMood,
      tags: selectedTags,
      note: note.trim(),
    };

    const updatedEntries = editEntry
      ? existing.map((e) => (e.id === editEntry.id ? entry : e))
      : [entry, ...existing];

    localStorage.setItem("moodEntries", JSON.stringify(updatedEntries));

    navigate("/calendar");
  };

  return (
    <div className="page page-mood">
      <h1>{editEntry ? "Redigera logg" : `Hej ${displayName}!`}</h1>
      <h2>Hur mår du idag?</h2>

      {/* Humör-val */}
      <EmojiPicker selectedMood={selectedMood} onSelect={setSelectedMood} />

      {/* Anteckning */}
      <div className="mood-card">
        <textarea
          id="mood-note"
          name="moodNote"
          className="mood-textarea"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Skriv ned tankar eller känslor..."
          rows={4}
        />
      </div>

      {/* Taggar */}
      <h2>Välj tags</h2>

      <div className="mood-card">
        <div className="tag-row">
          {tags.map((t) => (
            <Tags
              key={t}
              label={t}
              isSelected={selectedTags.includes(t)}
              onClick={() => toggleTag(t)}
            />
          ))}

          {/* Lägg till egen tagg */}
          <div className="tag-add">
            <input
              id="mood-custom-tag"
              name="moodCustomTag"
              className="tag-input"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="+"
            />
            <button
              type="button"
              className="tag-plus"
              onClick={handleAddTag}
              aria-label="Lägg till tagg"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Spara */}
      <div className="mood-save">
        <button
          className="btn btn-primary"
          type="button"
          disabled={!canSave}
          onClick={handleSave}
        >
          Spara
        </button>
      </div>
    </div>
  );
}