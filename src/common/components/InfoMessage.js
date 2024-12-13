import { Alert, Snackbar } from "@mui/material";

import React from "react";

const InfoMessage = ({
  open,
  duration,
  message,
  severity,
  classes,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          ...classes,
          backgroundColor:
            severity === "success"
              ? "rgba(46, 125, 50, 0.9)"
              : "rgba(211, 47, 47, 0.9)",
          color: "#fff",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default InfoMessage;
