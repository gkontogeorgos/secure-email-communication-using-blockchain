import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import KeyIcon from "@mui/icons-material/Key";
import LockIcon from "@mui/icons-material/Lock";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  TextareaAutosize,
  Tooltip,
  Typography,
} from "@mui/material";
import JSEncrypt from "jsencrypt";
import React, { useState } from "react";

function GeneratePGPKeys() {
  const [keys, setKeys] = useState({
    publicKey: "",
    privateKey: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [copyTooltip, setCopyTooltip] = useState({
    public: "Copy public key",
    private: "Copy private key",
  });

  const generateKeypair = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const crypt = new JSEncrypt({ default_key_size: 2048 });
      crypt.getKey();
      setKeys({
        publicKey: crypt.getPublicKey(),
        privateKey: crypt.getPrivateKey(),
      });
      setIsGenerating(false);
    }, 100);
  };

  const saveKeyAsFile = (key, fileName) => {
    const blob = new Blob([key], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const handleCopy = (keyType) => {
    const textToCopy = keyType === "public" ? keys.publicKey : keys.privateKey;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyTooltip((prev) => ({
        ...prev,
        [keyType]: "Copied!",
      }));
      setTimeout(() => {
        setCopyTooltip((prev) => ({
          ...prev,
          [keyType]:
            keyType === "public" ? "Copy public key" : "Copy private key",
        }));
      }, 2000);
    });
  };

  const textAreaStyle = {
    width: "calc(100% - 25px)",
    minHeight: "128px",
    padding: "12px",
    fontFamily: "monospace",
    fontSize: "14px",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "4px",
    color: "#fff",
    resize: "vertical",
  };

  const downloadButtonStyle = {
    width: "100%",
    marginTop: "12px",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    background:
      "linear-gradient(135deg, rgba(88, 86, 214, 0.1) 0%, rgba(155, 106, 222, 0.1) 100%)",
    color: "#90caf9",
    border: "1px solid rgba(144, 202, 249, 0.5)",
    "&:hover": {
      background:
        "linear-gradient(135deg, rgba(88, 86, 214, 0.2) 0%, rgba(155, 106, 222, 0.2) 100%)",
      border: "1px solid rgba(144, 202, 249, 0.7)",
    },
    "&.Mui-disabled": {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      color: "rgba(255, 255, 255, 0.3)",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          width: "calc(100% - 32px)",
          maxWidth: "800px",
          backgroundColor: "rgba(38, 38, 38, 0.9)",
          backdropFilter: "blur(10px)",
          padding: "24px",
          margin: "16px",
          overflow: "visible",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              mb: 2,
            }}
          >
            <LockIcon sx={{ color: "#90caf9" }} />
            <Typography variant="h4" sx={{ color: "#fff" }}>
              Generate PGP Keys
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={generateKeypair}
            disabled={isGenerating}
            sx={{
              width: "100%",
              background: "linear-gradient(135deg, #5856d6 0%, #9b6ade 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
              },
              padding: "12px",
              fontSize: "1rem",
            }}
          >
            {isGenerating ? (
              <>
                <CircularProgress size={20} color="inherit" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <KeyIcon sx={{ mr: 1 }} />
                <span>Generate Keys</span>
              </>
            )}
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Public Key Section */}
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ color: "#fff" }}>
                Public Key
              </Typography>
              {keys.publicKey && (
                <Tooltip title={copyTooltip.public} placement="left">
                  <IconButton
                    onClick={() => handleCopy("public")}
                    size="small"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      "&:hover": {
                        color: "#fff",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <TextareaAutosize
              placeholder="Your public key will appear here"
              value={keys.publicKey}
              readOnly
              style={textAreaStyle}
            />
            <Button
              variant="outlined"
              onClick={() => saveKeyAsFile(keys.publicKey, "public_key.asc")}
              disabled={!keys.publicKey}
              sx={downloadButtonStyle}
            >
              <DownloadIcon />
              Download Public Key
            </Button>
          </Box>

          {/* Private Key Section */}
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ color: "#fff" }}>
                Private Key
              </Typography>
              {keys.privateKey && (
                <Tooltip title={copyTooltip.private} placement="left">
                  <IconButton
                    onClick={() => handleCopy("private")}
                    size="small"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      "&:hover": {
                        color: "#fff",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <TextareaAutosize
              placeholder="Your private key will appear here"
              value={keys.privateKey}
              readOnly
              style={textAreaStyle}
            />
            <Button
              variant="outlined"
              onClick={() => saveKeyAsFile(keys.privateKey, "private_key.asc")}
              disabled={!keys.privateKey}
              sx={downloadButtonStyle}
            >
              <DownloadIcon />
              Download Private Key
            </Button>
          </Box>
        </Box>

        {keys.privateKey && (
          <Typography
            sx={{
              color: "#ffb74d",
              textAlign: "center",
              mt: 3,
              fontSize: "14px",
            }}
          >
            ⚠️ Store your private key securely and never share it with anyone!
          </Typography>
        )}
      </Card>
    </Box>
  );
}

export default GeneratePGPKeys;
