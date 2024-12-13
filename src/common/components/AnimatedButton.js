import { Button } from "@mui/material";
import { styled } from "@mui/system";

const AnimatedButton = styled(Button)(({ theme }) => ({
  position: "relative",
  padding: "1rem 2rem",
  fontSize: "1.2rem",
  backgroundColor: "#43340e",
  color: "white",
  borderRadius: "50px",
  textTransform: "none",
  overflow: "hidden",
  border: "5px solid ridge",
  animation: "border-pulse 2s infinite linear",
  "@keyframes border-pulse": {
    "0%": {
      boxShadow: "0 0 5px yellow",
    },
    "25%": {
      boxShadow: "0 0 15px orange",
    },
    "50%": {
      boxShadow: "0 0 20px green",
    },
    "75%": {
      boxShadow: "0 0 25px blue",
    },
    "100%": {
      boxShadow: "0 0 5px red",
    },
  },
}));

export default AnimatedButton;
