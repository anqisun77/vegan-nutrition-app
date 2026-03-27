import { useState } from 'react';
import SearchBar from './components/SearchBar';
import NutritionCard from './components/NutritionCard';

function App() {
  const [ingredient, setIngredient] = useState("");
  const [nutrition, setNutrition] = useState(null);
  const [error, setError] = useState("");
  const [mealItems, setMealItems] = useState([]);

  function addToMeal(item) {
    setMealItems(prev => [...prev, item]);
  }

  function removeFromMeal (indexToRemove) {
    setMealItems(prev =>
      prev.filter((_, index) => index != indexToRemove)
    );
  }

  async function handleSearch() {
    setError("");
    setNutrition(null);

    try {
      const searchRes = await fetch(
        `https://api.spoonacular.com/food/ingredients/search?query=${ingredient}&apiKey=${import.meta.env.VITE_API_KEY}`
      );

      const searchData = await searchRes.json();

      if(!searchData.results || searchData.results.length === 0) {
        setError("No ingredient found");
        return;
      }

      const ingredientId = searchData.results[0].id;

      const infoRes = await fetch(
        `https://api.spoonacular.com/food/ingredients/${ingredientId}/information?amount=100&unit=grams&apiKey=${import.meta.env.VITE_API_KEY}`
      );

      const infoData = await infoRes.json();
        
      console.log(infoData);
      setNutrition(infoData);
      
    } catch (err) {
      setError("Something went wrong");
    }
  }

  return (
  <div style={{ padding: "40px", fontFamily: "Arial" }}>
    <h1>Plant-based Nutrition Intelligence Platform 🌱</h1>
    <p>Helping plant-based people optimize their nutrition.</p>

    <h2>Search Ingredient</h2>

    <SearchBar
      ingredient={ingredient}
      setIngredient={setIngredient}
      handleSearch={handleSearch}
    />

    {error && (
      <p style={{ color: "red", marginTop: "10px" }}>
        ⚠️{error}
      </p>
    )}

    {nutrition && (
      <NutritionCard data={nutrition} addToMeal={addToMeal} />
    )}

    {/* Meal Builder */}
    {mealItems.length > 0 && (
      <div style={{ marginTop: "30px" }}>
        <h2>Meal Builder</h2>

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
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "20px",
                maxWidth: "300px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
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
                style={{ marginTop: "10px" }}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    )}
  </div>
);
}

export default App;