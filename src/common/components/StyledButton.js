import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isGradient",
})(({ theme, isGradient }) => ({
  height: "56px",
  fontSize: "1rem",
  textTransform: "none",
  ...(isGradient
    ? {
        background: "linear-gradient(135deg, #5856d6 0%, #9b6ade 100%)",
        color: "#fff",
        "&:hover": {
          background: "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
        },
        "&:disabled": {
          background: "rgba(255, 255, 255, 0.12)",
          color: "rgba(255, 255, 255, 0.3)",
        },
      }
    : {
        borderColor: "rgba(255, 255, 255, 0.2)",
        color: "#fff",
        "&:hover": {
          borderColor: "rgba(255, 255, 255, 0.3)",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
        },
        "&:disabled": {
          borderColor: "rgba(255, 255, 255, 0.12)",
          color: "rgba(255, 255, 255, 0.3)",
        },
      }),
}));

export default StyledButton;
