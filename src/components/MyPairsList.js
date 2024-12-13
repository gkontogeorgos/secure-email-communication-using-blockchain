import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import NoEncryptionIcon from "@mui/icons-material/NoEncryption";
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import ConfirmationModal from "../common/components/ConfirmationModal";
import InfoMessage from "../common/components/InfoMessage";
import { useCopyToClipboard } from "@/common/hooks/useCopyToClipboard";

const MyPairsList = ({ gun, userSession }) => {
  const [pairs, setPairs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    pairId: null,
  });
  const { toolTip, copyToClipboard } = useCopyToClipboard("Copy public key");

  useEffect(() => {
    if (!gun || !userSession) return;

    try {
      setIsLoading(true);
      const username = userSession.loadUserData().username;

      // Connect to the main pairs node instead of user-specific path
      const pairsRef = gun.get("pairs");

      // Subscribe to changes
      pairsRef.map().on((data, key) => {
        if (data && data.email_address && data.public_key) {
          setPairs((prevPairs) => {
            const existingPairIndex = prevPairs.findIndex((p) => p.id === key);
            const newPair = {
              id: key,
              email_address: data.email_address,
              public_key: data.public_key,
              timestamp: data.timestamp || Date.now(),
            };

            if (existingPairIndex >= 0) {
              const updatedPairs = [...prevPairs];
              updatedPairs[existingPairIndex] = newPair;
              return updatedPairs;
            } else {
              return [...prevPairs, newPair];
            }
          });
        }
      });
    } catch (error) {
      console.error("Error loading pairs:", error);
      setSnackbar({
        open: true,
        message: "Failed to load pairs",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [gun, userSession]);

  const handleDeleteClick = (pairId) => {
    setDeleteDialog({
      open: true,
      pairId,
    });
  };

  const handleDeleteConfirm = () => {
    const pairId = deleteDialog.pairId;
    const username = userSession.loadUserData().username;

    gun.get("users").get(username).get("pairs").get(pairId).put(null);
    setPairs((prevPairs) => prevPairs.filter((pair) => pair.id !== pairId));

    setSnackbar({
      open: true,
      message: "Pair deleted successfully",
      severity: "success",
    });
    setDeleteDialog({ open: false, pairId: null });
  };

  const handleCopyPublicKey = async (publicKey) => {
    const success = await copyToClipboard(publicKey);
    setSnackbar({
      open: true,
      message: success
        ? "Public key copied to clipboard"
        : "Failed to copy public key",
      severity: success ? "success" : "error",
    });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper
        sx={{
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
            <KeyIcon sx={{ color: "#90caf9" }} />
            My PGP Key Pairs
          </Typography>
        </Box>

        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: "rgba(38, 38, 38, 0.95)",
                    color: "#fff",
                    fontWeight: 600,
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EmailIcon sx={{ color: "#90caf9" }} />
                    Email
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "rgba(38, 38, 38, 0.95)",
                    color: "#fff",
                    fontWeight: 600,
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      maxWidth: 400,
                    }}
                  >
                    <KeyIcon sx={{ color: "#90caf9" }} />
                    Public Key
                  </Box>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    backgroundColor: "rgba(38, 38, 38, 0.95)",
                    color: "#fff",
                    fontWeight: 600,
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    width: "100px",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} sx={{ border: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        p: 3,
                        gap: 2,
                      }}
                    >
                      <CircularProgress size={24} />
                      <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Loading pairs...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : pairs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} sx={{ border: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 4,
                        gap: 2,
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      <NoEncryptionIcon sx={{ fontSize: 48, opacity: 0.7 }} />
                      <Typography>No key pairs found</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                pairs.map((pair) => (
                  <TableRow
                    key={pair.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        color: "#fff",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <Tooltip title={pair.email_address} placement="top">
                        <span>{pair.email_address}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                        fontFamily: "monospace",
                        fontSize: "0.95rem",
                        py: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          maxWidth: "100%",
                        }}
                      >
                        <Tooltip
                          title={
                            <Typography
                              sx={{
                                fontFamily: "monospace",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {pair.public_key}
                            </Typography>
                          }
                          placement="top"
                        >
                          <Box
                            sx={{
                              flex: 1,
                              maxWidth: "750px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              backgroundColor: "rgba(0, 0, 0, 0.2)",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                            }}
                          >
                            {pair.public_key}
                          </Box>
                        </Tooltip>
                        <Tooltip title={toolTip} placement="top">
                          <IconButton
                            onClick={() => handleCopyPublicKey(pair.public_key)}
                            size="small"
                            sx={{
                              color: "rgba(255, 255, 255, 0.7)",
                              "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                color: "#90caf9",
                              },
                            }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <IconButton
                        onClick={() => handleDeleteClick(pair.id)}
                        sx={{
                          color: "#ef5350",
                          "&:hover": {
                            backgroundColor: "rgba(239, 83, 80, 0.1)",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <ConfirmationModal
        open={deleteDialog.open}
        title="Confirm Deletion"
        message="Are you sure you want to delete this pair? This action cannot be undone."
        confirmButtonText="Yes"
        cancelButtonText="No"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialog({ open: false, pairId: null })}
      />
      <InfoMessage
        open={snackbar.open}
        autoHideDuration={6000}
        message={snackbar.message}
        severity={snackbar.severity}
        classes={{ width: "100%" }}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default MyPairsList;
