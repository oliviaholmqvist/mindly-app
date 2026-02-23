// Navigationskomponent som visar appens bottom navigation och markerar aktiv sida
import { NavLink } from "react-router-dom";

// Hjälpkomponent för ett enskilt navigationsobjekt
function NavItem({ to, label, iconClass }) {
  return (
    <NavLink
      to={to} // anger vilken route länken leder till
      className={({ isActive }) =>
        `nav-item ${isActive ? "active" : ""}`
      } // markerar aktuell sida visuellt
    >
      <i
        className={`bi ${iconClass} nav-icon`}
        aria-hidden="true"
      />
      <span className="nav-label">{label}</span>
    </NavLink>
  );
}

// export default gör att Navbar kan användas i App.jsx
export default function Navbar() {
  return (
    <nav className="bottom-nav" aria-label="Bottom navigation">
      <NavItem to="/home" label="Hem" iconClass="bi-house" />
      <NavItem to="/calendar" label="Kalender" iconClass="bi-calendar3" />
      <NavItem to="/diary" label="Dagbok" iconClass="bi-journal-text" />
      <NavItem to="/exercises" label="Övningar" iconClass="bi-heart-pulse" />
      <NavItem to="/profile" label="Profil" iconClass="bi-person" />
    </nav>
  );
}