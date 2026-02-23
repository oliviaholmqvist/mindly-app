// Återanvändbar modal-komponent som visar innehåll i en popup och kan stängas via klick eller knapp
export default function Modal({ isOpen, onClose, children }) {
  // Om modalen inte ska vara öppen returneras ingenting
  if (!isOpen) return null;

  // return: modalens struktur och innehåll
  return (
    // Bakgrund som täcker hela skärmen och stänger modalen vid klick
    <div className="modal-backdrop" onClick={onClose}>
      {/* Själva modal-rutan */}
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Stäng-knapp */}
        <button className="modal-close" type="button" onClick={onClose}>
          ×
        </button>

        {/* children gör det möjligt att visa valfritt innehåll i modalen */}
        {children}
      </div>
    </div>
  );
}