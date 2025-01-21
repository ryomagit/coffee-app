import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Grid2,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  brewingMethodLabels,
  grindSizeLabels,
  roastLevelLabels,
} from "../Const";

interface RecipeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (recipe: any) => void; // レシピ送信時の処理
}

const AddRecipeModal: React.FC<RecipeModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    memo: "",
    brewingMethod: 1,
    roastLevel: 1,
    grindSize: 1,
    beanAmount: 15,
    waterTemp: 95,
    steps: Array(3).fill({ startTime: "", endTime: "", waterAmount: 0 }), // 初期値で3つのステップ
  });

  // 入力フィールドの変更処理
  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: event.target.value });
    };

  // ステップ追加処理
  const handleAddStep = () => {
    if (formData.steps.length >= 8) {
      alert("You can only add up to 8 steps.");
      return;
    }
    setFormData({
      ...formData,
      steps: [
        ...formData.steps,
        { startTime: "", endTime: "", waterAmount: 0 },
      ],
    });
  };

  // mm:ss形式にフォーマット
  const formatTime = (value: string): string => {
    // 数字以外を削除し、先頭の不要な0を削除（ただし "0" だけは許容)
    const numericValue = value.replace(/\D/g, "").replace(/^0+(?!$)/, "");

    // 最大4桁に制限
    const limitedValue = numericValue.slice(-4);

    if (limitedValue.length === 0) return ""; // 入力なし
    if (limitedValue.length <= 2) return `00:${limitedValue.padStart(2, "0")}`; // 秒のみ
    const minutes = limitedValue.slice(0, -2);
    const seconds = limitedValue.slice(-2);
    return `${minutes.padStart(2, "0")}:${seconds}`;
  };

  // ステップの変更処理
  const handleStepChange =
    (index: number, field: string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value;

      // フォーマットを適用
      const formattedValue =
        field === "startTime" || field === "endTime"
          ? formatTime(rawValue)
          : rawValue;

      // ステップデータを更新
      const updatedSteps = formData.steps.map((step, i) =>
        i === index ? { ...step, [field]: formattedValue } : step
      );

      setFormData({ ...formData, steps: updatedSteps });
    };

  // ステップ削除処理
  const handleRemoveStep = (index: number) => {
    const updatedSteps = formData.steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps: updatedSteps });
  };

  // フォーム送信処理
  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      title: "",
      memo: "",
      brewingMethod: 1,
      roastLevel: 1,
      grindSize: 1,
      beanAmount: 0,
      waterTemp: 90,
      steps: [],
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          background: "#fff",
          boxShadow: 3,
          borderRadius: 3,
          padding: 4,
          maxHeight: "90vh", // モーダルの最大高さ
          overflow: "auto", // スクロールを可能にする
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <Typography variant="h6">Add New Recipe</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid2 container spacing={2}>
          {/* タイトル */}
          <Grid2 size={12}>
            <TextField
              label="Title"
              variant="outlined"
              value={formData.title}
              onChange={handleChange("title")}
              fullWidth
              size="small"
            />
          </Grid2>

          {/* 淹れ方と焙煎度 */}
          <Grid2 size={6}>
            <TextField
              select
              label="Brewing Method"
              value={formData.brewingMethod}
              onChange={handleChange("brewingMethod")}
              fullWidth
              size="small"
            >
              {Object.entries(brewingMethodLabels).map(([key, label]) => (
                <MenuItem key={key} value={Number(key)}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Grid2>
          <Grid2 size={6}>
            <TextField
              select
              label="Roast Level"
              value={formData.roastLevel}
              onChange={handleChange("roastLevel")}
              fullWidth
              size="small"
            >
              {Object.entries(roastLevelLabels).map(([key, label]) => (
                <MenuItem key={key} value={Number(key)}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Grid2>

          {/* 粒度と豆の量 */}
          <Grid2 size={6}>
            <TextField
              select
              label="Grind Size"
              value={formData.grindSize}
              onChange={handleChange("grindSize")}
              fullWidth
              size="small"
            >
              {Object.entries(grindSizeLabels).map(([key, label]) => (
                <MenuItem key={key} value={Number(key)}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Grid2>
          <Grid2 size={3}>
            <TextField
              label="Bean Amount (g)"
              type="number"
              value={formData.beanAmount}
              onChange={handleChange("beanAmount")}
              fullWidth
              size="small"
            />
          </Grid2>

          {/* 湯温 */}
          <Grid2 size={3}>
            <TextField
              label="Water Temperature (℃)"
              type="number"
              value={formData.waterTemp}
              onChange={handleChange("waterTemp")}
              fullWidth
              size="small"
            />
          </Grid2>

          {/* メモ */}
          <Grid2 size={12}>
            <TextField
              label="Memo"
              variant="outlined"
              value={formData.memo}
              onChange={handleChange("memo")}
              fullWidth
              multiline
              rows={2}
              size="small"
            />
          </Grid2>
        </Grid2>

        {/* ステップ入力 */}
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Steps
          </Typography>
          {formData.steps.map((step, index) => (
            <Box key={index} sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
              <TextField
                label="Start Time (mm:ss)"
                value={step.startTime}
                onChange={handleStepChange(index, "startTime")}
                placeholder="mm:ss"
                size="small"
              />
              <TextField
                label="End Time (mm:ss)"
                value={step.endTime}
                onChange={handleStepChange(index, "endTime")}
                placeholder="mm:ss"
                size="small"
              />
              <TextField
                label="Water Amount (mL)"
                type="number"
                value={step.waterAmount}
                onChange={handleStepChange(index, "waterAmount")}
                size="small"
              />
              <Button onClick={() => handleRemoveStep(index)} color="error">
                Remove
              </Button>
            </Box>
          ))}
          <Button onClick={handleAddStep} variant="outlined" fullWidth>
            Add Step
          </Button>
        </Box>

        {/* ボタン */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            marginTop: 3,
          }}
        >
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddRecipeModal;
