import { supabase } from './supabaseClient';
import styles from './App.module.css';
import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import NutritionCard from './components/NutritionCard';

function App() {
  const [ingredient, setIngredient] = useState("");
  const [nutrition, setNutrition] = useState(null);
  const [error, setError] = useState("");
  const [mealItems, setMealItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountError, setAccountError] = useState("");
  const [user, setUser] = useState(null);

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

  async function handleSignUp() {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setAccountError(error.message);
        return;
      }

      setAccountError("");

    } catch (err) {
      setAccountError("Something went wrong.");
    }
  }

  async function handleLogin() {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setAccountError(error.message);
        return;
      }

      setAccountError("");

    } catch (err) {
      setAccountError("Something went wrong.");
    }
  }

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) { 
        setAccountError(error.message); 
      }
      setMealItems([]);
    } catch (err) { 
      setAccountError("Something went wrong.");
    }
  }

  async function handleSaveMeal() {
    try{
      const { error } = await supabase
        .from("saved_meals")
        .insert({
          user_id: user.id,
          meal_data: mealItems
      });

      if (error) {
        setAccountError(error.message);
        return;
      }

      alert("Meal saved.");

    } catch (err) {
      setAccountError("Something went wrong.");
    }
  }

  async function handleLoadMeals() {
    try{
        const { data, error } = await supabase
             .from("saved_meals")
             .select("*")
             .eq("user_id", user.id)
             .order("id", { ascending: false });

        if (error) { 
           setAccountError(error.message);
           return;
       }

       setMealItems(data[0].meal_data);

    } catch(err) {
       setAccountError("Something went wrong.");
     }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({data: {session}}) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  return (
  <div className={styles.page}>

    <div className={styles.container}>

    <h1 className={styles.title}>
      🌱 Plant-based Nutrition Intelligence
    </h1>

    <p className={styles.subTitle}>
      Build smarter meals and track essential nutrients with ease.
    </p>

  <div>
    {user ? (
      <>
        <p>Welcome, {user.email}</p>

        <button onClick={handleLogout} className={styles.button}>Log Out</button>

        {mealItems.length > 0 && (
          <button onClick={handleSaveMeal}>Save Meal</button>
        )}

        {user && (
          <button onClick={handleLoadMeals}>Load Meals</button>
        )}
      </>
    ) : (
      <>
        <h2>Create Account</h2>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
          type="email"
        /> 
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          type="password"
        />
        <button onClick={handleSignUp} className={styles.button}>Sign Up</button>
        <button onClick={handleLogin} className={styles.button}>Log In</button>
      </>
    )}
  </div>  

    {accountError && <p className={styles.errorMessage}>{accountError}</p>}

  <div className={styles.searchBox}>
    <h2 className={styles.sectionHeading}>Search Ingredient</h2>

    <SearchBar
      ingredient={ingredient}
      setIngredient={setIngredient}
      handleSearch={handleSearch}
    />
  </div>

    {error && (
      <p className={styles.errorMessage}>
        ⚠️{error}
      </p>
    )}

    {nutrition && (
      <NutritionCard data={nutrition} addToMeal={addToMeal} />
    )}

    {isLoading && (
      <p className={styles.loadingMessage}>
        Loading nutrition data...
      </p>
    )}

    {/* Total Nutrition */}
    {mealItems.length > 0 && (
      <div className={styles.card}>
        <h2 className={styles.sectionHeading}>
          🍽️ Total Meal Nutrition
        </h2>

        {/* Grid Starts Here */}
        <div className={styles.totalGrid}>

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
      <div className={styles.mealBuilder}>
        <h2 className={styles.sectionHeading}>Meal Builder</h2>

      <div className={styles.mealList}>
        {mealItems.map((item, index) => {

          function getNutrient(name) {
            return (
              item.nutrients.find(n => n.name === name)?.amount || "N/A"
            );
          }

          return (
            <div 
              key={index}
              className={styles.card}
            >
              <h3 className={styles.itemName}>{item.name} (100g)</h3>

              <p className={styles.itemDetail}>Calories: {getNutrient("Calories")} kcal</p>
              <p className={styles.itemDetail}>Protein: {getNutrient("Protein")} g</p>
              <p className={styles.itemDetail}>Carbs: {getNutrient("Carbohydrates")} g</p>
              <p className={styles.itemDetail}>Fat: {getNutrient("Fat")} g</p>
              <p className={styles.itemDetail}>Iron: {getNutrient("Iron")} mg</p>
              <p className={styles.itemDetail}>Calcium: {getNutrient("Calcium")} mg</p>

              <button 
                onClick={() => removeFromMeal(index)}
                className={styles.removeButton}
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