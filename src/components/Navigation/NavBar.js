import MenuIcon from "@mui/icons-material/Menu";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import SecurityIcon from "@mui/icons-material/Security";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import avatar from "../../assets/avatar.png";

const NavButton = React.memo(({ tab, isActive }) => (
  <Button
    component={Link}
    to={tab.path}
    sx={{
      color: "#fff",
      textTransform: "none",
      px: 2.5,
      py: 1,
      minHeight: "48px",
      borderRadius: "12px",
      backgroundColor: isActive ? "rgba(255, 255, 255, 0.15)" : "transparent",
      backdropFilter: isActive ? "blur(4px)" : "none",
      border: isActive
        ? "1px solid rgba(255, 255, 255, 0.2)"
        : "1px solid transparent",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
      },
      display: "flex",
      alignItems: "center",
      gap: 1,
      fontSize: "0.95rem",
      fontWeight: isActive ? 600 : 500,
      transition: "all 0.2s ease",
      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
    }}
  >
    {React.cloneElement(tab.icon, {
      sx: {
        fontSize: "1.2rem",
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
      },
    })}
    {tab.label}
  </Button>
));

export const NavBar = React.memo(
  ({ userData, tabs, isActiveTab, onMenuClick, onSignOutClick }) => {
    return (
      <AppBar
        position="static"
        sx={{
          background: `linear-gradient(135deg, 
          rgba(88, 86, 214, 0.95) 0%,
          rgba(103, 76, 192, 0.95) 35%,
          rgba(155, 106, 222, 0.95) 100%)`,
          boxShadow: "0 4px 20px rgba(88, 86, 214, 0.25)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Toolbar sx={{ minHeight: "68px" }}>
          {/* User Profile Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mr: 2,
            }}
          >
            <Avatar
              alt={avatar}
              src={avatar}
              sx={{
                width: 42,
                height: 42,
                mr: 1.5,
                border: "2px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                color: "#fff",
                fontWeight: 500,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {userData?.profile?.name || "User"}
            </Typography>
          </Box>

          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{
              mr: 2,
              display: { md: "none" },
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              fontWeight: 600,
              letterSpacing: "0.5px",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <SecurityIcon
              sx={{
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                fontSize: "28px",
              }}
            />
            Secure Email Communication
          </Typography>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {tabs.map((tab, index) => (
              <React.Fragment key={tab.path}>
                <NavButton tab={tab} isActive={isActiveTab(tab.path)} />
                {tab.divider && (
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      mx: 1,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </Box>

          <IconButton
            color="inherit"
            onClick={onSignOutClick}
            sx={{
              ml: 2,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
              border: "1px solid rgba(255, 255, 255, 0.15)",
              transition: "all 0.2s ease",
            }}
          >
            <PowerSettingsNewIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
);
