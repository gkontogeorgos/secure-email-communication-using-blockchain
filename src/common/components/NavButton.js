import React, { memo } from "react";

const NavButton = memo(({ tab, isActive, theme }) => (
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

export default NavButton;
