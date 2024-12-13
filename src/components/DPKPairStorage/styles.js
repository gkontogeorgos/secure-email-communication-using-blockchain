import { Box, Paper } from "@mui/material";
import { keyframes, styled } from "@mui/system";

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const HeaderContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: "rgba(38, 38, 38, 0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
  marginBottom: "24px",
}));

export const HeaderContent = styled(Box)(({ theme }) => ({
  padding: "24px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  background: `linear-gradient(
    135deg,
    rgba(88, 86, 214, 0.15) 0%,
    rgba(155, 106, 222, 0.15) 25%,
    rgba(88, 86, 214, 0.15) 50%,
    rgba(155, 106, 222, 0.15) 75%,
    rgba(88, 86, 214, 0.15) 100%
  )`,
  backgroundSize: "400% 400%",
  animation: `${gradientAnimation} 15s ease infinite`,
}));

export const StatsContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "16px",
  padding: "16px 24px",
  backgroundColor: "rgba(0, 0, 0, 0.2)",
}));

export const StatItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "16px",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  borderRadius: "8px",
  transition: "transform 0.2s ease, background-color 0.2s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-2px)",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
}));
