import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";

const DpkPairRow = ({ pair, onDelete, onCopy, copyTooltip }) => {
  return (
    <TableRow
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
          <Typography noWrap>{pair.email_address}</Typography>
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
                sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}
              >
                {pair.public_key}
              </Typography>
            }
            placement="top"
          >
            <Box
              sx={{
                flex: 1,
                maxWidth: "600px",
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
          <Tooltip title={copyTooltip} placement="top">
            <IconButton
              onClick={() => onCopy(pair.public_key)}
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
        sx={{
          color: "#fff",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        {new Date(pair.timestamp).toLocaleString()}
      </TableCell>

      <TableCell
        align="right"
        sx={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <IconButton
          onClick={() => onDelete(pair.id)}
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
  );
};

export default DpkPairRow;
