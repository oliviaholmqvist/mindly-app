// Profilsida: visar namn, inställningar och möjlighet att logga ut
// - Användaren kan ändra sitt visningsnamn (sparas via onSaveName i App.jsx)
// - Användaren kan välja tid för påminnelse (sparas lokalt i denna sida)
// - Darkmode + Notiser är just nu bara UI-state (ingen riktig funktion bakom)
// - Profilbild kan laddas upp och sparas i localStorage (så den finns kvar vid refresh)

import { useEffect, useRef, useState } from "react";
import Modal from "../components/Modal";

// localStorage-nyckel för profilbilden
const PROFILE_IMG_KEY = "profileImage_v1";

export default function ProfilePage({ displayName, onSaveName, onLogout }) {
  // Namn som visas i profilen (startar från displayName som kommer från App.jsx)
  const [name, setName] = useState(displayName || "vän");

  // Enkla inställningar (bara UI just nu)
  const [darkMode, setDarkMode] = useState(false);
  const [notesOn, setNotesOn] = useState(true);

  // Tid för påminnelse (sparas lokalt här)
  const [reminderTime, setReminderTime] = useState("20:00");

  // Styr om modalerna är öppna eller stängda
  const [isNameOpen, setIsNameOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  // Temporära värden i modalerna (så man kan avbryta utan att spara direkt)
  const [tempName, setTempName] = useState(name);
  const [tempTime, setTempTime] = useState(reminderTime);

  // Profilbild (sparas i localStorage)
  const [profileImage, setProfileImage] = useState("");

  // Ref till fil-inputen (vi klickar på den via kamera-knappen)
  const fileInputRef = useRef(null);

  // Om displayName ändras (t.ex. efter login), uppdatera namnet som visas här
  useEffect(() => {
    if (displayName) setName(displayName);
  }, [displayName]);

  // Läs in sparad profilbild när sidan laddas
  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_IMG_KEY);
    if (saved) setProfileImage(saved);
  }, []);

  // Körs när användaren valt en fil (bild) i filväljaren
  const handlePickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Stoppa jättestora bilder (localStorage är begränsat)
    if (file.size > 2_000_000) {
      alert("Bilden är för stor. Välj en mindre bild (max ca 2 MB).");
      return;
    }

    // FileReader gör om filen till en "data url" som vi kan visa direkt i CSS
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setProfileImage(dataUrl);
      localStorage.setItem(PROFILE_IMG_KEY, dataUrl); // sparar så den finns kvar vid refresh
    };
    reader.readAsDataURL(file);

    // Gör så att man kan välja samma fil igen senare om man vill
    e.target.value = "";
  };

  // Tar bort profilbilden (både UI + localStorage)
  const removeImage = () => {
    setProfileImage("");
    localStorage.removeItem(PROFILE_IMG_KEY);
  };

  return (
    <div className="page page-profile">
      {/* H1 = sidans huvudrubrik */}
      <h1>Min profil</h1>
      <p className="page-intro">Anpassa appen efter dina behov.</p>

      {/* Visar avatar + namn */}
      <div className="profile-header">
        {/* Wrapper så vi kan lägga kamera-knappen ovanpå avataren */}
        <div className="avatar-wrap">
          {/* Själva avataren (visar bild om den finns, annars grå cirkel) */}
          <div
            className="avatar"
            aria-label="Profilbild"
            role="img"
            style={
              profileImage
                ? { backgroundImage: `url(${profileImage})` }
                : undefined
            }
          />

          {/* Kamera-knappen (Bootstrap Icon) som öppnar filväljaren */}
          <button
            type="button"
            className="avatar-camera-btn"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Ladda upp eller byt profilbild"
            title="Byt profilbild"
          >
            <i className="bi bi-camera" aria-hidden="true"></i>
          </button>

          {/* Dold file input: den öppnas när vi klickar på kamera-knappen */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handlePickImage}
          />
        </div>

        <p className="profile-name">{name}</p>

        {/* Om en profilbild finns: visa en knapp för att ta bort den */}
        {profileImage ? (
          <button
            type="button"
            className="link-btn"
            onClick={removeImage}
            aria-label="Ta bort profilbild"
          >
            Ta bort bild
          </button>
        ) : null}
      </div>

      {/* Sektion: Allmänt */}
      <section className="settings-card">
        <h2>Allmänt</h2>

        {/* Rad som öppnar modal för att ändra användarnamn */}
        <button
          className="settings-row"
          type="button"
          onClick={() => {
            setTempName(name); // fyll inputen med nuvarande namn
            setIsNameOpen(true); // öppna modalen
          }}
        >
          <span className="settings-label">Användarnamn</span>
          <span className="settings-right">
            <span className="settings-chevron">›</span>
          </span>
        </button>

        {/* Darkmode-toggle (bara UI-state) */}
        <div className="settings-row">
          <span className="settings-label">Darkmode</span>

          <label className="switch" htmlFor="darkmode">
            <input
              type="checkbox"
              id="darkmode"
              name="darkmode"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <span className="slider" aria-hidden="true" />
          </label>
        </div>
      </section>

      {/* Sektion: Påminnelser */}
      <section className="settings-card">
        <h2>Påminnelser</h2>

        {/* Rad som öppnar modal för att välja tid */}
        <button
          className="settings-row"
          type="button"
          onClick={() => {
            setTempTime(reminderTime); // fyll input med nuvarande tid
            setIsTimeOpen(true); // öppna modalen
          }}
        >
          <span className="settings-label">Påminnelsetid</span>
          <span className="settings-right">
            <span className="settings-value">{reminderTime}</span>
            <span className="settings-chevron">›</span>
          </span>
        </button>

        {/* Notiser-toggle (bara UI-state) */}
        <div className="settings-row">
          <span className="settings-label">Notiser</span>

          <label className="switch" htmlFor="notifications">
            <input
              type="checkbox"
              id="notifications"
              name="notifications"
              checked={notesOn}
              onChange={(e) => setNotesOn(e.target.checked)}
            />
            <span className="slider" aria-hidden="true" />
          </label>
        </div>
      </section>

      {/* Logga ut-knapp */}
      <div className="logout-wrap">
        <button className="btn btn-secondary" type="button" onClick={onLogout}>
          Logga ut
        </button>
      </div>

      {/* MODAL 1: Ändra användarnamn */}
      <Modal isOpen={isNameOpen} onClose={() => setIsNameOpen(false)}>
        <h3 style={{ textAlign: "center", margin: "6px 0 12px" }}>
          Ändra användarnamn
        </h3>

        <input
          className="auth-input"
          id="username"
          name="username"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          placeholder="Skriv ditt namn"
        />

        <button
          className="btn btn-primary"
          type="button"
          style={{ marginTop: 12, width: "100%" }}
          onClick={() => {
            const clean = tempName.trim();
            if (!clean) return;

            setName(clean); // uppdaterar profilen direkt
            onSaveName(clean); // sparar globalt i App.jsx + localStorage
            setIsNameOpen(false); // stäng modal
          }}
        >
          Spara
        </button>
      </Modal>

      {/* MODAL 2: Ändra påminnelsetid */}
      <Modal isOpen={isTimeOpen} onClose={() => setIsTimeOpen(false)}>
        <h3 style={{ textAlign: "center", margin: "6px 0 12px" }}>Välj tid</h3>

        <input
          className="auth-input"
          type="time"
          id="reminder-time"
          name="reminder-time"
          value={tempTime}
          onChange={(e) => setTempTime(e.target.value)}
        />

        <button
          className="btn btn-primary"
          type="button"
          style={{ marginTop: 12, width: "100%" }}
          onClick={() => {
            setReminderTime(tempTime); // sparar ny tid lokalt
            setIsTimeOpen(false); // stäng modal
          }}
        >
          Spara
        </button>
      </Modal>
    </div>
  );
}