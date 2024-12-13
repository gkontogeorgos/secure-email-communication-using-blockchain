import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import {
  Box,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import React from "react";

const DpkPairHeader = ({ onSort, sortConfig }) => {
  const headers = [
    { id: "email_address", label: "Email", icon: EmailIcon },
    { id: "public_key", label: "Public Key", icon: KeyIcon },
    { id: "timestamp", label: "Date Added", icon: CalendarMonthIcon },
  ];

  return (
    <TableHead>
      <TableRow sx={{ bgcolor: "#333" }}>
        {headers.map(({ id, label, icon: Icon }) => (
          <TableCell
            key={id}
            onClick={() => onSort(id)}
            sx={{
              backgroundColor: "rgba(38, 38, 38, 0.95)",
              color: "#fff",
              fontWeight: 600,
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <TableSortLabel
              active={sortConfig.key === id}
              direction={sortConfig.direction}
              sx={{
                color: "#fff !important",
                "&.MuiTableSortLabel-root": {
                  color: "#fff",
                },
                "& .MuiTableSortLabel-icon": {
                  color: "#fff !important",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {Icon && <Icon sx={{ color: "#90caf9" }} />}
                {label}
              </Box>
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell
          align="right"
          sx={{
            backgroundColor: "rgba(38, 38, 38, 0.95)",
            color: "#fff",
            fontWeight: 600,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default DpkPairHeader;
