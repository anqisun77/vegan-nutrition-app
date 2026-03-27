function NutritionCard({ data, addToMeal }) {
    const nutrients = data.nutrition.nutrients;

    function getNutrient(name) {
        return nutrients.find(n => n.name === name)?.amount || "N/A";
    }

    function handleAdd() {
        addToMeal({
            name: data.name,
            nutrients: nutrients
        });
    }

    return (
        <div 
            style={{
                marginTop: "20px", 
                border: "1px solid #ddd", 
                borderRadius:"12px",
                padding: "20px",
                maxWidth: "300px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
            }}
        >
            <h2 style={{ marginBottom: "15px" }}>
                {data.name} (100g)
            </h2>
            
            <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>Calorie</span>
                <span>{getNutrient("Calories")} kcal</span>
            </div>

            <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>Protein</span>
                <span>{getNutrient("Protein")} g</span>
            </div>
            
            <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>Carbs</span>
                <span>{getNutrient("Carbohydrates")} g</span>
            </div>
            
            <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>Fat</span>
                <span>{getNutrient("Fat")} g</span>
            </div>
            
            <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>Iron</span>
                <span>{getNutrient("Iron") || "N/A"} mg</span>
            </div>                    
            
            <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>Calcium</span>
                <span>{getNutrient("Calcium") || "N/A"} mg</span>
            </div>

            <button onClick={handleAdd}>
                Add to Meal
            </button>
        </div>
    );
}

export default NutritionCard;