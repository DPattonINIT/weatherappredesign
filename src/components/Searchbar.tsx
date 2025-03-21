import { useState } from "react";

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [city, setCity] = useState<string>(""); 

  const handleSearch = () => {
    if (city.trim() !== "") {
      onSearch(city);
      setCity(""); 
    }
  };

  return (
    <div className="searchBar ">
      <input
        type="text"
        placeholder="Search location..."
        value={city ?? ""} 
        onChange={(e) => setCity(e.target.value)}
        className="searchInput"
      />
      <button onClick={handleSearch} className="searchBTN">
        Search
      </button>
    </div>
  );
};

export default SearchBar;

