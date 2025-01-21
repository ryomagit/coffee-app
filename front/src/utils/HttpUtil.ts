import axios from "axios";

/**
 * POST専用の汎用リクエスト関数
 * @param {string} url - リクエスト先のURL
 * @param {Object} body - リクエストボディ
 * @param {Function} onSuccess - 成功時の処理を行うコールバック関数（引数にres.dataを渡す）
 */
const postRequest = async <T, R>(
  url: string,
  body: T,
  onSuccess: (data: R) => void
) => {
  try {
    const token = sessionStorage.getItem("token"); // 必要に応じてトークンを取得

    // POSTリクエストを送信
    const res = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    // 成功時の処理
    onSuccess(res.data); // コールバック関数にレスポンスデータを渡す
  } catch (error: any) {
    // エラー処理
    if (error.response) {
      // サーバーからのエラーレスポンスを表示
      alert(`Error: ${error.response.data}`);
    } else {
      // サーバーに接続できない場合やその他のエラー
      alert("An unexpected error occurred. Please try again.");
    }
  }
};

export default postRequest;
