import { format } from "date-fns";

// ISO形式をYYYY-MM-DD形式に変換
// export const formatDate = (isoDate: string): string => {
//   const date = new Date(isoDate);
//   return format(date, "yyyy-MM-dd");
// };

export const getBackgroundStyle = (method: number) => {
  switch (method) {
    case 1: // Hand Drip
      return "linear-gradient(135deg, #d7a86e 0%, #f8e5c0 100%)"; // オレンジ系
    case 2: // French Press
      return "linear-gradient(135deg, #6f4e37 0%, #e3d5c0 100%)"; // 青系
    case 3: // Moka Pot
      return "linear-gradient(135deg, #ffa726 0%, #ef6c00 100%)"; // 緑系
    default:
      return "linear-gradient(135deg, #f6d365 0%, #fda085 100%)"; // デフォルト
  }
};

export const parseCoffeeRecipe = (json: any): CoffeeRecipe => {
  if (!json.id || !json.title || !Array.isArray(json.steps)) {
    throw new Error("Invalid JSON format");
  }

  // ステップの最大数チェック
  if (json.steps.length > 8) {
    throw new Error("Steps exceed the maximum allowed (8)");
  }

  return {
    id: json.id, // ID
    title: json.title,
    memo: json.memo || undefined,
    favoriteCount: json.favoriteCount || 0,
    brewingMethod: json.brewingMethod || 0,
    roastLevel: json.roastLevel || 0,
    beanAmount: json.beanAmount || 0,
    grindSize: json.grindSize || 0,
    waterTemp: json.waterTemp || 100,
    isFavorited: json.isFavorited || false,
    isOwner: json.isOwner || false,
    steps: json.steps.map((step: any) => ({
      startTime: step.startTime,
      endTime: step.endTime,
      waterAmount: step.waterAmount || 0,
    })),
    createdAt: json.createdAt, // 投稿日
  };
};
