import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import InfoMessage from "../../common/components/InfoMessage";
import { usePairs } from "../../common/hooks/usePairs";
import DpkPairs from "./DpkPairsList/DpkPairs";
import { StorageHeader } from "./StorageHeader";

const DpkPairStorage = ({ gun }) => {
  const { pairs, setPairs, isLoading } = usePairs(gun);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (pairs.length > 0) {
      const mostRecent = pairs.reduce(
        (latest, pair) => (pair.timestamp > latest ? pair.timestamp : latest),
        pairs[0].timestamp
      );
      setLastUpdated(mostRecent);
    }
  }, [pairs]);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{ p: 4, minHeight: "100vh", backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <StorageHeader totalPairs={pairs.length} lastUpdated={lastUpdated} />
      <DpkPairs
        pairs={pairs}
        setPairs={setPairs}
        isLoading={isLoading}
        gun={gun}
        setLastUpdated={setLastUpdated}
      />
      <InfoMessage
        open={snackbar.open}
        duration={6000}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default DpkPairStorage;
