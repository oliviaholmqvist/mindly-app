// Sida som visar humör-kalendern och en lista med de senaste humör-loggarna
import { useMemo } from "react";
import CalendarMood from "../components/CalendarMood";
import WeekMoodSummary from "../components/WeekMoodSummary";

export default function CalendarPage() {
  // Hjälpfunktion: gör om datum till "YYYY-MM-DD" i lokal tid
  const toLocalDateKey = (dateInput) => {
    const d = new Date(dateInput);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Hjälpfunktion: konverterar emoji till en siffra (1–5) för kalenderfärger
  const emojiToNumber = (emoji) => {
    const map = {
      "😢": 1,
      "😕": 2,
      "😐": 3,
      "🙂": 4,
      "😄": 5,
    };
    return map[emoji] ?? null;
  };

  // Hämtar alla humör-loggar från localStorage (sparade från MoodPage)
  const allEntries = useMemo(() => {
    return JSON.parse(localStorage.getItem("moodEntries") || "[]");
  }, []);

  // Bygger upp data i formatet som CalendarMood behöver: { "YYYY-MM-DD": 1..5 }
  const moodsForCalendar = useMemo(() => {
    const map = {};

    for (const entry of allEntries) {
      const key = toLocalDateKey(entry.date);
      const moodNum = emojiToNumber(entry.mood);

      // Behåller en logg per dag (den senaste som finns sparad)
      if (!map[key] && moodNum) {
        map[key] = moodNum;
      }
    }

    return map;
  }, [allEntries]);

  // Tar fram de senaste 5 loggarna för att visa som “Senaste”
  const latestEntries = useMemo(() => allEntries.slice(0, 5), [allEntries]);

  return (
    <div className="page page-calendar">
      <h1>Kalender</h1>
      <h2>Din översikt</h2>

      <CalendarMood moods={moodsForCalendar} />

      {/* Vecko-översikt flyttad hit från Home */}
      <h2>Din vecka i emojis</h2>
      <WeekMoodSummary />

      <div className="mood-card" style={{ marginTop: 16 }}>
        <h3 style={{ textAlign: "center", margin: "6px 0 12px" }}>Senaste</h3>

        {latestEntries.length === 0 ? (
          <p style={{ marginTop: 8 }} className="text-secondary">
            Inga loggar än. Gå till humör-sidan och spara en första check-in.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
            {latestEntries.map((e) => (
              <div
                key={e.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 12,
                  background: "var(--white)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <strong>
                    {e.mood} {e.tag ? `• ${e.tag}` : ""}
                  </strong>

                  <span className="text-secondary" style={{ fontSize: 12 }}>
                    {toLocalDateKey(e.date)}
                  </span>
                </div>

                {e.note ? (
                  <p className="text-secondary" style={{ margin: "8px 0 0 0" }}>
                    {e.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}