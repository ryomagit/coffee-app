import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  createTheme,
  Modal,
  Tab,
  Tabs,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import CoffeeMakerRoundedIcon from "@mui/icons-material/CoffeeMakerRounded";
import FormCard from "./components/FormCard";
import "./App.css";
import All from "./components/All";
import Favorite from "./components/Favorite";
import MyRecipe from "./components/MyRecipe";

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
  /**タブ変更関数 */
  const handelTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTag(newValue);
  };
  /**ログインモーダル制御state */
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  /**ログアウト確認モーダル制御state */
  const [logoutOpen, setLogoutOpen] = useState<boolean>(false);

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
          {activeTag == 0 && <All />}
          {activeTag == 1 && <Favorite />}
          {activeTag == 2 && <MyRecipe />}
        </Box>

        <Modal open={loginOpen} aria-labelledby="login-modal-title">
          <FormCard
            open={loginOpen}
            handleClose={() => setLoginOpen(false)}
            setIsLogin={setIsLogin}
          />
        </Modal>

        {logoutOpen && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 2,
            }}
          >
            {/* Cardでログイン画面 */}
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      marginRight: 1,
                    }}
                  >
                    Coffee Recipe
                  </Typography>
                  <CoffeeMakerRoundedIcon sx={{ color: "#000000d1" }} />
                </Box>
                <p>Are you sure you want to log out?</p>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={handleLogout}
                >
                  OK
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setLogoutOpen(false)}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default MainPage;
