import styles from "./SearchBar.module.css";

function SearchBar({ ingredient, setIngredient, handleSearch }) {
    return (
        <div className={styles.div}>

            <input
              type="text"
              placeholder="Enter ingredient"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              
              className={styles.input}
            />

            <button
              onClick={handleSearch}
              className={styles.button}
            >
              Search
            </button>
        </div>
    );
}

export default SearchBar;