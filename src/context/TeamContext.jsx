import React, { createContext, useContext, useState, useEffect } from "react";

// Maak een nieuwe Context voor team data (deelbare state)
const TeamContext = createContext();

// Custom hook om de TeamContext makkelijk te gebruiken in componenten
export const useTeam = () => {
  return useContext(TeamContext);
};

// Provider component die globale team-state en functies levert aan kinderen
export const TeamProvider = ({ children }) => {
  // 🟢 huidig geselecteerd team, persistent via localStorage
  // useState met lazy initializer: leest eerst uit localStorage (als aanwezig)
  // en zorgt dat het altijd een array van lengte 6 is (6 slots voor Pokémon)
  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem("team");
    if (saved) {
      const parsed = JSON.parse(saved);
      while (parsed.length < 6) parsed.push(null); // altijd 6 slots
      return parsed;
    }
    return Array(6).fill(null); // standaard: 6 lege slots
  });

  // 🟢 meerdere teams feature: lijst van opgeslagen teams (niet hetzelfde als huidige team)
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem("teams");
    return saved ? JSON.parse(saved) : []; // default: geen teams
  });

  // 🟢 favorietenlijst: eenvoudige array van favoriet Pokémon-objecten
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : []; // default: geen favorieten
  });

  // 🟢 sync team naar localStorage wanneer team verandert
  useEffect(() => {
    localStorage.setItem("team", JSON.stringify(team));
  }, [team]);

  // 🟢 sync teams naar localStorage wanneer teams verandert
  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  // 🟢 sync favorites naar localStorage wanneer favorites verandert
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // 🟢 bestaande functie: zet een Pokémon in een specifieke slot (index)
  // vervangt wat er eerder in dat slot zat
  const swapPokemon = (pokemon, index) => {
    const newTeam = [...team]; // copy om immutability te bewaren
    newTeam[index] = pokemon; // plaats nieuwe pokemon op index
    setTeam(newTeam); // update state (en trigger localStorage via useEffect)
  };

  // 🟢 teambeheer: voeg een nieuw team toe met een id, naam en lege members-array
  const addTeam = (name) => {
    const newTeam = { id: Date.now(), name, members: [] };
    setTeams([...teams, newTeam]); // voeg toe aan bestaande lijst
  };

  // 🟢 teambeheer: verwijder een team op basis van id
  const removeTeam = (id) => {
    setTeams(teams.filter((t) => t.id !== id)); // filter het team eruit
  };

  // 🟢 favorietenbeheer: toggle favorite aan/uit voor een gegeven pokemon
  // als pokemon al in favorites staat, verwijder hem; anders voeg toe
  const toggleFavorite = (pokemon) => {
    setFavorites((prev) => {
      const exists = prev.find((p) => p.id === pokemon.id);
      if (exists) {
        return prev.filter((p) => p.id !== pokemon.id); // verwijder favorite
      } else {
        return [...prev, pokemon]; // voeg toe aan favorites
      }
    });
  };

  // 🟢 waarde die naar alle componenten in de app wordt gedeeld via context
  return (
    <TeamContext.Provider
      value={{
        team, // huidige team (array van 6 slots)
        setTeam, // directe setter (gebruik met voorzichtigheid)
        swapPokemon, // functie om 1 slot te updaten
        teams, // lijst van opgeslagen teams
        addTeam, // voeg nieuw team toe
        removeTeam, // verwijder team
        favorites, // lijst van favoriete pokemon
        toggleFavorite, // toggle favorite on/off
      }}
    >
      {children /* render alle child components binnen deze provider */}
    </TeamContext.Provider>
  );
};
