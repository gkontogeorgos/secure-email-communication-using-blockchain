import SecurityIcon from "@mui/icons-material/Security";
import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export const SideDrawer = React.memo(({ open, onClose, tabs, isActiveTab }) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 280,
          backgroundColor: "rgba(26, 26, 26, 0.95)",
          backdropFilter: "blur(10px)",
          color: "#fff",
        },
      }}
    >
      {/* Drawer Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#fff",
          }}
        >
          <SecurityIcon sx={{ color: "#90caf9" }} />
          Secure Email
        </Typography>
      </Box>
      <List>
        {tabs.map((tab, index) => (
          <React.Fragment key={tab.path}>
            <ListItem
              component={Link}
              to={tab.path}
              onClick={onClose}
              selected={isActiveTab(tab.path)}
              sx={{
                my: 0.5,
                mx: 1,
                borderRadius: "8px",
                color: "#fff",
                "&.Mui-selected": {
                  backgroundColor: "rgba(138, 116, 249, 0.15)",
                  "&:hover": {
                    backgroundColor: "rgba(138, 116, 249, 0.25)",
                  },
                },
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                {tab.icon}
              </ListItemIcon>
              <ListItemText primary={tab.label} />
            </ListItem>
            {tab.divider && (
              <Divider
                sx={{
                  my: 1,
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
});
