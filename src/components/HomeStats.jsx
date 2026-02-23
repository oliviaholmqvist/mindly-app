// Komponent som visar användarens statistik på startsidan (streak + antal genomförda övningar)
export default function HomeStats({ streakDays, exercisesDone }) {
  // return: UI för två stat-kort som visar siffror och etiketter
  return (
    <section className="home-stats">
      {/* Första stat-kortet: antal dagar i streak */}
      <div className="home-stat-card">
        {/* Ikon (endast visuellt) */}
        <div className="home-stat-icon" aria-hidden="true">
          💜
        </div>

        {/* Själva siffran */}
        <div className="home-stat-number">{streakDays}</div>

        {/* Text som förklarar vad siffran betyder */}
        <div className="home-stat-label">Dagar streak</div>
      </div>

      {/* Andra stat-kortet: antal övningar som är klara */}
      <div className="home-stat-card">
        {/* Ikon (endast visuellt) */}
        <div className="home-stat-icon" aria-hidden="true">
          💜
        </div>
        <div className="home-stat-number">{exercisesDone}</div>
        <div className="home-stat-label">Övningar klarade</div>
      </div>
    </section>
  );
}