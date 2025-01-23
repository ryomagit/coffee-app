CREATE TABLE users (
    mail_address VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (mail_address, password) VALUES ('example@example.com', '$2a$10$lUQMdmdVRtkeq5ekCuSwkuzsFz5v9SbgTCIjmJbJvuscOLHsFK5pC');

-- recipes テーブル
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,               -- 自動生成される ID
    created_at TIMESTAMP NOT NULL,       -- 投稿日時
    title VARCHAR(255) NOT NULL,         -- レシピのタイトル
    memo TEXT,                           -- メモ（任意）
    brewing_method INTEGER NOT NULL,     -- コーヒーを淹れる方法
    roast_level INTEGER NOT NULL,        -- 焙煎度
    bean_amount INTEGER NOT NULL,          -- 豆の量（g）
    grind_size INTEGER NOT NULL,         -- 挽き目（1: Fine ～ 5: Coarse）
    water_temp INTEGER NOT NULL,           -- 湯温（摂氏）
    author_mail_address VARCHAR(255) NOT NULL, -- 作者のメールアドレス
    CONSTRAINT fk_author FOREIGN KEY (author_mail_address) REFERENCES users (mail_address) ON DELETE CASCADE
);

Insert INTO recipes (created_at, title,memo,brewing_method,roast_level,bean_amount,grind_size,water_temp,author_mail_address)
 VALUES (now(), 'Morning Pour-Over', 'A light and balanced cup, perfect for mornings.', 1, 3, 20, 1, 95, 'example@example.com');

-- レシピのステップテーブル
CREATE TABLE recipe_steps (
    id SERIAL PRIMARY KEY,              -- 自動生成されるステップの ID
    recipe_id INTEGER NOT NULL,         -- 紐付くレシピの ID
    start_time VARCHAR(5) NOT NULL,     -- mm:ss 形式の開始時間
    end_time VARCHAR(5) NOT NULL,       -- mm:ss 形式の終了時間
    water_amount INTEGER NOT NULL,        -- 湯量（mL）
    CONSTRAINT fk_recipe FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
);

Insert INTO recipe_steps (recipe_id, start_time, end_time, water_amount) VALUES (1, '00:00','00:30',30),(1,'00:30','01:10',60);

-- お気に入りテーブル
CREATE TABLE favorites (
    user_mail_address VARCHAR(255) NOT NULL,        -- ユーザーのメールアドレス
    recipe_id INTEGER NOT NULL,              -- レシピの ID
    favorited_at TIMESTAMP NOT NULL,      -- お気に入り登録日時
    PRIMARY KEY (user_mail_address, recipe_id),     -- ユニーク制約
    CONSTRAINT fk_user FOREIGN KEY (user_mail_address) REFERENCES users (mail_address) ON DELETE CASCADE,
    CONSTRAINT fk_favorite FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
);

Insert INTO favorites (user_mail_address,recipe_id,favorited_at) VALUES('example@example.com',1,now());

