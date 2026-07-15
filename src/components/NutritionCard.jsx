import styles from '../App.module.css';

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
        <div className={styles.card}>

            <h2 className={styles.itemName}>
                {data.name} (100g)
            </h2>
            
            <div className={styles.totalGrid}>

                <span>Calorie</span>
                <strong>{getNutrient("Calories")} kcal</strong>
           
                <span>Protein</span>
                <strong>{getNutrient("Protein")} g</strong>
            
                <span>Carbs</span>
                <strong>{getNutrient("Carbohydrates")} g</strong>
            
                <span>Fat</span>
                <strong>{getNutrient("Fat")} g</strong>
            
                <span>Iron</span>
                <strong>{getNutrient("Iron") || "N/A"} mg</strong>
            
                <span>Calcium</span>
                <strong>{getNutrient("Calcium") || "N/A"} mg</strong>

            </div>

            <button 
                onClick={handleAdd}
                className={styles.button}
            >
                Add to Meal
            </button>
        </div>
    );
}

export default NutritionCard;