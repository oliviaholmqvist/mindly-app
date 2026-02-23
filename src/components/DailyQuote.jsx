// Komponent som visar ett dagligt motivationscitat hämtat från JSON och sparar samma citat per dag
import { useEffect, useState } from "react";
import quotes from "../quotes.json";

const STORAGE_KEY = "dailyQuote_local_v1";

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function DailyQuote() {
  const [text, setText] = useState("Laddar dagens citat...");

  useEffect(() => {
    const todayKey = getTodayKey();

    const cachedRaw = localStorage.getItem(STORAGE_KEY);
    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw);
        if (cached.day === todayKey && cached.quote) {
          setText(cached.quote);
          return;
        }
      } catch {}
    }

    // Väljer ett citat deterministiskt från JSON-filen
    const index =
      Math.abs(
        todayKey
          .split("")
          .reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
      ) % quotes.length;

    const quote = quotes[index];

    setText(quote);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        day: todayKey,
        quote,
      })
    );
  }, []);

  return (
    <div className="home-quote" role="note" aria-label="Dagens citat">
      <span className="home-quote-mark" aria-hidden="true">
        ❝
      </span>
      <p className="home-quote-text">{text}</p>
    </div>
  );
}