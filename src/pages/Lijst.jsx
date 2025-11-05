import React, { useState, useEffect } from "react";
import { useTeam } from "../context/TeamContext";
import "./Lijst.css";

// Component die de lijst met Pokémon toont en interacties mogelijk maakt
export default function Lijst() {
  // Haal team en functies uit de context (swapPokemon voor wisselen, toggleFavorite voor favoriet)
  const { team, swapPokemon, toggleFavorite } = useTeam(); // 🔥 toggleFavorite toegevoegd

  // State: volledige lijst met Pokémon, geselecteerde Pokémon voor modal, en loading indicator
  const [pokemonList, setPokemonList] = useState([]); // array van { id, name, sprite }
  const [selectedPokemon, setSelectedPokemon] = useState(null); // de Pokémon die je wilt plaatsen in je team
  const [loading, setLoading] = useState(true); // true zolang data wordt opgehaald

  // useEffect: haalt de eerste 151 Pokémon op bij mount van de component
  useEffect(() => {
    // Fetch naar de PokeAPI voor de eerste 151 Pokémon
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((res) => res.json())
      .then((data) => {
        // Maak een lijst met objecten die id, naam en sprite-url bevatten
        const list = data.results.map((p, i) => ({
          id: i + 1,
          name: p.name,
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i + 1}.png`,
        }));
        setPokemonList(list); // zet de opgehaalde lijst in state
        setLoading(false); // klaar met laden
      })
      .catch((err) => {
        // Log fouten en stop de loading indicator
        console.error("Fout bij ophalen Pokémon:", err);
        setLoading(false);
      });
  }, []); // lege dependency array => draait één keer bij mount

  // Handler: wanneer je op een Pokémon kaart klikt, wordt die geselecteerd
  const handleSelect = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  // Handler: wissel de geselecteerde Pokémon naar een plek in het team
  const handleSwap = (index) => {
    swapPokemon(selectedPokemon, index); // functie uit context voert de swap uit
    setSelectedPokemon(null); // sluit daarna de modal
  };

  return (
    <div>
      <h1 className="pokemon-title">Pokémon Lijst</h1>

      {loading ? (
        // Toon een laadtekst zolang data opgehaald wordt
        <p className="loading-text">Laden van Pokémon...</p>
      ) : (
        // Zodra geladen: toon de lijst met Pokémon kaarten
        <div className="pokemon-list">
          {pokemonList.map((pokemon) => (
            // Elke kaart heeft een key, sprite en naam
            <div
              key={pokemon.id}
              className="pokemon-card"
              onClick={() => handleSelect(pokemon)} // klik selecteert de Pokémon voor plaatsen
            >
              <div className="sprite-container">
                <img
                  src={pokemon.sprite} // kleine afbeelding van de Pokémon
                  alt={pokemon.name}
                  className="pokemon-sprite"
                />
              </div>
              <div className="name-container">
                <span className="pokemon-name">{pokemon.name}</span>
                {/* Favorietenknop: voorkomt dat klik op de knop de kaart-selectie triggert */}
                <button
                  className="favorite-button"
                  onClick={(e) => {
                    e.stopPropagation(); // voorkom dat deze klik de kaart-selectie activeert
                    toggleFavorite(pokemon); // markeer of demarkeer als favoriet via context
                  }}
                >
                  ❤️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPokemon && (
        // Modal backdrop en inhoud: kies waar je de geselecteerde Pokémon wilt zetten in je team
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Waar wil je {selectedPokemon.name} zetten?</h2>
            <div className="modal-buttons">
              {team.map((_, index) => (
                // Maak voor iedere teamplek een knop die swap uitvoert naar die index
                <button key={index} onClick={() => handleSwap(index)}>
                  Plek {index + 1}
                </button>
              ))}
            </div>
            <button
              className="close-button"
              onClick={() => setSelectedPokemon(null)} // sluit de modal zonder te wisselen
            >
              Sluiten
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
