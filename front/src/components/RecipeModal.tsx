import {
  Modal,
  Box,
  IconButton,
  Typography,
  Chip,
  Button,
  ModalOwnProps,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  brewingMethodLabels,
  roastLevelLabels,
  grindSizeLabels,
} from "../Const";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import { getBackgroundStyle } from "../utils/Util";
import postRequest from "../utils/HttpUtil";
import ConfirmModal from "./ConfirmModal";
import EditRecipeModal from "./EditRecipeModal";

interface RecipeModalProps {
  open: boolean;
  onClose: () => void;
  selectedRecipe: CoffeeRecipe;
  setSelectedRecipe: Dispatch<SetStateAction<CoffeeRecipe | null>>;
  setRecipes: Dispatch<SetStateAction<CoffeeRecipe[]>>;
  isLogin: boolean;
}

const RecipeModal: React.FC<RecipeModalProps> = (props) => {
  const {
    open,
    onClose,
    selectedRecipe,
    setSelectedRecipe,
    isLogin,
    setRecipes,
    ...rest
  } = props;

  const [alertDeleteOpen, setAlertDeleteOpen] = useState<boolean>(false);

  const [editRecipeModalOpen, setEditRecipeModalOpen] =
    useState<boolean>(false);

  const handleFavorite = (recipeId: number, favorited: boolean) => {
    const requestBody = {
      recipeId,
      favorited,
    };
    postRequest("/private/favorite", requestBody, (resData: favoriteRes) => {
      const newFavoritedStatus = resData.favorited;
      selectedRecipe.isFavorited = newFavoritedStatus;
      selectedRecipe.favoriteCount =
        selectedRecipe.favoriteCount + (newFavoritedStatus ? 1 : -1);
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe.id === selectedRecipe.id // 更新対象のレシピのみ更新
            ? {
                ...recipe,
                isFavorited: newFavoritedStatus, // `newFavoritedValue` を true または false に設定
                favoriteCount:
                  newFavoritedStatus !== recipe.isFavorited
                    ? recipe.favoriteCount + (newFavoritedStatus ? 1 : -1)
                    : recipe.favoriteCount, // 状態が変更された場合のみ更新
              }
            : recipe
        )
      );
    });
  };

  const handleDelete = (recipeId: number) => {
    const requestBody = { recipeId };
    postRequest("/private/delete", requestBody, (resData: any) => {
      const deleteId = resData.deleteId;
      setRecipes((prev) => prev.filter((recipe) => recipe.id != deleteId));
      onClose();
      // setAlertDeleteOpen(false);
    });
  };
  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            background: getBackgroundStyle(selectedRecipe.brewingMethod),
            color: "#fff", // テキスト色
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // カードと同じシャドウ
            borderRadius: 2, // カードと統一
            overflow: "hidden",
            paddingY: 2,
            paddingX: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "right" }}>
            <IconButton onClick={onClose} sx={{ color: "#fff" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box>
            <Typography
              variant="h6"
              component="div"
              gutterBottom
              sx={{ textAlign: "center" }}
            >
              {selectedRecipe.title}
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                textAlign: "right",
                fontSize: "0.875rem",
              }}
            >
              {new Date(selectedRecipe.createdAt).toLocaleDateString()}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                marginY: 2,
                justifyContent: "center",
                flexWrap: "wrap", // 折り返しを追加
              }}
            >
              <Typography
                variant="body2"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "rgba(255, 255, 255, 0.9)",
                }}
              >
                <FavoriteIcon fontSize="small" /> {selectedRecipe.favoriteCount}
              </Typography>
              <Chip
                label={brewingMethodLabels[selectedRecipe.brewingMethod]}
                size="small"
                sx={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              />
              <Chip
                label={roastLevelLabels[selectedRecipe.roastLevel]}
                size="small"
                sx={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              />
              <Chip
                label={grindSizeLabels[selectedRecipe.grindSize]}
                size="small"
                sx={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              />
            </Box>

            <Box sx={{ marginLeft: 2 }}>
              <Typography variant="body2" gutterBottom>
                {selectedRecipe.beanAmount}g Beans
              </Typography>
              <Typography variant="body2" gutterBottom>
                {selectedRecipe.waterTemp}℃ Water
              </Typography>
              <Typography variant="body2" gutterBottom>
                {selectedRecipe.memo || ""}
              </Typography>
              {selectedRecipe.steps.map((step, index) => (
                <Typography key={index} variant="body2">
                  {index + 1}. {step.startTime} ~{step.waterAmount}mL
                </Typography>
              ))}
            </Box>

            {isLogin && (
              <Box sx={{ display: "flex", justifyContent: "right", gap: 1 }}>
                {!selectedRecipe.isFavorited && !selectedRecipe.isOwner && (
                  <Button
                    size="medium"
                    startIcon={<FavoriteBorderIcon />}
                    sx={{
                      color: "#fff",
                      marginTop: 2,
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)", // ホバー時の背景色
                      },
                    }}
                    onClick={() =>
                      handleFavorite(
                        selectedRecipe.id,
                        selectedRecipe.isFavorited
                      )
                    }
                  >
                    Add Favorites
                  </Button>
                )}
                {selectedRecipe.isFavorited && !selectedRecipe.isOwner && (
                  <Button
                    size="medium"
                    startIcon={<FavoriteIcon />}
                    sx={{
                      color: "#fff",
                      marginTop: 2,
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)", // ホバー時の背景色
                      },
                    }}
                    onClick={() =>
                      handleFavorite(
                        selectedRecipe.id,
                        selectedRecipe.isFavorited
                      )
                    }
                  >
                    Remove from Favorites
                  </Button>
                )}
                {/* //作成したレシピの場合は編集ボタン表示 */}
                {selectedRecipe.isOwner ? (
                  <Button
                    size="medium"
                    startIcon={<EditNoteIcon />}
                    sx={{
                      color: "#fff",
                      marginTop: 2,
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)", // ホバー時の背景色
                      },
                    }}
                    onClick={() => setEditRecipeModalOpen(true)}
                  >
                    edit
                  </Button>
                ) : null}
                {/* //作成したレシピの場合は削除ボタン表示 */}
                {selectedRecipe.isOwner ? (
                  <Button
                    size="medium"
                    startIcon={<DeleteIcon />}
                    sx={{
                      color: "#fff",
                      marginTop: 2,
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)", // ホバー時の背景色
                      },
                    }}
                    onClick={() => setAlertDeleteOpen(true)}
                  >
                    delete
                  </Button>
                ) : null}
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
      <ConfirmModal
        open={alertDeleteOpen}
        onClose={() => setAlertDeleteOpen(false)}
        handleYes={() => handleDelete(selectedRecipe.id)}
        message="Are you sure you want to delete?"
      ></ConfirmModal>
      <EditRecipeModal
        open={editRecipeModalOpen}
        onClose={onClose}
        selectedRecipe={selectedRecipe}
        setRecipes={setRecipes}
      ></EditRecipeModal>
    </>
  );
};

export default RecipeModal;
