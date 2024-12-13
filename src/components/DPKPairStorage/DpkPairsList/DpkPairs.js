import NoEncryptionIcon from "@mui/icons-material/NoEncryption";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import { useCopyToClipboard } from "../../../common/hooks/useCopyToClipboard";
import { useTableSort } from "../../../common/hooks/useTableSort";
import DpkPairHeader from "./DpkPairHeader";
import DpkPairRow from "./DpkPairRow";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import InfoMessage from "../../../common/components/InfoMessage";

const DpkPairs = ({ pairs, setPairs, isLoading, gun }) => {
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    pairId: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const { sortedItems, requestSort, sortConfig } = useTableSort(pairs);
  const { tooltip, copyToClipboard } = useCopyToClipboard("Copy public key");

  const handleDelete = (pairId) => {
    setDeleteDialog({ open: true, pairId });
  };

  const handleDeleteConfirm = async () => {
    try {
      const pairId = deleteDialog.pairId;
      await gun.get("pairs").get(pairId).put(null);
      setPairs((prevPairs) => prevPairs.filter((pair) => pair.id !== pairId));
      setSnackbar({
        open: true,
        message: "Pair deleted successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete pair",
        severity: "error",
      });
    } finally {
      setDeleteDialog({ open: false, pairId: null });
    }
  };

  const handleCopy = async (publicKey) => {
    const success = await copyToClipboard(publicKey);
    setSnackbar({
      open: true,
      message: success
        ? "Public key copied to clipboard"
        : "Failed to copy public key",
      severity: success ? "success" : "error",
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box>
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
              <ChecklistRtlIcon sx={{ color: "#90caf9" }} />
              PGP Key Pairs
            </Typography>
          </Box>

          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <DpkPairHeader onSort={requestSort} sortConfig={sortConfig} />
              <TableBody>
                {sortedItems?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ border: 0 }}>
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
                        <Typography>No key pairs found in the database</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedItems.map((pair) => (
                    <DpkPairRow
                      key={pair.id}
                      pair={pair}
                      onDelete={handleDelete}
                      onCopy={handleCopy}
                      copyTooltip={tooltip}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <ConfirmationModal
        open={deleteDialog.open}
        title="Confirm Deletion"
        message="Are you sure you want to delete this pair? This action cannot be undone."
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteDialog({ open: false, pairId: null })}
      />
      <InfoMessage
        open={snackbar.open}
        duration={6000}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
};

export default DpkPairs;
