// App.jsx
// Huvudkomponenten som håller ihop hela appen:
// routing, autentisering (Firebase), global state och localStorage

import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

/* Pages */
import LoginPage from "./pages/Loginpage.jsx";
import HomePage from "./pages/HomePage.jsx";
import MoodPage from "./pages/MoodPage.jsx";
import DiaryPage from "./pages/DiaryPage.jsx";
import ExercisesPage from "./pages/ExercisesPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import ExercisePlayerPage from "./pages/ExercisePlayerPage.jsx";

/* Components */
import Navbar from "./components/Navbar.jsx";

/* ---------- Protected Route ---------- */
// Skyddar sidor så att användaren måste vara inloggad
function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  // Inloggad användare (Firebase)
  const [user, setUser] = useState(null);

  // Namn som visas i appen
  const [displayName, setDisplayName] = useState("");

  // Alla dagboksinlägg (global state)
  const [diaryEntries, setDiaryEntries] = useState(() => {
    const saved = localStorage.getItem("diaryEntries");
    return saved ? JSON.parse(saved) : [];
  });

  // Spara dagboken i localStorage när den ändras
  useEffect(() => {
    localStorage.setItem("diaryEntries", JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  /* ---------- Dagboksfunktioner ---------- */

  // Skapa nytt dagboksinlägg
  const addDiaryEntry = ({ title, text, tags = [] }) => {
    if (!text?.trim()) return;

    const newEntry = {
      id: crypto.randomUUID(),
      title: title?.trim() || "Daglig reflektion",
      text: text.trim(),
      tags,
      date: new Date().toLocaleDateString("sv-SE"),
    };

    setDiaryEntries((prev) => [newEntry, ...prev]);
  };

  // Radera inlägg
  const deleteDiaryEntry = (id) => {
    setDiaryEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // Redigera inlägg
  const editDiaryEntry = (updatedEntry) => {
    setDiaryEntries((prev) =>
      prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
    );
  };

  /* ---------- Firebase auth ---------- */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const baseName = currentUser.email
          ? currentUser.email.split("@")[0]
          : "vän";

        const key = `displayName_${currentUser.uid}`;
        const savedName = localStorage.getItem(key);

        setDisplayName(savedName || baseName);
      } else {
        setDisplayName("");
      }
    });

    return () => unsubscribe();
  }, []);

  // Logga ut
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setDisplayName("");
  };

  // Spara nytt visningsnamn
  const handleSaveName = (newName) => {
    const clean = newName?.trim();
    if (!clean || !user?.uid) return;

    setDisplayName(clean);
    localStorage.setItem(`displayName_${user.uid}`, clean);
  };

  /* ---------- Render ---------- */

  return (
    <div>
      {/* Navbar visas bara när användaren är inloggad */}
      {user && <Navbar />}

      <Routes>
        {/* Start */}
        <Route
          path="/"
          element={user ? <Navigate to="/mood" replace /> : <LoginPage />}
        />

        {/* Home */}
        <Route
          path="/home"
          element={
            <ProtectedRoute isLoggedIn={!!user}>
              <HomePage
                user={user}
                displayName={displayName}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        {/* Mood (skapar även dagboksinlägg automatiskt) */}
        <Route
          path="/mood"
          element={
            <ProtectedRoute isLoggedIn={!!user}>
              <MoodPage
                displayName={displayName}
                addDiaryEntry={addDiaryEntry}
              />
            </ProtectedRoute>
          }
        />

        {/* Diary */}
        <Route
          path="/diary"
          element={
            <ProtectedRoute isLoggedIn={!!user}>
              <DiaryPage
                entries={diaryEntries}
                addDiaryEntry={addDiaryEntry}
                deleteDiaryEntry={deleteDiaryEntry}
                editDiaryEntry={editDiaryEntry}
              />
            </ProtectedRoute>
          }
        />

        {/* Exercises */}
        <Route
          path="/exercises"
          element={
            <ProtectedRoute isLoggedIn={!!user}>
              <ExercisesPage />
            </ProtectedRoute>
          }
        />

        {/* Exercise player */}
        <Route
          path="/exercise"
          element={
            <ProtectedRoute isLoggedIn={!!user}>
              <ExercisePlayerPage />
            </ProtectedRoute>
          }
        />

        {/* Calendar */}
        <Route
          path="/calendar"
          element={
            <ProtectedRoute isLoggedIn={!!user}>
              <CalendarPage />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute isLoggedIn={!!user}>
              <ProfilePage
                displayName={displayName}
                onSaveName={handleSaveName}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}