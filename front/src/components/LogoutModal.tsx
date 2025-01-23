import {
  Box,
  Button,
  Card,
  CardContent,
  Modal,
  Typography,
} from "@mui/material";
import CoffeeMakerRoundedIcon from "@mui/icons-material/CoffeeMakerRounded";

interface OriginalProps {
  handleLogout: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const LogoutModal: React.FC<OriginalProps> = (props) => {
  const { handleLogout, open, setOpen } = props;
  return (
    <Modal open={open}>
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
            <Button variant="contained" size="medium" onClick={handleLogout}>
              OK
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default LogoutModal;
