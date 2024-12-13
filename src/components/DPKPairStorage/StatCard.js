import { Typography, Paper } from "@mui/material";
import React from "react";

const StatCard = ({ icon: Icon, title, value, color = "#90caf9" }) => (
  <Paper
    sx={{
      p: 3,
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      textAlign: "center",
    }}
  >
    {Icon && <Icon sx={{ color, fontSize: 40, mb: 1 }} />}
    <Typography variant="h6" sx={{ color: "#fff" }}>
      {title}
    </Typography>
    <Typography variant="h4" sx={{ color, mt: 1 }}>
      {value}
    </Typography>
  </Paper>
);

export default StatCard;
