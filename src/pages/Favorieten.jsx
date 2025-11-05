import React from "react";
import { useTeam } from "../context/TeamContext";
import "./Lijst.css"; // hergebruik dezelfde CSS

// Component die de favoriete Pokémon laat zien en favoriet-toggle aanroept
export default function Favorieten() {
    // haal favorites en toggleFavorite uit de context (gedeelde staat)
    const { favorites, toggleFavorite } = useTeam();

    return (
        <div>
            {/* Titel van de pagina */}
            <h1 className="pokemon-title">Favoriete Pokémon</h1>

            {/* Als er nog geen favorieten zijn, toon een bericht */}
            {favorites.length === 0 ? (
                <p className="loading-text">Nog geen favorieten toegevoegd.</p>
            ) : (
                // Anders: toon de lijst met favoriete Pokémon
                <div className="pokemon-list">
                    {favorites.map((pokemon) => (
                        // Eén kaart per Pokémon, key is id voor React rendering
                        <div key={pokemon.id} className="pokemon-card">
                            {/* Container voor de sprite (plaatje) */}
                            <div className="sprite-container">
                                <img
                                    src={pokemon.sprite} // url naar het plaatje
                                    alt={pokemon.name} // toegankelijkheid: naam als alt-tekst
                                    className="pokemon-sprite"
                                />
                            </div>

                            {/* Naam en knop om uit favorieten te verwijderen */}
                            <div className="name-container">
                                <span className="pokemon-name">{pokemon.name}</span>
                                <button
                                    className="favorite-button"
                                    // bij klikken, roep toggleFavorite aan met deze Pokémon
                                    onClick={() => toggleFavorite(pokemon)}
                                >
                                    ❌
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
