import { TextField } from "@mui/material";
import { styled } from "@mui/system";

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(138, 116, 249, 0.6)",
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "#fff",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "rgba(138, 116, 249, 0.8)",
  },
  "& .Mui-error": {
    color: "#f44336",
  },
  "& .MuiFormHelperText-root": {
    color: "#f44336",
  },
});

export default StyledTextField;
