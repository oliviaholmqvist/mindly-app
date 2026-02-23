// Komponent som visar en enkel veckosammanfattning av användarens mående i emojis
export default function WeekMoodSummary() {
  return (
    <section className="home-week-card">
      <div className="home-week-row" aria-label="Veckans mående">
        {/* Emojis representerar humör under veckan (placeholder-data) */}
        <span className="home-week-emoji">😊</span>
        <span className="home-week-emoji">😐</span>
        <span className="home-week-emoji">😊</span>

        {/* Tomma cirklar visar dagar utan registrerat humör */}
        <span className="home-week-dot" />
        <span className="home-week-dot" />
        <span className="home-week-dot" />
        <span className="home-week-dot" />
      </div>

      <div className="home-week-actions">
        <button className="btn btn-secondary" type="button">
          Detaljer
        </button>
      </div>
    </section>
  );
}