// Återanvändbart kort som representerar en mindfulness-övning och kan klickas för att starta den
export default function ExerciseCard({ minutes, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      className="exercise-card"              // stil för hela kortet
      onClick={onClick}                      // klick hanteras av föräldern
      aria-label={`${title}, ${minutes} minuter`}
    >
      {/* Visar längden på övningen */}
      <div className="exercise-pill">
        <span className="exercise-pill-icon" aria-hidden="true">
          <i className="bi bi-clock" />
        </span>
        <span className="exercise-pill-text">{minutes} min</span>
      </div>

      {/* Titel och beskrivning */}
      <h3 className="exercise-title">{title}</h3>
      <p className="exercise-subtitle">{subtitle}</p>
    </button>
  );
}