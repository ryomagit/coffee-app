import React from "react";
import { Card, Box, Typography, Chip } from "@mui/material";
import {
  brewingMethodLabels,
  roastLevelLabels,
  grindSizeLabels,
} from "../Const";
import { getBackgroundStyle } from "../utils/Util";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface RecipeCardProps {
  recipe: CoffeeRecipe;
  onClick: (recipe: CoffeeRecipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  return (
    <Card
      key={recipe.id}
      sx={{
        width: "100%",
        maxWidth: 300,
        height: 220, // 高さを調整
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: 2,
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s ease",
        background: getBackgroundStyle(recipe.brewingMethod),
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 2,
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
        },
      }}
      onClick={() => onClick(recipe)}
    >
      {/* タイトルとメモ */}
      <Box sx={{ marginBottom: 1 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: "bold",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis", // 長すぎるタイトルを省略
          }}
        >
          {recipe.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            opacity: 0.8,
            fontSize: "0.875rem",
            height: "2.6em", // メモ部分の固定高さ
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2, // 最大2行まで表示
            WebkitBoxOrient: "vertical",
          }}
        >
          {recipe.memo}
        </Typography>
      </Box>

      {/* 下部の情報表示 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <FavoriteIcon fontSize="small" sx={{ opacity: 0.8 }} />{" "}
            {recipe.favoriteCount}
          </Typography>
        </Box>

        {/* チップエリア */}
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            flexWrap: "wrap", // 長い場合は折り返し
          }}
        >
          <Chip
            label={brewingMethodLabels[recipe.brewingMethod]}
            size="small"
            sx={{
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              fontWeight: "bold",
            }}
          />
          <Chip
            label={roastLevelLabels[recipe.roastLevel]}
            size="small"
            sx={{
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              fontWeight: "bold",
            }}
          />
          <Chip
            label={grindSizeLabels[recipe.grindSize]}
            size="small"
            sx={{
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              fontWeight: "bold",
            }}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default RecipeCard;
