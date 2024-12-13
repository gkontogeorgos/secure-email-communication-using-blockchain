import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import AnimatedButton from "./../common/components/AnimatedButton";
import { showConnect } from "@stacks/connect";

const SignIn = ({ userSession, userData, setUserData }) => {
  const [loading, setLoading] = useState(false);

  const appDetails = {
    name: "Secure Email Communication Using Blockchain",
    icon: "https://freesvg.org/img/1541103084.png",
  };

  useEffect(() => {
    if (userSession.isSignInPending()) {
      setLoading(true);
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
        setLoading(false);
      });
    }
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setUserData(userData);
    }
  }, [userSession]);

  const connectWallet = () => {
    setLoading(true);
    showConnect({
      appDetails,
      onFinish: () => {
        const userData = userSession.loadUserData();
        setUserData(userData);
        setLoading(false);
      },
      userSession,
    });
    setLoading(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{
        textAlign: "center",
      }}
    >
      {loading && <CircularProgress color="primary" />}
      {!userData && (
        <>
          <Typography
            variant="h3"
            mt={4}
            sx={{ color: "#ffffff", fontWeight: "bold" }}
          >
            Secure Email Communication Using Blockchain
          </Typography>
          <AnimatedButton onClick={connectWallet}>
            Connect Wallet
          </AnimatedButton>
        </>
      )}
    </Box>
  );
};

export default SignIn;
