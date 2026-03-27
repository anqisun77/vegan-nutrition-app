function SearchBar({ ingredient, setIngredient, handleSearch }) {
    return (
        <div>
            <input
              type="text"
              placeholder="Enter ingredient"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
            />

            <button onClick={handleSearch}>Search</button>
        </div>
    );
}

export default SearchBar;