import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { ERROR_MESSAGES } from "../Const";
import postRequest from "../utils/HttpUtil";
interface OriginalProps {
  handleClose: () => void;
  setIsLogin: (isLogin: boolean) => void;
}
const LoginForm: React.FC<OriginalProps> = ({ handleClose, setIsLogin }) => {
  const [formData, setFormData] = useState<{
    mailAddress: string;
    password: string;
  }>({ mailAddress: "", password: "" });
  const [errors, setErrors] = useState<{
    mailAddress: string;
    password: string;
  }>({ mailAddress: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // 入力中はエラーをリセット
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";

    if (!value) {
      error =
        name === "emailAddress"
          ? ERROR_MESSAGES.mailaddress_1
          : ERROR_MESSAGES.password_1;
    } else if (name === "emailAddress") {
      // mailAddressのバリデーション
      const emailAddressRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailAddressRegex.test(value)) {
        error = ERROR_MESSAGES.mailaddress_2;
      }
    } else if (name === "password") {
      //   // Passwordのバリデーション
      //   const passwordRegex =
      //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_@$!%*#?&])[A-Za-z\d_@$!%*#?&]{8,16}$/;
      //   if (!passwordRegex.test(value)) {
      //     error = ERROR_MESSAGES.password_2;
      //   }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isValid = false;
    if (!!errors.mailAddress || !!errors.password) {
      isValid = true;
    }
    if (!formData.mailAddress) {
      isValid = true;
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: ERROR_MESSAGES.mailaddress_1,
      }));
    }
    if (!formData.password) {
      isValid = true;
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: ERROR_MESSAGES.password_1,
      }));
    }
    if (!isValid) {
      const body = {
        mailAddress: formData.mailAddress,
        password: formData.password,
      };
      postRequest(
        "http://localhost:8080/api/public/login",
        body,
        (resData: any) => {
          sessionStorage.setItem("authToken", resData.accessToken);
          setIsLogin(true);
          handleClose();
        }
      );
    }
  };

  return (
    <form onSubmit={handelSubmit}>
      <TextField
        fullWidth
        label="mailAddress"
        name="mailAddress"
        margin="normal"
        variant="outlined"
        value={formData.mailAddress}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.mailAddress}
        helperText={errors.mailAddress}
      />
      <TextField
        fullWidth
        label="password"
        name="password"
        type="password"
        margin="normal"
        variant="outlined"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.password}
        helperText={errors.password}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ marginRight: 2 }}
          type="submit"
        >
          Log in
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Box>
    </form>
  );
};

export default LoginForm;
