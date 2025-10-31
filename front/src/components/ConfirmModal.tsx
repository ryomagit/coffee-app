import { Box, Button, Modal } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface OriginalProps {
  open: boolean;
  onClose: () => void;
  message: string;
  handleYes: () => void;
}

const ConfirmModal: React.FC<OriginalProps> = (props) => {
  const { open, onClose, message, handleYes } = props;

  return (
    <Modal open={open}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          background: "#fff",
          boxShadow: 3,
          borderRadius: 3,
          padding: 4,
          maxHeight: "90vh", // モーダルの最大高さ
          overflow: "auto", // スクロールを可能にする
        }}
      >
        <p style={{ textAlign: "center" }}>{message}</p>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 2,
          }}
        >
          <Button
            variant="contained"
            size="medium"
            sx={{ marginRight: 2 }}
            onClick={handleYes}
          >
            OK
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
export default ConfirmModal;
