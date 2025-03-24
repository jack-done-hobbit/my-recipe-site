import React, { useState, useEffect } from "react";
import recipesData from "./data/recipes.json";
import "./App.css"; // CSSファイルを追加

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchIngredients, setSearchIngredients] = useState("");
  const [minTotalCost, setMinTotalCost] = useState("");
  const [maxTotalCost, setMaxTotalCost] = useState("");
  const [minCostPerServing, setMinCostPerServing] = useState("");
  const [maxCostPerServing, setMaxCostPerServing] = useState("");
  const [ingredientSearchMode, setIngredientSearchMode] = useState("OR");

  useEffect(() => {
    setRecipes(recipesData);
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    const totalCost = recipe.ingredients.reduce((sum, ing) => sum + ing.cost, 0);
    const costPerServing = recipe.servings ? totalCost / recipe.servings : 0;

    if (searchName && !recipe.name.includes(searchName)) return false;

    if (searchIngredients) {
      const keywords = searchIngredients.split(" ").filter(Boolean);
      if (keywords.length > 0) {
        if (ingredientSearchMode === "OR") {
          const hasIngredient = keywords.some(keyword =>
            recipe.ingredients.some(ing => ing.item.includes(keyword))
          );
          if (!hasIngredient) return false;
        } else {
          const hasAllIngredients = keywords.every(keyword =>
            recipe.ingredients.some(ing => ing.item.includes(keyword))
          );
          if (!hasAllIngredients) return false;
        }
      }
    }

    if (minTotalCost && totalCost < Number(minTotalCost)) return false;
    if (maxTotalCost && totalCost > Number(maxTotalCost)) return false;
    if (minCostPerServing && costPerServing < Number(minCostPerServing)) return false;
    if (maxCostPerServing && costPerServing > Number(maxCostPerServing)) return false;

    return true;
  });

  return (
    <div className="container">
      <h1>レシピ一覧</h1>

      {/* 🔍 検索フォーム */}
      <div className="search-section">
        <input type="text" placeholder="料理名で検索" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        <input type="text" placeholder="材料（スペース区切りで複数検索可）" value={searchIngredients} onChange={(e) => setSearchIngredients(e.target.value)} />
        <select onChange={(e) => setIngredientSearchMode(e.target.value)} value={ingredientSearchMode}>
          <option value="OR">材料 OR検索</option>
          <option value="AND">材料 AND検索</option>
        </select>
        <input type="number" placeholder="最小 料理全体の原価" value={minTotalCost} onChange={(e) => setMinTotalCost(e.target.value)} />
        <input type="number" placeholder="最大 料理全体の原価" value={maxTotalCost} onChange={(e) => setMaxTotalCost(e.target.value)} />
        <input type="number" placeholder="最小 1人前の原価" value={minCostPerServing} onChange={(e) => setMinCostPerServing(e.target.value)} />
        <input type="number" placeholder="最大 1人前の原価" value={maxCostPerServing} onChange={(e) => setMaxCostPerServing(e.target.value)} />
      </div>

      {/* 📋 レシピ一覧 */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>画像</th>
              <th>料理名</th>
              <th>材料</th>
              <th>分量</th>
              <th>原価</th>
              <th>何人前か</th>
              <th>料理全体の原価</th>
              <th>1人前あたりの原価</th>
              <th>料理のグラム数</th>
              <th>動画</th>
              <th>登録日時</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecipes.map((recipe, index) => {
              const totalCost = recipe.ingredients.reduce((sum, ing) => sum + ing.cost, 0);
              const costPerServing = recipe.servings ? totalCost / recipe.servings : 0;

              return recipe.ingredients.map((ing, i) => (
                <tr key={`${index}-${i}`}>
                  {i === 0 && (
                    <td rowSpan={recipe.ingredients.length}>
                        <img
                            src={recipe.imageUrl ? `${process.env.PUBLIC_URL}/${recipe.imageUrl}` : `${process.env.PUBLIC_URL}/images/default.jpg`}
                            alt={recipe.name}
                            className="recipe-img"
                        />
                    </td>
                    
                  )}
                  {i === 0 && <td rowSpan={recipe.ingredients.length}>{recipe.name}</td>}
                  <td>{ing.item}</td>
                  <td>{ing.amount}</td>
                  <td>{ing.cost}円</td>
                  {i === 0 && (
                    <>
                      <td rowSpan={recipe.ingredients.length}>{recipe.servings}人前</td>
                      <td rowSpan={recipe.ingredients.length}>{totalCost}円</td>
                      <td rowSpan={recipe.ingredients.length}>{costPerServing.toFixed(2)}円</td>
                      <td rowSpan={recipe.ingredients.length}>{recipe.weight}g</td>
                      <td rowSpan={recipe.ingredients.length}>
                        <a href={recipe.videoUrl} target="_blank" rel="noopener noreferrer">動画を見る</a>
                      </td>
                      <td rowSpan={recipe.ingredients.length}>{recipe.registeredAt}</td>
                    </>
                  )}
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;