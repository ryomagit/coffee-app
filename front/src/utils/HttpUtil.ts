import axios, { AxiosInstance } from "axios";

/**
 * POST専用の汎用リクエスト関数
 * @param {string} url - リクエスト先のURL
 * @param {Object} body - リクエストボディ
 * @param {Function} onSuccess - 成功時の処理を行うコールバック関数（引数にres.dataを渡す）
 */

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // APIのベースURLを指定
  withCredentials: true, // Cookieを送信する場合に必要
  headers: {
    "Content-Type": "application/json", // デフォルトヘッダー
  },
});
const postRequest = async <T, R>(
  url: string,
  body: T,
  onSuccess: (data: R) => void,
  onError?: (error: any) => void
) => {
  try {
    // POSTリクエストを送信
    const res = await axiosInstance.post(url, body);

    // 成功時の処理
    onSuccess(res.data);
  } catch (error) {
    // エラー時の処理
    if (onError) {
      onError(error);
    } else {
      console.error("An error occurred:", error);
    }
  }
};

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("Interceptor triggered:", error); // フローの確認
    if (error.response?.status === 401 && !error.config._refreshAttempted) {
      error.config._refreshAttempted = true;

      try {
        const refreshResponse = await axiosInstance.post(
          "/public/refresh-token",
          null,
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;

        // 新しいアクセストークンを保存
        sessionStorage.setItem("authToken", newAccessToken);

        // 元のリクエストを再送
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios.request(error.config);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        sessionStorage.removeItem("authToken");
        // リフレッシュトークンが無効ならログイン画面へリダイレクト
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default postRequest;
