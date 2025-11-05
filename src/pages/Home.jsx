import React, { useState } from "react";
import { useTeam } from "../context/TeamContext";
import "./Home.css";

// Component voor de Home-pagina waar het Pokémon-team wordt getoond
export default function Home() {
  // Haal team en setter uit de context (globale staat voor gekozen team)
  const { team, setTeam } = useTeam();

  // Houd bij welke Pokémon momenteel geselecteerd is (object uit team)
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Houd bij welke gedetailleerde gegevens van de geselecteerde Pokémon geladen zijn
  const [pokemonDetails, setPokemonDetails] = useState(null);

  // Functie die wordt aangeroepen als op een Pokémon geklikt wordt
  // - laadt details op vanuit de PokeAPI en zet deze in state zodat een popup getoond kan worden
  const handlePokemonClick = async (pokemon) => {
    if (!pokemon) return; // Niks doen als er geen Pokémon in dat vakje staat
    setSelectedPokemon(pokemon);

    try {
      // Haal details op van de API op basis van het id van de Pokémon
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
      const data = await res.json();

      // Zet alleen de velden die we nodig hebben in pokemonDetails
      setPokemonDetails({
        name: data.name,
        // Gebruik de officiële artwork sprite als grote afbeelding
        sprite: data.sprites.other["official-artwork"].front_default,
        // Hoogte en gewicht in meters/kg (API geeft in decimeters/hectograms)
        height: data.height / 10,
        weight: data.weight / 10,
        // Types als string array (bv. ["fire","flying"])
        types: data.types.map((t) => t.type.name),
        // Stats als array met naam en waardes (voor de balkjes)
        stats: data.stats.map((s) => ({
          name: s.stat.name,
          value: s.base_stat,
        })),
      });
    } catch (error) {
      // Fout afhandelen (console log zodat developer kan zien wat mis ging)
      console.error("Fout bij laden details:", error);
    }
  };

  // Sluit de popup door geselecteerde Pokémon en details te resetten
  const closePopup = () => {
    setSelectedPokemon(null);
    setPokemonDetails(null);
  };

  return (
    <div>
      {/* Pagina titel */}
      <h1 className="pokemon-title">Mijn Team</h1>

      {/* Container met 6 vakjes voor teamleden (of lege vakjes) */}
      <div className="team-container">
        {(team || Array(6).fill(null)).map((pokemon, index) => (
          <div key={index} className="team-card">
            {pokemon ? (
              <>
                {/* Als er een Pokémon is: toon sprite en naam.
                    Klikken op de afbeelding opent details popup */}
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="pokemon-sprite"
                  onClick={() => handlePokemonClick(pokemon)}
                />
                <span className="pokemon-name">{pokemon.name}</span>

                {/* Verwijderknop om de Pokémon uit het team te halen */}
                <button
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // Voorkomt dat click ook de popup opent
                    const newTeam = [...team]; // Kopieer huidige team array
                    newTeam[index] = null; // Zet dat vakje op leeg
                    setTeam(newTeam); // Update de context/state
                  }}
                >
                  ✕
                </button>
              </>
            ) : (
              // Als vakje leeg is: toon "Leeg"
              <span className="pokemon-name">Leeg</span>
            )}
          </div>
        ))}
      </div>

      {/* Popup voor gedetailleerde informatie.
          Wordt alleen gerenderd als pokemonDetails geladen is */}
      {pokemonDetails && (
        // Overlay: klik ergens buiten de kaart sluit de popup
        <div className="popup-overlay" onClick={closePopup}>
          {/* Kaart zelf: stop propagation zodat klik binnenin de kaart niet sluit */}
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            {/* Sluitknop in de kaart */}
            <button className="close-btn" onClick={closePopup}>✕</button>

            {/* Grote afbeelding en basisinfo */}
            <img
              src={pokemonDetails.sprite}
              alt={pokemonDetails.name}
              className="popup-image"
            />
            <h2 className="popup-name">{pokemonDetails.name}</h2>
            <p><strong>Type:</strong> {pokemonDetails.types.join(", ")}</p>
            <p><strong>Hoogte:</strong> {pokemonDetails.height} m</p>
            <p><strong>Gewicht:</strong> {pokemonDetails.weight} kg</p>

            {/* Statistiekbalkjes: laat elke stat zien met een gevulde balk */}
            <div className="stats">
              {pokemonDetails.stats.map((s, i) => (
                <div key={i} className="stat-line">
                  {/* Naam van de stat (bijv. hp, attack) */}
                  <span>{s.name}</span>

                  {/* Achtergrondbalk */}
                  <div className="stat-bar">
                    {/* Gevulde deel: breedte proportioneel aan de stat waardes.
                        Hier delen we door 150 om de percentage te bepalen.
                        Pas deze maximumwaarde aan indien nodig. */}
                    <div
                      className="stat-fill"
                      style={{ width: `${(s.value / 150) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
