// Tags: återanvändbar komponent för en valbar tagg (pill).
// Används i t.ex. MoodPage och Diary för att välja eller visa taggar.

export default function Tags({ label, isSelected, onClick }) {
  return (
    <button
      type="button"
      className={`tag-chip ${isSelected ? "is-selected" : ""}`}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      {label}
    </button>
  );
}