import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  createTheme,
  Tab,
  Tabs,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import CoffeeMakerRoundedIcon from "@mui/icons-material/CoffeeMakerRounded";
import FormModal from "./components/FormModal";
import "./App.css";
import All from "./components/All";
import Favorite from "./components/Favorite";
import MyRecipe from "./components/MyRecipe";
import LogoutModal from "./components/LogoutModal";
import AlertModal from "./components/AlertModal";

const getCSSVariable = (variable: string) => {
  let value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();

  // 再帰的にCSS変数を解決
  while (value.startsWith("var(")) {
    const nestedVariable = value.slice(4, -1).trim(); // "var(--xxx)" から "--xxx" を抽出
    value = getComputedStyle(document.documentElement)
      .getPropertyValue(nestedVariable)
      .trim();
  }

  if (!value) {
    console.error(`CSS変数 "${variable}" が未定義または空です。`);
  }

  return value;
};

const MainPage: React.FC = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: getCSSVariable("--c-button-primary"), // ボタンのメインカラー
        dark: getCSSVariable("--c-button-primary-hover"),
        contrastText: getCSSVariable("--c-bg-base"), // ボタン文字色を白に指定
      },
      text: {
        primary: getCSSVariable("--c-text-body"), // テキストのメインカラー
        secondary: getCSSVariable("--c-text-low-priority"), // テキストのサブカラー
      },
      background: {
        default: getCSSVariable("--c-bg-base"), // 背景色
        paper: getCSSVariable("--c-bg-neutral-lightest"), // ペーパーの背景
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: getCSSVariable("--rounded-full"), // CSS変数を使用
            textTransform: "none", // タブの文字を大文字化しない
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none", // タブの文字を大文字化しない
          },
        },
      },
    },
  });

  /**ログイン有無state */
  const [isLogin, setIsLogin] = useState<boolean>(false);
  /**タブ制御state */
  const [activeTag, setActiveTag] = useState<number>(0);
  /**レシピstate */
  const [recipes, setRecipes] = useState<CoffeeRecipe[]>([]);
  /**タブ変更関数 */
  const handelTabChange = (_: React.SyntheticEvent, newValue: number) => {
    if ((newValue == 1 || newValue == 2) && !isLogin) {
      setAlertInfo((prev) => ({
        ...prev,
        open: true,
        alertType: "warning",
        message: "You need to log in to access this feature.",
      }));
    } else {
      setActiveTag(newValue);
    }
  };
  /**ログインモーダル制御state */
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  /**ログアウト確認モーダル制御state */
  const [logoutOpen, setLogoutOpen] = useState<boolean>(false);
  /**アラートモーダルstate */
  const [alertInfo, setAlertInfo] = useState<AlertInfo>({
    open: false,
    alertType: "info",
    message: "",
  });

  const handleLogout = () => {
    sessionStorage.removeItem("authToken"); // トークンを削除
    setIsLogin(false);
    setLogoutOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      {/* ヘッダー */}
      <Container maxWidth="xl" sx={{ paddingX: 1 }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: "transparent", // 背景を透明化
            color: "var(--c-text-body)",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  flexGrow: 1,
                  marginRight: 1,
                }}
              >
                Coffee Recipe
              </Typography>
              <CoffeeMakerRoundedIcon />
            </Box>
            <Box>
              {!isLogin ? (
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => setLoginOpen(true)}
                >
                  Log in
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => setLogoutOpen(true)}
                >
                  Log out
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </Container>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Container maxWidth="xl" sx={{ paddingX: 3 }}>
          <Tabs
            value={activeTag}
            onChange={handelTabChange}
            textColor="inherit" // テーマの影響を排除
            TabIndicatorProps={{
              style: { backgroundColor: "#000000d1" }, // 選択タブの下線の色
            }}
            sx={{
              paddingLeft: 0,
              "& .MuiTab-root": { fontSize: "0.8rem" }, // タブのフォントサイズ変更
              "& .Mui-selected": { fontWeight: "bold" }, // 選択中のタブのスタイル
              // "& .MuiTabs-indicator": { backgroundColor: "green" }, // インジケーターの色をテーマ以外に変更
            }}
          >
            <Tab label="All" />
            <Tab label="Favorite" />
            <Tab label="MyRecipe" />
          </Tabs>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ paddingX: 1 }}>
        <Box flexGrow={1} sx={{ paddingLeft: 1 }}>
          {activeTag == 0 && (
            <All isLogin={isLogin} recipes={recipes} setRecipes={setRecipes} />
          )}
          {activeTag == 1 && (
            <Favorite recipes={recipes} setRecipes={setRecipes} />
          )}
          {activeTag == 2 && (
            <MyRecipe recipes={recipes} setRecipes={setRecipes} />
          )}
        </Box>

        <FormModal
          open={loginOpen}
          handleClose={() => setLoginOpen(false)}
          setIsLogin={setIsLogin}
        />

        <LogoutModal
          handleLogout={handleLogout}
          open={logoutOpen}
          setOpen={setLogoutOpen}
        />

        <AlertModal alertInfo={alertInfo} setAlertInfo={setAlertInfo} />
      </Container>
    </ThemeProvider>
  );
};

export default MainPage;
