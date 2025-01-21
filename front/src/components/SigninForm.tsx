import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { ERROR_MESSAGES } from "../Const";
import postRequest from "../utils/HttpUtil";
interface OriginalProps {
  handleClose: () => void;
  setSignin: (signin: boolean) => void;
}
const SigninForm: React.FC<OriginalProps> = ({ handleClose, setSignin }) => {
  const [formData, setFormData] = useState<{
    mailAddress: string;
    password: string;
    confirmPassword: string;
  }>({ mailAddress: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<{
    mailAddress: string;
    password: string;
    confirmPassword: string;
  }>({ mailAddress: "", password: "", confirmPassword: "" });

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
        name === "mailAddress"
          ? ERROR_MESSAGES.mailaddress_1
          : name === "password"
          ? ERROR_MESSAGES.password_1
          : ERROR_MESSAGES.confirmPassword_1;
    } else if (name === "mailAddress") {
      // Usernameのバリデーション
      const mailAddressRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!mailAddressRegex.test(value)) {
        error = ERROR_MESSAGES.mailaddress_2;
      }
    } else if (name === "password") {
      // Passwordのバリデーション
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d|.*[_?!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
      if (!passwordRegex.test(value)) {
        error = ERROR_MESSAGES.password_2;
      }
    } else if (name === "confirmPassword") {
      if (value !== formData.password) {
        error = ERROR_MESSAGES.confirmPassword_2;
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isValid = false;
    if (!!errors.mailAddress || !!errors.password || !!errors.confirmPassword) {
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
    if (!formData.confirmPassword && !errors.confirmPassword) {
      isValid = true;
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: ERROR_MESSAGES.confirmPassword_1,
      }));
    }
    if (!isValid) {
      const body = {
        mailAddress: formData.mailAddress,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };
      postRequest(
        "http://localhost:8080/api/public/signin",
        body,
        (resData: any) => {
          setSignin(false);
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
      <TextField
        fullWidth
        label="confirmPassword"
        name="confirmPassword"
        type="password"
        margin="normal"
        variant="outlined"
        value={formData.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
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
          Sign in
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Box>
    </form>
  );
};

export default SigninForm;
