// Navigation.jsx
// Component voor de navigatiebalk van de app.
// Laat links zien naar Home, Lijst en Favorieten en markeert de actieve route.

import { Link, useLocation } from "react-router-dom"; // React Router: Link voor navigatie, useLocation om huidig pad te lezen
import "./Navigation.css"; // Laad CSS voor styling van de navigatie
import logo from "../components/logo.png"; // Import van het logo-beeld (gebruik in de navbar)

function Navigation() {
  const location = useLocation(); // Haal het huidige pad op (bijv. "/", "/lijst" of "/favorieten")

  return (
    // Hoofdcontainer van de navigatiebalk
    <nav className="nav-container">
      {/* Logo sectie: toont het logo links in de navigatie */}
      <div className="nav-logo">
        {/* img gebruikt het geïmporteerde logo; alt is zichtbaar voor schermlezers */}
        <img src={logo} alt="logo" className="nav-logo" />
      </div>

      {/* Links sectie: bevat de navigatieknoppen/links */}
      <div className="nav-links">
        {/* Home link:
            - to="/" zorgt dat je naar de root route gaat
            - className gebruikt een ternary om "active" toe te voegen als dit de huidige route is
            - span toont de tekst van de link */}
        <Link
          to="/"
          className={`pokeball ${location.pathname === "/" ? "active" : ""}`}
        >
          <span>Home</span>
        </Link>

        {/* Lijst link:
            - naar /lijst
            - markeer als active als location.pathname gelijk is aan "/lijst" */}
        <Link
          to="/lijst"
          className={`pokeball ${
            location.pathname === "/lijst" ? "active" : ""
          }`}
        >
          <span>Lijst</span>
        </Link>

        {/* Favorieten link:
            - naar /favorieten
            - markeer als active als location.pathname gelijk is aan "/favorieten"
            - toont korte tekst "Fav." */}
        <Link
          to="/favorieten"
          className={`pokeball ${
            location.pathname === "/favorieten" ? "active" : ""
          }`}
        >
          <span>Fav.</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navigation; // Exporteer component zodat andere bestanden deze kunnen importeren
