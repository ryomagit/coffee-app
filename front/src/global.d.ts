declare module "*.css" {
  const classes: { [key: string]: string };
  export default classes;
}

type CoffeeRecipeStep = {
  id: number;
  startTime: string; // mm:ss形式の開始時間
  endTime: string; // mm:ss形式の終了時間
  waterAmount: number; // 湯量（mL）
};

type CoffeeRecipe = {
  id: number; // レシピのid
  createdAt: string; // 投稿日（ISO8601形式などで扱う）
  title: string; // レシピのタイトル
  memo?: string; // メモ（任意）
  favoriteCount: number; // お気に入りされた数
  brewingMethod: number; // コーヒーを淹れる方法に対応した数字
  roastLevel: number; // 豆の焙煎度に対応した数字
  beanAmount: number; // 豆の量（g）
  grindSize: number; // 挽き目（1: Fine ～ 5: Coarse）
  waterTemp: number; // 湯温（摂氏）
  steps: CoffeeRecipeStep[]; // ステップの配列（最大8個まで）
  favorited: boolean;
};

type AlertInfo = {
  open: boolean;
  alertType: "info" | "warning" | "error" | "success";
  message: string;
};
