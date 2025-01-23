import { Alert, Box, Modal, ModalOwnProps, ModalProps } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface OriginalProps {
  alertInfo: AlertInfo;
  setAlertInfo: Dispatch<SetStateAction<AlertInfo>>;
}

const AlertModal: React.FC<OriginalProps> = (props) => {
  const { alertInfo, setAlertInfo } = props;
  const { open, alertType, message } = alertInfo;
  const handleClose = () =>
    setAlertInfo((prev) => ({
      ...prev,
      open: false,
      alertType: "info",
      message: "",
    }));

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          background: "#fff",
          boxShadow: 3,
          borderRadius: 3,
          padding: 4,
          maxHeight: "90vh", // モーダルの最大高さ
          overflow: "auto", // スクロールを可能にする
        }}
      >
        {alertType === "info" ? (
          <Alert variant="outlined" severity="info">
            {message || "This is an informational message"}
          </Alert>
        ) : alertType === "warning" ? (
          <Alert variant="outlined" severity="warning">
            {message || "This is a warning message"}
          </Alert>
        ) : alertType === "error" ? (
          <Alert variant="outlined" severity="error">
            {message || "This is an error message"}
          </Alert>
        ) : alertType === "success" ? (
          <Alert variant="outlined" severity="success">
            {message || "This is a success message"}
          </Alert>
        ) : null}
      </Box>
    </Modal>
  );
};
export default AlertModal;
