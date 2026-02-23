// Sida som spelar upp vald övning och sparar en logg i localStorage (för statistik)
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LOG_KEY = "exerciseLogs";

export default function ExercisePlayerPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Övningen kommer från ExercisesPage via navigate("/exercise", { state: { exercise } })
  const ex = state?.exercise;

  // Om någon går direkt till /exercise utan state
  if (!ex) {
    return (
      <div className="page">
        <h1>Mindfulness</h1>

        <p className="text-secondary" style={{ textAlign: "center" }}>
          Ingen övning vald. Gå tillbaka och välj en övning.
        </p>

        <div className="center" style={{ marginTop: 16 }}>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => navigate("/exercises")}
          >
            Tillbaka
          </button>
        </div>
      </div>
    );
  }

  // När sidan laddas: spara en logg att användaren öppnat denna övning
  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");

    const newLog = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      exercise: ex,
    };

    localStorage.setItem(LOG_KEY, JSON.stringify([newLog, ...logs]));
  }, [ex]);

  return (
    <div className="page player">
      {/* Sidrubrik */}
      <h1>Mindfulness</h1>

<p className="page-intro">
  {ex.minutes} minuter guidad meditation
</p>

      <div className="player-cover" aria-hidden="true">
        <div className="player-circle" />
      </div>

      {/* Titel på övningen (denna kan vara h2 eller h3 beroende på hur stor du vill ha den) */}
      <h2 className="player-title">{ex.title}</h2>

      {/* Författare / källa */}
      <p className="text-secondary player-author" style={{ textAlign: "center" }}>
        {ex.author ?? "Okänd"}
      </p>

      {/* Audio-spelare (native, enklast) */}
      <audio className="player-audio" controls src={ex.audioUrl ?? ""}>
        Din webbläsare stödjer inte ljud.
      </audio>

      <div className="center" style={{ marginTop: 18 }}>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => navigate("/exercises")}
        >
          Tillbaka
        </button>
      </div>
    </div>
  );
}