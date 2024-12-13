import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";

const ConfirmationModal = ({
  open,
  title,
  message,
  confirmButtonText,
  cancelButtonText,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "rgba(38, 38, 38, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          minWidth: { xs: "90%", sm: "400px" },
          maxWidth: "450px",
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(4px)",
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background:
            "linear-gradient(135deg, rgba(88, 86, 214, 0.15) 0%, rgba(155, 106, 222, 0.15) 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 600,
          }}
        >
          <LogoutIcon sx={{ color: "#90caf9" }} />
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            "&:hover": {
              color: "#fff",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        <Typography sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
          {message}
        </Typography>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "rgba(255, 255, 255, 0.2)",
            color: "#fff",
            px: 3,
            "&:hover": {
              borderColor: "rgba(255, 255, 255, 0.3)",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            },
          }}
        >
          {cancelButtonText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #5856d6 0%, #9b6ade 100%)",
            color: "#fff",
            px: 3,
            "&:hover": {
              background: "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
            },
          }}
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
