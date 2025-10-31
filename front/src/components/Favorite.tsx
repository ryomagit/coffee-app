import { Box } from "@mui/material";
import axios from "axios";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { parseCoffeeRecipe } from "../utils/Util";
import RecipeModal from "./RecipeModal";
import RecipeCard from "./RecipeCard";

interface originalProps {
  recipes: CoffeeRecipe[];
  setRecipes: Dispatch<SetStateAction<CoffeeRecipe[]>>;
}

const Favorite: React.FC<originalProps> = (props) => {
  const { recipes, setRecipes } = props;
  const [selectedRecipe, setSelectedRecipe] = useState<CoffeeRecipe | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const favoritedRecipes = recipes.filter((recipe) => recipe.isFavorited);

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
      {favoritedRecipes.map((recipe) => (
        <RecipeCard recipe={recipe} onClick={handleCardClick} key={recipe.id} />
      ))}

      {/* モーダル */}
      {selectedRecipe && (
        <RecipeModal
          open={modalOpen}
          onClose={handleCloseModal}
          selectedRecipe={selectedRecipe}
          setSelectedRecipe={setSelectedRecipe}
          setRecipes={setRecipes}
          isLogin={true}
        />
      )}
    </Box>
  );
};

export default Favorite;
