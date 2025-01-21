import { Box } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { parseCoffeeRecipe } from "../utils/Util";
import RecipeModal from "./RecipeModal";
import RecipeCard from "./RecipeCard";

// 仮のデータ
const mockData = [
  {
    id: "1",
    title: "Morning Pour-Over",
    memo: "A light and balanced cup, perfect for mornings.",
    favoriteCount: 120,
    brewingMethod: 1,
    roastLevel: 3,
    beanAmount: 20,
    grindSize: 1,
    waterTemp: 95,
    steps: [
      { startTime: "00:00", endTime: "00:30", waterAmount: 50 },
      { startTime: "00:30", endTime: "01:00", waterAmount: 100 },
      { startTime: "01:00", endTime: "01:30", waterAmount: 100 },
    ],
    createdAt: "2023-12-25T10:00:00Z",
  },
  {
    id: "2",
    title: "Afternoon Espresso",
    memo: "Rich and bold, perfect for a mid-day boost.",
    favoriteCount: 85,
    brewingMethod: 2,
    roastLevel: 5,
    beanAmount: 18,
    grindSize: 1,
    waterTemp: 95,
    steps: [
      { startTime: "00:00", endTime: "00:20", waterAmount: 30 },
      { startTime: "00:20", endTime: "00:40", waterAmount: 60 },
    ],
    createdAt: "2023-12-24T14:00:00Z",
  },
];

const All: React.FC = () => {
  const [recipes, setRecipes] = useState<CoffeeRecipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<CoffeeRecipe | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  // サーバーからレシピを取得
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        //   const response = await axios.get("https://api.example.com/recipes");
        //   setRecipes(response.data); // レスポンスに基づいてデータをセット
        const parsedRecipes = mockData.map((data) => parseCoffeeRecipe(data));
        setRecipes(parsedRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchRecipes();
  }, []);

  // モーダルを開く
  const handleCardClick = (recipe: CoffeeRecipe) => {
    setSelectedRecipe(recipe);
    setModalOpen(true);
  };

  // モーダルを閉じる
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <Box sx={{ padding: 3, display: "flex", flexWrap: "wrap", gap: 3 }}>
      {recipes.map((recipe) => (
        <RecipeCard recipe={recipe} onClick={handleCardClick} />
      ))}

      {/* モーダル */}
      {selectedRecipe && (
        <RecipeModal
          open={modalOpen}
          onClose={handleCloseModal}
          selectedRecipe={selectedRecipe}
        />
      )}
    </Box>
  );
};

export default All;
