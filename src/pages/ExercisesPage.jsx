// Sida som visar en lista med mindfulness-övningar hämtade från en JSON-fil
import { useNavigate } from "react-router-dom";
import ExerciseCard from "../components/ExerciseCard";
import exercises from "../exercises.json";

export default function ExercisesPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      {/* H1 = sidans huvudrubrik */}
      <h1>Övningar</h1>

<p className="page-intro">
       Välj en guidad meditation som passar ditt humör
</p>

      <div className="exercise-grid">
        {exercises.map((exercise, index) => (
          <ExerciseCard
            key={index}
            minutes={exercise.minutes}
            title={exercise.title}
            subtitle={exercise.subtitle}
            onClick={() => navigate("/exercise", { state: { exercise } })}
          />
        ))}
      </div>
    </div>
  );
}