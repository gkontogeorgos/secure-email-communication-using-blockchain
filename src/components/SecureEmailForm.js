import {
  Typography,
  Box,
  Paper,
  TextField,
  Grid2,
  Button,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import JSEncrypt from "jsencrypt";
import InfoMessage from "@/common/components/InfoMessage";
import React, { useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import DeleteIcon from "@mui/icons-material/Delete";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const SecureEmailForm = () => {
  const [formState, setFormState] = useState({
    message: "",
    encryptedMessage: "",
    decryptedMessage: "",
    recipientPublicKey: "",
    privateKey: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const openInfoMessage = (isValid, message) => {
    setSnackbar({
      open: true,
      message: message,
      severity: isValid ? "success" : "error",
    });
  };

  // Encrypts the input message with the recipient's public key
  const encryptMessage = () => {
    const crypt = new JSEncrypt();
    crypt.setPublicKey(formState.recipientPublicKey);

    if (!formState.message.trim()) {
      openInfoMessage(false, "Cannot encrypt an empty message");
    } else if (!formState.recipientPublicKey.trim()) {
      openInfoMessage(false, "Recipient's public key is missing");
    } else if (
      !formState.recipientPublicKey
        .trim()
        .startsWith("-----BEGIN PUBLIC KEY-----") ||
      !formState.recipientPublicKey.trim().endsWith("-----END PUBLIC KEY-----")
    ) {
      openInfoMessage(false, "Recipient's public key is invalid");
    } else {
      const encrypted = crypt.encrypt(formState.message.trim());
      if (encrypted) {
        setFormState((prev) => ({ ...prev, encryptedMessage: encrypted }));
        openInfoMessage(true, "Message encrypted successfully");
      } else {
        openInfoMessage(false, "Encryption failed");
      }
    }
  };

  // Decrypts the encrypted message with the user's private key
  const decryptMessage = () => {
    const crypt = new JSEncrypt();
    crypt.setPrivateKey(formState.privateKey);

    if (!formState.encryptedMessage.trim()) {
      openInfoMessage(false, "Cannot decrypt an empty message");
    } else if (!formState.privateKey.trim()) {
      openInfoMessage(false, "Your private key is missing");
    } else if (
      !formState.privateKey
        .trim()
        .startsWith("-----BEGIN RSA PRIVATE KEY-----") ||
      !formState.privateKey.trim().endsWith("-----END RSA PRIVATE KEY-----")
    ) {
      openInfoMessage(false, "Your private key is invalid");
    } else {
      const decrypted = crypt.decrypt(formState.encryptedMessage.trim());
      if (decrypted) {
        setFormState((prev) => ({ ...prev, decryptedMessage: decrypted }));
        openInfoMessage(true, "Message decrypted successfully");
      } else {
        openInfoMessage(false, "Decryption failed");
      }
    }
  };

  // Clears all the input fields
  const clearForm = () => {
    setFormState({
      message: "",
      encryptedMessage: "",
      decryptedMessage: "",
      recipientPublicKey: "",
      privateKey: "",
    });
  };

  // Handle input changes
  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const TextFieldStyles = {
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
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 1000,
          backgroundColor: "rgba(38, 38, 38, 0.9)",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            background:
              "linear-gradient(135deg, rgba(88, 86, 214, 0.15) 0%, rgba(155, 106, 222, 0.15) 100%)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 600,
            }}
          >
            <EmailIcon sx={{ color: "#90caf9" }} />
            Secure Email Communication Form
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid2 container spacing={3}>
            {/* Message Section */}
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                placeholder="Enter your message..."
                value={formState.message}
                onChange={handleInputChange("message")}
                sx={TextFieldStyles}
              />
            </Grid2>

            {/* Recipient's Public Key */}
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Recipient's Public Key"
                multiline
                rows={4}
                placeholder="Paste the recipient's public key here..."
                value={formState.recipientPublicKey}
                onChange={handleInputChange("recipientPublicKey")}
                sx={TextFieldStyles}
              />
            </Grid2>

            {/* Action Buttons */}
            <Grid2 size={{ xs: 12 }} container spacing={2}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={encryptMessage}
                  sx={{
                    background:
                      "linear-gradient(135deg, #5856d6 0%, #9b6ade 100%)",
                    color: "#fff",
                    py: 1.5,
                    fontSize: "1rem",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
                    },
                  }}
                  startIcon={<LockIcon />}
                >
                  Encrypt Message
                </Button>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={clearForm}
                  sx={{
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    color: "#fff",
                    py: 1.5,
                    fontSize: "1rem",
                    "&:hover": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                  startIcon={<DeleteIcon />}
                >
                  Clear
                </Button>
              </Grid2>
            </Grid2>

            {/* Encrypted Message */}
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Encrypted Message"
                multiline
                rows={4}
                value={formState.encryptedMessage}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
                placeholder="Encrypted message will appear here..."
                sx={TextFieldStyles}
              />
            </Grid2>

            {/* Private Key */}
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Your Private Key"
                multiline
                rows={4}
                placeholder="Paste your private key here to decrypt a message..."
                value={formState.privateKey}
                onChange={handleInputChange("privateKey")}
                sx={TextFieldStyles}
              />
            </Grid2>

            {/* Decrypt Button */}
            <Grid2 size={{ xs: 12 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={decryptMessage}
                sx={{
                  background:
                    "linear-gradient(135deg, #5856d6 0%, #9b6ade 100%)",
                  color: "#fff",
                  py: 1.5,
                  fontSize: "1rem",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
                  },
                }}
                startIcon={<LockOpenIcon />}
              >
                Decrypt Message
              </Button>
            </Grid2>

            {/* Decrypted Message */}
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Decrypted Message"
                multiline
                rows={4}
                value={formState.decryptedMessage}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
                placeholder="Decrypted message will appear here..."
                sx={TextFieldStyles}
              />
            </Grid2>
          </Grid2>
        </Box>
      </Paper>
      <InfoMessage
        open={snackbar.open}
        duration={6000}
        message={snackbar.message}
        severity={snackbar.severity}
        classes={{ width: "100%" }}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default SecureEmailForm;
