# Coffee Recipe App

## 概要

お気に入りのコーヒー抽出レシピを記録、共有、発見するための Web アプリケーションです。

フロントエンドは React、バックエンドは Spring Boot で構築されています。ユーザーはアカウントを作成して自作のレシピを投稿したり、他のユーザーが作成したレシピをお気に入りに登録したりすることができます。

## 主な機能

- **ユーザー認証**:
  - アカウント作成、ログイン・ログアウト機能
  - JWT (JSON Web Token) を利用したセキュアな認証
- **コーヒーレシピ管理**:
  - レシピの投稿（抽出方法、豆の種類、焙煎度、湯量、時間など）
  - 投稿したレシピの編集・削除
- **レシピ閲覧**:
  - 全ユーザーのレシピを一覧表示
  - 自分の投稿したレシピのみを表示
- **お気に入り機能**:
  - 気に入ったレシピをお気に入りに登録・解除

## 技術スタック

### フロントエンド

- [React](https://react.dev/) (v18.3)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Material-UI](https://mui.com/)
- [Axios](https://axios-http.com/) (HTTP クライアント)
- [ESLint](https://eslint.org/)

### バックエンド

- [Java](https://www.java.com/) (v21)
- [Spring Boot](https://spring.io/projects/spring-boot) (v3.4.1)
- [Spring Security](https://spring.io/projects/spring-security) (認証・認可)
- [MyBatis](https://mybatis.org/mybatis-3/) (O/R マッパー)
- [PostgreSQL](https://www.postgresql.org/)
- [H2 Database](https://www.h2database.com/) (開発用のインメモリデータベース)
- [JWT (Java JWT)](https://github.com/jwtk/jjwt)
- [Maven](https://maven.apache.org/)

## セットアップと実行方法

### 前提条件

- [Node.js](https://nodejs.org/) (v18 以上推奨)
- [JDK](https://adoptium.net/) (Java Development Kit) (v21)
- [Maven](https://maven.apache.org/)

### 1. バックエンド (Spring Boot API)

1.  **リポジトリのクローン**:

    ```bash
    git clone https://github.com/your-username/coffee-app.git
    cd coffee-app/service
    ```

2.  **Maven で依存関係をインストール**:

    ```bash
    mvn install
    ```

3.  **アプリケーションの起動**:
    ```bash
    mvn spring-boot:run
    ```
    API サーバーが `http://localhost:8080` で起動します。
    開発モードでは、H2 インメモリデータベースが使用されるため、別途データベースをセットアップする必要はありません。

### 2. フロントエンド (React App)

1.  **ディレクトリの移動**:

    ```bash
    cd ../front
    ```

2.  **依存関係のインストール**:

    ```bash
    npm install
    ```

3.  **開発サーバーの起動**:
    ```bash
    npm run dev
    ```
    アプリケーションが `http://localhost:5173` （またはターミナルに表示された別ポート）で起動し、ブラウザでアクセスできます。

## データベース設計

本アプリケーションでは以下の 4 つのテーブルを使用しています。

| テーブル名     | 説明                                                             |
| :------------- | :--------------------------------------------------------------- |
| `users`        | ユーザー情報を格納（メールアドレス、ハッシュ化パスワード）       |
| `recipes`      | コーヒーレシピの基本情報を格納（タイトル、抽出方法、豆の量など） |
| `recipe_steps` | レシピごとの抽出手順を格納（開始時間、湯量など）                 |
| `favorites`    | ユーザーとレシピのお気に入り関係を格納                           |

詳細なスキーマは `service/src/main/resources/schema.sql` を参照してください。

## API エンドポイント

### 公開エンドポイント (`/api/public`)

| メソッド | パス             | 説明                   |
| :------- | :--------------- | :--------------------- |
| `POST`   | `/login`         | ユーザーログイン       |
| `POST`   | `/signin`        | 新規アカウント作成     |
| `POST`   | `/all`           | 全てのレシピを取得     |
| `POST`   | `/refresh-token` | アクセストークンを更新 |

### 認証必須エンドポイント (`/api/private`)

| メソッド | パス        | 説明                        |
| :------- | :---------- | :-------------------------- |
| `POST`   | `/favorite` | レシピをお気に入り登録/解除 |
| `POST`   | `/delete`   | レシピを削除                |
| `POST`   | `/add`      | 新規レシピを追加            |
| `POST`   | `/edit`     | 既存レシピを編集            |
