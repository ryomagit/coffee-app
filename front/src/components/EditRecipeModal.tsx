import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Grid2,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CoffeeMakerRoundedIcon from "@mui/icons-material/CoffeeMakerRounded";
import {
  brewingMethodLabels,
  ERROR_MESSAGES,
  grindSizeLabels,
  roastLevelLabels,
} from "../Const";
import postRequest from "../utils/HttpUtil";

interface RecipeModalProps {
  open: boolean;
  onClose: () => void;
  selectedRecipe: CoffeeRecipe;
  setRecipes: Dispatch<SetStateAction<CoffeeRecipe[]>>;
}

interface StepError {
  error: boolean;
  helperText: string;
}

const EditRecipeModal: React.FC<RecipeModalProps> = ({
  open,
  onClose,
  selectedRecipe,
  setRecipes,
}) => {
  const [formData, setFormData] = useState<CoffeeRecipe>(selectedRecipe);

  const [titleError, setTitleError] = useState<String>("");

  const [stepErrors, setStepErrors] = useState<StepError[]>(
    formData.steps.map(() => ({
      error: false,
      helperText: "",
    }))
  );

  // 入力フィールドの変更処理
  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (field === "beanAmount" || field === "waterTemp") {
        const numValue = onlyNum(event.target.value);
        let trimValue = numValue;
        if (field === "beanAmount") {
          trimValue = numValue.slice(0, 2);
          trimValue = trimValue[0] === "0" ? trimValue.slice(-1) : trimValue;
        } else {
          const firstNum = numValue[0];
          trimValue =
            firstNum === "1" && numValue.length >= 3
              ? "100"
              : numValue.slice(0, 2);
          trimValue = trimValue[0] === "0" ? trimValue.slice(-1) : trimValue;
        }
        setFormData({ ...formData, [field]: trimValue });
      } else if (field === "title") {
        const newValue = event.target.value;
        const trimValue =
          newValue.length >= 50 ? newValue.slice(0, 50) : newValue;
        setFormData({ ...formData, [field]: trimValue });
      } else if (field === "memo") {
        const newValue = event.target.value;
        const trimValue =
          newValue.length >= 200 ? newValue.slice(0, 200) : newValue;
        setFormData({ ...formData, [field]: trimValue });
      } else {
        setFormData({ ...formData, [field]: event.target.value });
      }
    };

  // ステップ追加処理
  const handleAddStep = () => {
    const index = formData.steps.length + 1;
    if (index > 8) {
      alert("You can only add up to 8 steps.");
      return;
    }
    setFormData({
      ...formData,
      steps: [
        ...formData.steps,
        { id: index, recipeId: formData.id, startTime: "", waterAmount: 0 },
      ],
    });
  };

  //   全角数字を半角に変換、非数字除外
  const onlyNum = (value: string): string => {
    return value
      .replace(/[０-９]/g, (char) =>
        String.fromCharCode(char.charCodeAt(0) - 65248)
      ) // 全角 → 半角
      .replace(/\D/g, "");
  };

  // mm:ss形式にフォーマット
  const formatTime = (value: string): string => {
    // 全角数字を半角に変換し、非数字を除外
    const numericValue = onlyNum(value);
    // 最大4桁に制限
    const limitedValue = numericValue.slice(-4);

    if (limitedValue.length === 0) return ""; // 入力なし
    if (limitedValue.length <= 2) return `00:${limitedValue.padStart(2, "0")}`; // 秒のみ
    const minutes = limitedValue.slice(0, -2);
    const seconds = limitedValue.slice(-2);
    return `${minutes.padStart(2, "0")}:${seconds}`;
  };

  // 時系列整合性チェック
  const stepValidateTime = (start: string, end: string) => {
    const [startMinutes, startSeconds] = start.split(":").map(Number);
    const [endMinutes, endSeconds] = end.split(":").map(Number);
    const startTotalSeconds = startMinutes * 60 + startSeconds;
    const endTotalSeconds = endMinutes * 60 + endSeconds;
    return endTotalSeconds > startTotalSeconds;
  };
  // mm:ss形式チェック
  const stepValidateFormat = (inputTime: string) => {
    const [mm, ss] = inputTime.split(":").map(Number);
    return mm <= 59 && ss <= 59;
  };

  // ステップのバリデーション
  const handleStepBlur =
    (index: number, field: string) =>
    (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newStepErrors = [...stepErrors];
      if (field === "waterAmount") return;
      const setTime = event.target.value;
      const prevTime = formData.steps[index - 1].startTime;
      const nextTime = formData.steps[index + 1].startTime;

      if (!stepValidateFormat(setTime)) {
        newStepErrors[index] = {
          error: true,
          helperText: ERROR_MESSAGES.step_1,
        };
      } else if (!stepValidateTime(prevTime, setTime) && index !== 0) {
        newStepErrors[index] = {
          error: true,
          helperText: ERROR_MESSAGES.step_2,
        };
      } else {
        newStepErrors[index] = {
          error: false,
          helperText: "",
        };
      }
      if (nextTime !== "") {
        if (!stepValidateFormat(nextTime)) {
          newStepErrors[index + 1] = {
            error: true,
            helperText: ERROR_MESSAGES.step_1,
          };
        } else if (!stepValidateTime(setTime, nextTime)) {
          newStepErrors[index + 1] = {
            error: true,
            helperText: ERROR_MESSAGES.step_2,
          };
        } else {
          newStepErrors[index] = {
            error: false,
            helperText: "",
          };
        }
      }
      setStepErrors(newStepErrors);
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
          : parseInt(onlyNum(rawValue).slice(0, 3)).toString();

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
    const requestRecipe = formData;
    const filterdSteps = formData.steps.filter((step) => step.startTime !== "");
    requestRecipe.steps = filterdSteps;
    console.log(JSON.stringify({ filterdSteps }));
    postRequest("/private/edit", requestRecipe, (resData: CoffeeRecipe) => {
      if (resData != null) {
        setRecipes((prev) =>
          prev.map((recipe) => (recipe.id === resData.id ? resData : recipe))
        );
      }
      onClose();
    });
  };

  return (
    <Modal open={open}>
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
        {/* ヘッダー */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center", // 左右中央揃え
            alignItems: "center", // 垂直中央揃え
            height: "64px", // 高さを固定
            position: "relative", // relative を設定
          }}
        >
          {/* Coffee Recipe + アイコン */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center", // 垂直方向中央揃え
            }}
          >
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginRight: 1,
              }}
            >
              Coffee Recipe
            </Typography>
            <CoffeeMakerRoundedIcon />
          </Box>
        </Box>
        {/* モーダル全体の右上に配置するアイコンボタン */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute", // モーダル全体を基準に絶対配置
            top: "16px", // モーダルの上端からの距離
            right: "16px", // モーダルの右端からの距離
            zIndex: 2, // 他の要素より前面に配置
          }}
        >
          <CloseIcon />
        </IconButton>
        <Grid2 container spacing={2}>
          {/* タイトル */}
          <Grid2 size={12}>
            <TextField
              label="Title"
              variant="standard"
              value={formData.title}
              onChange={handleChange("title")}
              required
              onBlur={(e) => {
                e.target.value === ""
                  ? setTitleError("required")
                  : setTitleError("");
              }}
              error={titleError !== ""}
              helperText={titleError}
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
              label="Bean Amount"
              value={formData.beanAmount}
              onChange={handleChange("beanAmount")}
              onBlur={(e) => {
                const value = e.target.value;
                if (isNaN(Number(value))) {
                  e.target.value = ""; // 数字でない場合はクリア
                }
              }}
              fullWidth
              size="small"
              variant="standard"
            />
          </Grid2>

          {/* 湯温 */}
          <Grid2 size={3}>
            <TextField
              label="Water Temperature"
              value={formData.waterTemp}
              onChange={handleChange("waterTemp")}
              fullWidth
              size="small"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">℃</InputAdornment>
                  ),
                },
              }}
              variant="standard"
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
            <>
              <Box
                key={index}
                sx={{ display: "flex", gap: 2, marginBottom: 2 }}
              >
                <TextField
                  label="Start Time (mm:ss)"
                  value={step.startTime}
                  onChange={handleStepChange(index, "startTime")}
                  onBlur={handleStepBlur(index, "startTime")}
                  placeholder="mm:ss"
                  size="small"
                  error={stepErrors[index]?.error}
                  helperText={stepErrors[index]?.helperText}
                  slotProps={{
                    input: {
                      readOnly: index === 0 ? true : false,
                    },
                  }}
                  variant="standard"
                />
                <TextField
                  label="Water Amount"
                  type="number"
                  value={step.waterAmount}
                  onChange={handleStepChange(index, "waterAmount")}
                  size="small"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">ml</InputAdornment>
                      ),
                    },
                  }}
                  variant="standard"
                />
                <Button
                  onClick={() => handleRemoveStep(index)}
                  color="error"
                  disabled={index == 0}
                >
                  Remove
                </Button>
              </Box>
            </>
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={formData.title === ""}
          >
            Edit
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditRecipeModal;
