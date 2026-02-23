// Sida där användaren kan skriva, söka, tagga, redigera och radera dagboksinlägg
// Modal används för formulär (nytt inlägg / redigera)

import { useMemo, useState } from "react";
import Modal from "../components/Modal";

// Förvalda taggar som kan väljas i modalen
const DEFAULT_TAGS = ["stress", "jobb", "relationer", "hälsa", "sömn"];

export default function DiaryPage({
  entries = [],
  addDiaryEntry,
  deleteDiaryEntry,
  editDiaryEntry,
}) {
  // Söktext
  const [query, setQuery] = useState("");

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  // Formulär-state
  const [draftTitle, setDraftTitle] = useState("");
  const [draftText, setDraftText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState("");

  // Filtrera inlägg baserat på söktext
  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;

    return entries.filter((e) => {
      const hay = `${e.title} ${e.text} ${(e.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [entries, query]);

  // Återställ formuläret
  const resetDraft = () => {
    setDraftTitle("");
    setDraftText("");
    setSelectedTags([]);
    setCustomTag("");
    setEditingEntry(null);
  };

  const openNewModal = () => {
    resetDraft();
    setIsOpen(true);
  };

  const openEditModal = (entry) => {
    setDraftTitle(entry.title);
    setDraftText(entry.text);
    setSelectedTags(entry.tags || []);
    setEditingEntry(entry);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetDraft();
  };

  // Toggle tag (flera tillåtna)
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Lägg till egen tagg
  const addCustomTag = () => {
    const t = customTag.trim().toLowerCase();
    if (!t || selectedTags.includes(t)) return;
    setSelectedTags((prev) => [...prev, t]);
    setCustomTag("");
  };

  // Spara inlägg
  const saveEntry = () => {
    const title = draftTitle.trim();
    const text = draftText.trim();
    if (!title || !text) return;

    if (editingEntry) {
      editDiaryEntry({
        ...editingEntry,
        title,
        text,
        tags: selectedTags,
      });
    } else {
      addDiaryEntry({
        title,
        text,
        tags: selectedTags,
      });
    }

    closeModal();
  };

  return (
    <div className="page page-diary">
      <h1>Dagbok</h1>
<p className="page-intro">
Reflektera, skriv och skapa medvetenhet om dina vanor. 
</p>

      {/* Nytt inlägg */}
      <div className="diary-actions">
        <button className="btn btn-primary" type="button" onClick={openNewModal}>
          + Skriv nytt
        </button>
      </div>

      {/* Sök */}
      <div className="diary-search">
        <input
          id="diary-search"
          name="diarySearch"
          type="search"
          className="diary-search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sök bland inlägg..."
        />
      </div>

      {/* Meta */}
      <div className="diary-meta">
        <p className="diary-count">Dina inlägg ({entries.length})</p>
      </div>

      {/* Lista */}
      <div className="diary-list">
        {filteredEntries.length === 0 ? (
          <p className="text-secondary" style={{ textAlign: "center" }}>
            Inga inlägg matchade din sökning.
          </p>
        ) : (
          filteredEntries.map((e) => (
            <article key={e.id} className="diary-card">
              <div className="diary-card-top diary-card-top-split">
                {/* Redigera */}
                <button
                  className="icon-btn"
                  type="button"
                  aria-label="Redigera inlägg"
                  onClick={() => openEditModal(e)}
                >
                  <i className="bi bi-pencil" aria-hidden="true"></i>
                </button>

                {/* Titel + datum */}
                <div className="diary-card-center">
                  <h3 className="diary-card-title">{e.title}</h3>
                  <span className="diary-date">{e.date}</span>
                </div>

                {/* Radera */}
                <button
                  className="icon-btn icon-btn-danger"
                  type="button"
                  aria-label="Radera inlägg"
                  onClick={() => {
                    const ok = window.confirm("Vill du radera inlägget?");
                    if (ok) deleteDiaryEntry(e.id);
                  }}
                >
                  <i className="bi bi-trash" aria-hidden="true"></i>
                </button>
              </div>

              <p className="diary-text">{e.text}</p>

              <div className="diary-tags">
                {(e.tags || []).map((tag) => (
                  <span key={tag} className="tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="diary-modal">
          <h2 className="diary-modal-title">
            {editingEntry ? "Redigera inlägg" : "Nytt inlägg"}
          </h2>

          {/* Titel */}
          <input
            id="diary-title"
            name="diaryTitle"
            className="auth-input"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            placeholder="Ge inlägget en rubrik..."
          />

          {/* Text */}
          <textarea
            id="diary-text"
            name="diaryText"
            className="diary-textarea"
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            rows={6}
            placeholder="Skriv ned dina tankar, känslor eller reflektioner..."
          />

          {/* Taggar */}
          <p className="diary-small-title">Tagga inlägget</p>

          <div className="tag-grid">
            {DEFAULT_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`tag-chip ${
                  selectedTags.includes(tag) ? "is-active" : ""
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Egen tagg */}
          <div className="tag-add-row">
            <input
              id="diary-custom-tag"
              name="diaryCustomTag"
              className="auth-input"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="Lägg till egen tagg..."
            />
            <button
              type="button"
              className="tag-add-btn"
              onClick={addCustomTag}
            >
              +
            </button>
          </div>

          {/* Valda taggar */}
          {selectedTags.length > 0 && (
            <div className="diary-tags" style={{ marginTop: 10 }}>
              {selectedTags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Spara */}
          <button
            className="btn btn-primary"
            style={{ marginTop: 14, width: "100%" }}
            type="button"
            onClick={saveEntry}
            disabled={!draftTitle.trim() || !draftText.trim()}
          >
            {editingEntry ? "Spara ändringar" : "Spara"}
          </button>
        </div>
      </Modal>
    </div>
  );
}