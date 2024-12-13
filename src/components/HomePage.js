import LockIcon from "@mui/icons-material/Lock";
import MailIcon from "@mui/icons-material/Mail";
import ShieldIcon from "@mui/icons-material/Shield";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { Box, Button, Card, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const iconStyle = {
    fontSize: "2.5rem",
    color: "#60A5FA",
    marginBottom: "1rem",
  };

  const features = [
    {
      icon: <LockIcon sx={iconStyle} />,
      title: "End-to-End Encryption",
      description:
        "Your messages are encrypted from sender to receiver, ensuring complete privacy and security.",
    },
    {
      icon: <ShieldIcon sx={{ ...iconStyle, color: "#34D399" }} />,
      title: "Blockchain Security",
      description:
        "Utilizing blockchain technology to maintain data integrity and immutable record-keeping.",
    },
    {
      icon: <MailIcon sx={{ ...iconStyle, color: "#A78BFA" }} />,
      title: "Secure Communication",
      description:
        "Public/private key cryptography ensures only intended recipients can access the content.",
    },
  ];

  const cardStyle = {
    backgroundColor: "rgba(17, 24, 39, 0.8)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(75, 85, 99, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      border: "1px solid rgba(96, 165, 250, 0.4)",
    },
  };

  const handleGetStarted = () => {
    navigate("/generate-pgp-keys");
  };

  return (
    <Box sx={{ padding: 7 }}>
      {/* Hero Section */}
      <Card sx={{ ...cardStyle, padding: 4, textAlign: "center" }}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: "2.5rem", md: "3rem", lg: "4rem" },
            fontWeight: "bold",
            background: "linear-gradient(to right, #60A5FA, #A78BFA)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            marginBottom: 2,
          }}
        >
          Secure Email Communication
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "rgb(209, 213, 219)",
            maxWidth: "42rem",
            margin: "0 auto",
            fontSize: { xs: "1.125rem", md: "1.25rem" },
          }}
        >
          Experience the next generation of secure communication powered by
          blockchain technology
        </Typography>
      </Card>

      {/* Features Grid */}
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} sx={cardStyle}>
            <Box
              sx={{
                padding: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              {feature.icon}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: "white",
                  textAlign: "center",
                }}
              >
                {feature.title}
              </Typography>
              <Typography
                sx={{
                  color: "rgb(209, 213, 219)",
                  textAlign: "center",
                }}
              >
                {feature.description}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Info Section */}
      <Card sx={cardStyle}>
        <Box
          sx={{
            padding: 4,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "white",
            }}
          >
            How It Works
          </Typography>
          <Typography
            sx={{
              color: "rgb(209, 213, 219)",
              maxWidth: "60rem",
              margin: "0 auto",
            }}
          >
            Our system employs advanced blockchain technology to provide
            end-to-end encryption and decryption for secure data sharing. Each
            message is encrypted using public/private key cryptography, ensuring
            that only intended recipients can access the content.
          </Typography>
          <Box sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={handleGetStarted}
              sx={{
                background: "linear-gradient(135deg, #5856d6 0%, #9b6ade 100%)",
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
                },
                boxShadow: "0 4px 20px rgba(88, 86, 214, 0.25)",
              }}
            >
              <VpnKeyIcon />
              Get Started by generating PGP keys
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default HomePage;
