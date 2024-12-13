import CloudDoneIcon from "@mui/icons-material/CloudDone";
import KeyIcon from "@mui/icons-material/Key";
import StorageIcon from "@mui/icons-material/Storage";
import UpdateIcon from "@mui/icons-material/Update";
import { Box, Grid2, Paper, Typography } from "@mui/material";
import React from "react";
import StatCard from "./StatCard";

export const StorageHeader = ({ totalPairs, lastUpdated }) => {
  const formatDate = (date) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date(date));
  };

  return (
    <Paper
      sx={{
        backgroundColor: "rgba(38, 38, 38, 0.9)",
        backdropFilter: "blur(10px)",
        borderRadius: 3,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
        mb: 3,
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
          <StorageIcon sx={{ color: "#90caf9" }} />
          Decentralized Public Key Storage
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255, 255, 255, 0.7)", mt: 1 }}
        >
          Securely store and manage public keys for encrypted communication
        </Typography>
      </Box>

      <Grid2 container spacing={3} sx={{ p: 3 }}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <StatCard icon={KeyIcon} title="Total Key Pairs" value={totalPairs} />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
          <StatCard
            icon={CloudDoneIcon}
            title="Storage Status"
            value="Online"
            color="#4caf50"
          />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
          <StatCard
            icon={UpdateIcon}
            title="Last Updated"
            value={formatDate(lastUpdated)}
            color="#ff9800"
          />
        </Grid2>
      </Grid2>
    </Paper>
  );
};
