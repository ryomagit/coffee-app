import { Box } from "@mui/material";
import axios from "axios";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { parseCoffeeRecipe } from "../utils/Util";
import RecipeModal from "./RecipeModal";
import RecipeCard from "./RecipeCard";
import postRequest from "../utils/HttpUtil";

interface OriginalProps {
  isLogin: boolean;
  recipes: CoffeeRecipe[];
  setRecipes: Dispatch<SetStateAction<CoffeeRecipe[]>>;
}

const All: React.FC<OriginalProps> = (props) => {
  const { isLogin, recipes, setRecipes } = props;

  const [selectedRecipe, setSelectedRecipe] = useState<CoffeeRecipe | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  // サーバーからレシピを取得
  useEffect(() => {
    postRequest("/public/all", undefined, (resData: CoffeeRecipe[]) => {
      console.dir(resData);
      setRecipes(resData);
    });
  }, [isLogin]);

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
    // <Box sx={{ padding: 3, display: "flex", flexWrap: "wrap", gap: 3 }}>
    <Box
      sx={{
        padding: 3,
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr", // スマホ
          sm: "repeat(2, 1fr)", // タブレット
          md: "repeat(3, 1fr)", // PC
        },
        gap: 2,
        justifyContent: "center",
      }}
    >
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} onClick={handleCardClick} />
      ))}

      {/* モーダル */}
      {selectedRecipe && (
        <RecipeModal
          open={modalOpen}
          onClose={handleCloseModal}
          selectedRecipe={selectedRecipe}
          setSelectedRecipe={setSelectedRecipe}
          setRecipes={setRecipes}
          isLogin={isLogin}
        />
      )}
    </Box>
  );
};

export default All;
