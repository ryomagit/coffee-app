import {
  Modal,
  Box,
  IconButton,
  Typography,
  Chip,
  Button,
  ModalOwnProps,
} from "@mui/material";
import React from "react";
import {
  brewingMethodLabels,
  roastLevelLabels,
  grindSizeLabels,
} from "../Const";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { getBackgroundStyle } from "../utils/Util";

interface RecipeModalProps {
  open: boolean;
  onClose: () => void;
  selectedRecipe: CoffeeRecipe;
}

const RecipeModal: React.FC<RecipeModalProps> = (props) => {
  const { open, onClose, selectedRecipe, ...rest } = props;
  return (
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
                {index + 1}. {step.startTime} ~ {step.endTime}{" "}
                {step.waterAmount}mL
              </Typography>
            ))}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "right", gap: 1 }}>
            <Button
              size="medium"
              startIcon={<FavoriteBorderIcon />}
              sx={{
                color: "#fff",
                marginTop: 2,
                borderColor: "rgba(255, 255, 255, 0.5)",
              }}
            >
              Add Favorites
            </Button>
            <Button
              size="medium"
              startIcon={<FavoriteIcon />}
              sx={{
                color: "#fff",
                marginTop: 2,
                borderColor: "rgba(255, 255, 255, 0.5)",
              }}
            >
              Remove from Favorites
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default RecipeModal;
