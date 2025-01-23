import axios from "axios";

/**
 * POST専用の汎用リクエスト関数
 * @param {string} url - リクエスト先のURL
 * @param {Object} body - リクエストボディ
 * @param {Function} onSuccess - 成功時の処理を行うコールバック関数（引数にres.dataを渡す）
 */
// const postRequest = async <T, R>(
//   url: string,
//   body: T,
//   onSuccess: (data: R) => void
// ) => {
//   try {
//     const token = sessionStorage.getItem("authToken"); // 必要に応じてトークンを取得

//     // POSTリクエストを送信
//     const res = await axios.post(url, body, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : undefined,
//       },
//     });

//     // 成功時の処理
//     onSuccess(res.data); // コールバック関数にレスポンスデータを渡す
//   } catch (error: any) {
//     // エラー処理
//     if (error.response) {
//       // サーバーからのエラーレスポンスを表示
//       alert(`Error: ${error.response.data}`);
//     } else {
//       // サーバーに接続できない場合やその他のエラー
//       alert("An unexpected error occurred. Please try again.");
//     }
//   }
// };

// const postRequest = async <T, R>(
//   url: string,
//   body: T,
//   onSuccess: (data: R) => void,
//   onError?: (error: any) => void,
//   requireAuth: boolean = true // デフォルトで認証を要求する
// ) => {
//   try {
//     const token = sessionStorage.getItem("authToken"); // 認証トークンを取得

//     if (requireAuth) {
//       // トークンが必要だが存在しない場合は例外をスロー
//       if (!token) {
//         throw new Error("Authentication required but no token found");
//       }
//     }

//     // POSTリクエストを送信
//     const res = await axios.post(url, body, {
//       headers: {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : undefined), // トークンがあればヘッダーに設定
//       },
//     });

//     // 成功時の処理
//     onSuccess(res.data);
//   } catch (error: any) {
//     if (error.response?.status === 401 && requireAuth) {
//       // トークンが期限切れの場合はリフレッシュトークンで更新を試みる
//       try {
//         const newToken = await refreshAccessToken();

//         if (newToken) {
//           sessionStorage.setItem("authToken", newToken);

//           // 再試行
//           const res = await axios.post(url, body, {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${newToken}`,
//             },
//           });

//           onSuccess(res.data);
//           return;
//         }
//       } catch (refreshError) {
//         console.error("Failed to refresh token:", refreshError);
//         if (onError) onError(refreshError);
//         return;
//       }
//     }

//     // その他のエラー処理
//     if (onError) {
//       onError(error);
//     } else {
//       alert("An unexpected error occurred. Please try again.");
//     }
//   }
// };

// const refreshAccessToken = async (): Promise<string | null> => {
//   try {
//     const res = await axios.post("/api/auth/refresh-token", null, {
//       withCredentials: true, // リフレッシュトークンは HttpOnly Cookie に保存されている
//     });

//     const newToken = res.data.accessToken;
//     if (newToken) {
//       sessionStorage.setItem("authToken", newToken); // 新しいトークンを保存
//       return newToken;
//     }
//     return null;
//   } catch (error) {
//     console.error("Failed to refresh access token:", error);
//     return null; // トークンリフレッシュに失敗した場合
//   }
// };

const postRequest = async <T, R>(
  url: string,
  body: T,
  onSuccess: (data: R) => void,
  onError?: (error: any) => void
) => {
  try {
    // POSTリクエストを送信
    const res = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

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

axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;

      try {
        const refreshResponse = await axios.post(
          "/api/public/refresh-token",
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

        // リフレッシュトークンが無効ならログイン画面へリダイレクト
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default postRequest;
