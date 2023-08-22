import React, { useState, useEffect } from 'react';
import './App.css'; // Add this import for the styling

function App() {
  const [beers, setBeers] = useState([]);
  const [currentBeerIndex, setCurrentBeerIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedBeers, setSearchedBeers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    async function fetchBeers() {
      try {
        const response = await fetch('https://api.punkapi.com/v2/beers');
        const data = await response.json();
        setBeers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchBeers();
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    const newSuggestions = beers
      .map((beer) => beer.name)
      .filter((name) => name.toLowerCase().includes(value.toLowerCase()));
    setSuggestions(newSuggestions);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const foundBeers = beers.filter(
      (beer) => beer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchedBeers(foundBeers);
    setSearchTerm('');
    setSuggestions([]);
  };

  const displayBeers = searchedBeers.length > 0 ? searchedBeers : beers;
  const currentBeer = displayBeers[currentBeerIndex];

  return (
    <div className="app">
      <header className="header">
        <h1>Beer Catalog</h1>
      </header>
      <div className="search-bar">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button type="submit">Search</button>
        </form>
        {suggestions.length > 0 && searchTerm.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => setSearchTerm(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="beer-list">
        {displayBeers.map((beer, index) => (
          <div key={index} className="beer-card">
            <h2>{beer.name}</h2>
            <p>Tagline: {beer.tagline}</p>
            <p>First Brewed: {beer.first_brewed}</p>
            <img src={beer.image_url} alt={beer.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
