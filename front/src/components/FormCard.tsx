import React, { useState } from "react";
import {
  Modal,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import CoffeeMakerRoundedIcon from "@mui/icons-material/CoffeeMakerRounded";
import ClearIcon from "@mui/icons-material/Clear";
import LoginForm from "./LoginForm";
import SigninForm from "./SigninForm";

interface LoginModalProps {
  open: boolean;
  handleClose: () => void;
  setIsLogin: (isLogin: boolean) => void;
}
const FormCard: React.FC<LoginModalProps> = ({
  open,
  handleClose,
  setIsLogin,
}) => {
  const [signin, setSignin] = useState<boolean>(false);

  return (
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
              sx={{ fontSize: "1.2rem", fontWeight: "bold", marginRight: 1 }}
            >
              Coffee Recipe
            </Typography>
            <CoffeeMakerRoundedIcon sx={{ color: "#000000d1" }} />
          </Box>
          {!signin ? (
            <LoginForm handleClose={handleClose} setIsLogin={setIsLogin} />
          ) : (
            <SigninForm handleClose={handleClose} setSignin={setSignin} />
          )}

          <Typography
            align="left"
            sx={{
              marginTop: 1,
              color: "var(--c-general-primary)",
              fontSize: "0.7rem",
              cursor: "pointer",
              textDecoration: "none", // 通常時は下線を非表示
              "&:hover": {
                textDecoration: "underline", // ホバー時に下線を表示
              },
            }}
            onClick={() => setSignin(!signin)}
          >
            {!signin ? "Create Account" : "Already have an account? Log in"}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FormCard;
