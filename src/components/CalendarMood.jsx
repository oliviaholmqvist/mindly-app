// Kalenderkomponent som visar användarens humör dag för dag och möjliggör navigering mellan månader
// import hämtar funktioner från React-biblioteket
// useState = sparar värden som kan ändras (state)
// useMemo = räknar ut något och "minns" resultatet så vi slipper räkna om i onödan
import { useMemo, useState } from "react";

// Konstanter (fast data) för svenska månader/veckodagar
const MONTHS_SV = [
  "januari","februari","mars","april","maj","juni",
  "juli","augusti","september","oktober","november","december",
];

const WEEKDAYS_SV = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];

// Kopplar siffra (1-5) till emoji (för att visa humör)
const moodEmojis = {
  1: "😢",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😄",
};

// Hjälpfunktion: gör ett datum till formatet "yyyy-mm-dd"
function toISODate(year, monthIndex, day) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// Hjälpfunktion: bygger en kalender-månad som "veckor"
// varje vecka är 7 rutor (dagnummer eller null om tom ruta)
function buildWeeks(year, monthIndex) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Tar reda på vilken veckodag den första dagen i månaden hamnar på
  const jsFirstDay = new Date(year, monthIndex, 1).getDay(); // 0=Sun..6=Sat
  const mondayFirstIndex = (jsFirstDay + 6) % 7; // gör om så måndag blir start (0=Mån)

  const cells = [];

  // Lägger in tomma rutor innan första dagen (för att få rätt placering)
  for (let i = 0; i < mondayFirstIndex; i++) cells.push(null);

  // Lägger in alla dagar i månaden
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Fyller på med tomma rutor i slutet så att det blir hela veckor
  while (cells.length % 7 !== 0) cells.push(null);

  // Delar upp allt i veckor (7 i taget)
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

// export default gör att komponenten kan importeras i andra filer
export default function CalendarMood({ moods = {} }) {
  const today = new Date();

  // useState: sparar vilken månad/år som visas just nu
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  // sparar vilken dag användaren klickat på (för mini-modalen)
  const [selectedISO, setSelectedISO] = useState(null);

  // useMemo: bygger veckorna bara om monthIndex eller year ändras
  const weeks = useMemo(() => buildWeeks(year, monthIndex), [year, monthIndex]);

  // Gå till föregående månad (och byt år om vi går från januari -> december)
  const prevMonth = () => {
    setSelectedISO(null);
    setMonthIndex((m) => {
      if (m === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  // Gå till nästa månad (och byt år om vi går från december -> januari)
  const nextMonth = () => {
    setSelectedISO(null);
    setMonthIndex((m) => {
      if (m === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  // Kollar om en iso-sträng är "idag" (för att markera dagens ruta)
  const isTodayISO = (iso) =>
    iso === toISODate(today.getFullYear(), today.getMonth(), today.getDate());

  // Hämtar humöret för vald dag (om någon dag är vald)
  const selectedMood = selectedISO ? moods[selectedISO] : null;

  // return = vad komponenten visar på skärmen (JSX)
  return (
    <>
      <div className="calendar-card">
        <div className="calendar-top">
          <p className="calendar-month">
            {MONTHS_SV[monthIndex]} {year}
          </p>

          {/* Navigeringsknappar för månad */}
          <div className="calendar-nav">
            <button className="icon-btn" type="button" onClick={prevMonth} aria-label="Föregående månad">
              ‹
            </button>
            <button className="icon-btn" type="button" onClick={nextMonth} aria-label="Nästa månad">
              ›
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          {/* Visar veckodagarna högst upp */}
          {WEEKDAYS_SV.map((wd) => (
            <div key={wd} className="calendar-weekday">
              {wd}
            </div>
          ))}

          {/* Skapar alla dag-rutor i kalendern */}
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              // Om null → rendera en tom ruta
              if (!day) return <div key={`${wi}-${di}`} className="calendar-cell empty" />;

              // Bygger datum-nyckel och hämtar eventuellt humör för dagen
              const iso = toISODate(year, monthIndex, day);
              const mood = moods[iso]; // 1..5 eller undefined

              // Väljer CSS-klass beroende på humör (för färgning)
              const moodClass =
                mood === 5 ? "mood-5" :
                mood === 4 ? "mood-4" :
                mood === 3 ? "mood-3" :
                mood === 2 ? "mood-2" :
                mood === 1 ? "mood-1" : "";

              // Markerar dagens datum
              const todayClass = isTodayISO(iso) ? "today" : "";

              return (
                <button
                  key={`${wi}-${di}`}
                  type="button"
                  className={`calendar-cell day ${moodClass} ${todayClass}`}
                  onClick={() => setSelectedISO(iso)} // klick → öppna mini-modal för dagen
                >
                  <span className="day-number">{day}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Mini-modal: visas bara om en dag är vald */}
      {selectedISO && (
        <div className="calendar-modal-backdrop" onClick={() => setSelectedISO(null)}>
          <div
            className="calendar-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()} // hindrar att klick stänger när man klickar i rutan
          >
            <p className="calendar-modal-title">{selectedISO}</p>

            <p className="calendar-modal-text">
              Humör:{" "}
              <span className="calendar-modal-mood">
                {selectedMood ? moodEmojis[selectedMood] : "—"}
              </span>
            </p>

            <button className="btn btn-primary" type="button" onClick={() => setSelectedISO(null)}>
              Stäng
            </button>
          </div>
        </div>
      )}
    </>
  );
}