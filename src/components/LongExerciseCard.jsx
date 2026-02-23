// Avlångt klickbart kort (t.ex. “Rekommenderat för dig”)
export default function LongExerciseCard({ title, subtitle, minutes, onClick }) {
  return (
    <button
      type="button"
      className="long-card"
      onClick={onClick}
      aria-label={`Starta ${title}, ${minutes} minuter`}
    >
      {/* Tid uppe i hörnet */}
      <span className="long-card-time">
        <i className="bi bi-clock" aria-hidden="true" /> {minutes} min
      </span>

      <div className="long-card-left">
        <p className="long-card-title">{title}</p>
        <p className="long-card-sub">{subtitle}</p>
      </div>

      <span className="long-card-play" aria-hidden="true">
        ▶
      </span>
    </button>
  );
}