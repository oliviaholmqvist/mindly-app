// Inloggnings-/registreringssida som använder Firebase Auth för att logga in
// eller skapa konto med email och lösenord
import { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function LoginPage() {
  // mode styr om sidan är i "login" eller "signup"-läge
  const [mode, setMode] = useState("login");

  // Formulärfält (kontrollerade inputs)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI-state för laddning och felmeddelande
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Körs när användaren skickar formuläret
  const handleSubmit = async (e) => {
    e.preventDefault(); // stoppar sidans default “reload”
    setError(""); // rensar gamla fel
    setLoading(true); // visar att något pågår

    try {
      // Om login-läge: logga in med Firebase
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Annars: skapa konto med Firebase
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      // Om Firebase ger fel: spara feltext så den kan visas i UI
      console.error(err);
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      // Körs alltid: slutar visa loading
      setLoading(false);
    }
  };

  // return: UI för login/signup-formulär
  return (
    <div className="page">
      {/* Rubriken ändras beroende på mode */}
      <h1>{mode === "login" ? "Logga in" : "Skapa konto"}</h1>

      {/* Formulär som kör handleSubmit vid submit */}
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-label" htmlFor="auth-email">
          Email
        </label>
        <input
          id="auth-email"
          name="email"
          className="auth-input"
          type="email"
          value={email} // kopplar input till state
          onChange={(e) => setEmail(e.target.value)} // uppdaterar state vid skrivning
          required
          autoComplete="email"
        />

        <label className="auth-label" htmlFor="auth-password">
          Lösenord
        </label>
        <input
          id="auth-password"
          name="password"
          className="auth-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6} // enkel validering innan submit
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />

        {/* Submit-knapp som blir inaktiv under loading */}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading
            ? "Vänta..."
            : mode === "login"
            ? "Logga in"
            : "Skapa konto"}
        </button>
      </form>

      {/* Knapp för att byta mellan login och signup */}
      <div className="auth-actions">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login"
            ? "Skapa konto istället"
            : "Jag har redan konto"}
        </button>
      </div>

      {/* Visar felmeddelande om error finns */}
      {error && (
        <p className="text-secondary" style={{ marginTop: 12, textAlign: "center" }}>
          {error}
        </p>
      )}
    </div>
  );
}