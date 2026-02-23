// Startsida som visar en snabb översikt (statistik, dagens citat, rekommendationer)
// samt navigation till övningar

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DailyQuote from "../components/DailyQuote";
import WeekMoodSummary from "../components/WeekMoodSummary";
import HomeStats from "../components/HomeStats";
import exercises from "../exercises.json";

export default function HomePage({ displayName, onLogout }) {
  const navigate = useNavigate();

  // Tillfällig “fake data” (kan kopplas till localStorage senare)
  const latestMood = "Glad 😊";
  const streakDays = 3;
  const exercisesDone = 15;

  // Hjälpfunktion: datum till "YYYY-MM-DD" i lokal tid
  const toLocalDateKey = (dateInput) => {
    const d = new Date(dateInput);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Hämta alla humör-loggar
  const allMoodEntries = useMemo(() => {
    return JSON.parse(localStorage.getItem("moodEntries") || "[]");
  }, []);

  // Hitta dagens logg
  const todaysEntry = useMemo(() => {
    const todayKey = toLocalDateKey(new Date());
    return (
      allMoodEntries.find((e) => toLocalDateKey(e.date) === todayKey) || null
    );
  }, [allMoodEntries]);

  // Senaste logg (används för rekommendation)
  const latestMoodEntry = useMemo(() => {
    return allMoodEntries.length ? allMoodEntries[0] : null;
  }, [allMoodEntries]);

  // Enkel regel: senaste tagg -> rekommenderad övning
  const recommendedTitle = useMemo(() => {
    const tag = (latestMoodEntry?.tag || "").toLowerCase();

    if (tag.includes("stress") || tag.includes("ångest")) return "Släpp stress";
    if (tag.includes("sömn") || tag.includes("trött")) return "Kvällsro";
    if (tag.includes("jobb") || tag.includes("skola")) return "Andas lugnt";

    return "I skogen"; // fallback
  }, [latestMoodEntry]);

  // Plocka fram övningsobjektet från exercises.json
  const recommendedExercise = useMemo(() => {
    return (
      exercises.find((e) => e.title === recommendedTitle) ||
      exercises?.[0] ||
      null
    );
  }, [recommendedTitle]);

  return (
    <div className="page page-home">
      {/* Sidtitel */}
      <h1>Hem</h1>

      {/* Brödtext (p är redan 18px i din CSS) */}
      <p style={{ textAlign: "center" }}>Senast loggad: {latestMood}</p>

      {/* Dagens logg */}
      <h2 className="home-section-title">Dagens logg</h2>

      {todaysEntry ? (
        <section className="home-week-card">
          <div className="home-week-row" aria-label="Dagens mående">
            <span className="home-week-emoji" aria-hidden="true">
              {todaysEntry.mood}
            </span>

            <p style={{ margin: 0, fontWeight: 700 }}>{todaysEntry.tag}</p>
          </div>

          {todaysEntry.note ? <p style={{ marginTop: 10 }}>{todaysEntry.note}</p> : null}

          <div className="home-week-actions">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => navigate("/mood", { state: { editEntry: todaysEntry } })}
            >
              Redigera dagens logg
            </button>
          </div>
        </section>
      ) : (
        <section className="home-week-card">
          <p style={{ margin: 0 }}>Du har inte loggat ditt mående idag.</p>

          <div className="home-week-actions">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => navigate("/mood")}
            >
              Logga idag
            </button>
          </div>
        </section>
      )}

      {/* Statistik */}
      <HomeStats streakDays={streakDays} exercisesDone={exercisesDone} />

      {/* Dagens citat */}
      <DailyQuote />

      {/* Rekommenderat för dig */}
      <h2 className="home-section-title">Rekommenderat för dig</h2>

      {recommendedExercise ? (
        <section className="home-popular">
          <button
            className="home-popular-card home-popular-click"
            type="button"
            onClick={() => navigate("/exercise", { state: { exercise: recommendedExercise } })}
            aria-label={`Starta rekommenderad övning: ${recommendedExercise.title}`}
          >
            <span className="home-popular-time">
              <i className="bi bi-clock" aria-hidden="true" />{" "}
              {recommendedExercise.minutes} min
            </span>

            <div className="home-popular-left">
              <p className="home-popular-title">{recommendedExercise.title}</p>
              <p className="home-popular-sub">{recommendedExercise.subtitle}</p>

              <p style={{ marginTop: 8, fontSize: 12 }}>
                Baserat på din senaste tagg:{" "}
                <strong>{latestMoodEntry?.tag || "ingen logg ännu"}</strong>
              </p>
            </div>

            <span className="home-play" aria-hidden="true">
              ▶
            </span>
          </button>
        </section>
      ) : (
        <p style={{ textAlign: "center" }}>Inga övningar hittades.</p>
      )}

      {/* Vecko-översikt */}
      <h2 className="home-section-title">Din vecka i emojis</h2>
      <WeekMoodSummary />
    </div>
  );
}