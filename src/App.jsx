import { useState } from 'react';
import SearchBar from './components/SearchBar';
import NutritionCard from './components/NutritionCard';

function App() {
  const [ingredient, setIngredient] = useState("");
  const [nutrition, setNutrition] = useState(null);
  const [error, setError] = useState("");
  const [mealItems, setMealItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function addToMeal(item) {
    setMealItems(prev => [...prev, item]);
  }

  function removeFromMeal (indexToRemove) {
    setMealItems(prev =>
      prev.filter((_, index) => index != indexToRemove)
    );
  }

  function getTotalNutrient(name) {
    return mealItems.reduce((total, item) => {
      const value = 
        item.nutrients.find(n => n.name === name)?.amount || 0;
      return total + value;
    }, 0);
  }

  async function handleSearch() {
    setError("");
    setNutrition(null);
    setIsLoading(true);

    try {
      const searchRes = await fetch(
        `https://api.spoonacular.com/food/ingredients/search?query=${ingredient}&apiKey=${import.meta.env.VITE_API_KEY}`
      );

      const searchData = await searchRes.json();

      if(!searchData.results || searchData.results.length === 0) {
        setError("No ingredient found");
        setIsLoading(false);
        return;
      }

      const ingredientId = searchData.results[0].id;

      const infoRes = await fetch(
        `https://api.spoonacular.com/food/ingredients/${ingredientId}/information?amount=100&unit=grams&apiKey=${import.meta.env.VITE_API_KEY}`
      );

      const infoData = await infoRes.json();
        
      console.log(infoData);
      setNutrition(infoData);
      setIsLoading(false);
      
    } catch (err) {
      setError("Something went wrong");
      setIsLoading(false);
    }
  }

  return (
  <div style={{ 
    background: "#fafafa",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }}>

    <div style={{ 
      padding: "40px 20px", 
      fontFamily: "Arial, sans-serif",
      maxWidth: "900px",
      width: "100%"
    }}>

    <h1 style={{ marginBottom: "10px", textAlign: "center" }}>
      🌱 Plant-based Nutrition Intelligence
    </h1>

    <p style={{ color: "#666", marginBottom: "30px" }}>
      Build smarter meals and track essential nutrients with ease.
    </p>

  <div style={{
    padding: "20px",
    border: "1px solid #eee",
    borderRadius: "12px",
    marginBottom: "20px"
  }}>
    <h2 style={{ marginBottom: "10px" }}>Search Ingredient</h2>

    <SearchBar
      ingredient={ingredient}
      setIngredient={setIngredient}
      handleSearch={handleSearch}
    />
  </div>

    {error && (
      <p style={{
        color: "#b00020",
        background: "#ffeaea",
        padding: "10px",
        borderRadius: "8px",
        marginTop: "10px"
      }}>
        ⚠️{error}
      </p>
    )}

    {nutrition && (
      <NutritionCard data={nutrition} addToMeal={addToMeal} />
    )}

    {isLoading && (
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Loading nutrition data...
      </p>
    )}

    {/* Total Nutrition */}
    {mealItems.length > 0 && (
      <div style={{
        marginTop: "30px",
        padding: "20px",
        borderRadius: "16px",
        background: "#ffffff",
        boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        border: "1px solid #eee",
        maxWidth: "300px",
        width: "100%"
      }}>
        <h2 style={{ marginBottom: "20px" }}>
          🍽️ Total Meal Nutrition
        </h2>

        {/* Grid Starts Here */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "auto auto",
          rowGap: "12px",
          columnGap: "12px",
          alignItems: "center"
        }}>

          <span>Calories</span> 
          <strong>{getTotalNutrient("Calories").toFixed(0)} kcal</strong>

          <span>Protein</span>
          <strong>{getTotalNutrient("Protein").toFixed(1)} g</strong>

          <span>Carbs</span>
          <strong>{getTotalNutrient("Carbohydrates").toFixed(1)} g</strong>

          <span>Fat</span>
          <strong>{getTotalNutrient("Fat").toFixed(1)} g</strong>

          <span>Iron</span>
          <strong>{getTotalNutrient("Iron").toFixed(1)} mg</strong>

          <span>Calcium</span>
          <strong>{getTotalNutrient("Calcium").toFixed(1)} mg</strong>

        </div>
      </div>
    )}

    {/* Meal Builder */}
    {mealItems.length > 0 && (
      <div style={{ marginTop: "30px" }}>
        <h2>Meal Builder</h2>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px"
      }}>
        {mealItems.map((item, index) => {

          function getNutrient(name) {
            return (
              item.nutrients.find(n => n.name === name)?.amount || "N/A"
            );
          }

          return (
            <div 
              key={index}
              style={{ 
                marginTop: "20px",
                border: "1px solid #eee",
                borderRadius: "16px",
                padding: "20px",
                maxWidth: "320px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                background: "#fff"
              }}
            >
              <h3>{item.name} (100g)</h3>

              <p>Calories: {getNutrient("Calories")} kcal</p>
              <p>Protein: {getNutrient("Protein")} g</p>
              <p>Carbs: {getNutrient("Carbohydrates")} g</p>
              <p>Fat: {getNutrient("Fat")} g</p>
              <p>Iron: {getNutrient("Iron")} mg</p>
              <p>Calcium: {getNutrient("Calcium")} mg</p>

              <button 
                onClick={() => removeFromMeal(index)}
                style={{ 
                  marginTop: "10px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#ff4d4f",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
    )}
  </div>
</div>
);
}

export default App;