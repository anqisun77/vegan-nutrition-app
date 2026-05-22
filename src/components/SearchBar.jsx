function SearchBar({ ingredient, setIngredient, handleSearch }) {
    return (
        <div style={{
            display: "flex",
            gap: "0px",
            alignItems: "center"
        }}>
            <input
              type="text"
              placeholder="Enter ingredient"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              onFocus={(e) => {
                e.target.style.border = "1px solid #4CAF50";
                e.target.style.boxShadow = "0 0 0 2px rgba(76,175,80,0.2)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid #ddd";
                e.target.style.boxShadow = "none";
              }}
              onMouseDown={(e) => e.target.style.transform = "scale(0.97)"}
              onMouseUp={(e) => e.target.style.transform = "scale(1)"}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: "8px 0 0 8px",
                border: "1px solid #ddd",
                borderRight: "none",
                fontSize: "14px",
                outline: "none",
                transition: "all 0.2s ease"
              }}
            />

            <button
              onClick={handleSearch}
              style={{
                padding: "10px 16px",
                borderRadius: "0 8px 8px 0",
                border: "none",
                background: "#4CAF50",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer"
              }}
              onMouseOver={(e) => e.target.style.background = "#43a047"}
              onMouseOut={(e) => e.target.style.background = "#4CAF50"}
            >
              Search
            </button>
        </div>
    );
}

export default SearchBar;