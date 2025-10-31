import { Box, IconButton } from "@mui/material";
import axios from "axios";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { parseCoffeeRecipe } from "../utils/Util";
import RecipeModal from "./RecipeModal";
import RecipeCard from "./RecipeCard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddRecipeModal from "./AddRecipeModal";

interface originalProps {
  recipes: CoffeeRecipe[];
  setRecipes: Dispatch<SetStateAction<CoffeeRecipe[]>>;
}

const MyRecipe: React.FC<originalProps> = (props) => {
  const { recipes, setRecipes } = props;
  const [selectedRecipe, setSelectedRecipe] = useState<CoffeeRecipe | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [addRecipeModalOpen, setAddRecipeModalOpen] = useState(false);

  const myRecipes = recipes.filter((recipe) => recipe.isOwner);

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
    <>
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
        {myRecipes.map((recipe) => (
          <RecipeCard
            recipe={recipe}
            onClick={handleCardClick}
            key={recipe.id}
          />
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
      <IconButton
        size="large"
        onClick={() => setAddRecipeModalOpen(true)}
        sx={{
          position: "fixed",
          right: 16,
          bottom: 16,
          backgroundColor: "transparent",
        }}
      >
        <AddCircleIcon sx={{ fontSize: 60 }} />{" "}
        {/* アイコンサイズを大きくする */}
      </IconButton>
      {addRecipeModalOpen && (
        <AddRecipeModal
          open={addRecipeModalOpen}
          onClose={() => setAddRecipeModalOpen(false)}
          setRecipes={setRecipes}
        />
      )}
    </>
  );
};

export default MyRecipe;
