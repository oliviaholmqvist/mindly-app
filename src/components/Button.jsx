// Återanvändbar knapp-komponent som används i hela appen
// export gör att komponenten kan användas i andra filer i projektet
export default function Button({
  variant = "primary",
  type = "button",
  disabled = false,
  onClick,
  children,
}) {
  // return bestämmer vad som ska visas på skärmen
  // här returneras JSX som React omvandlar till HTML
  return (
    <button
      className={`btn btn-${variant}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}