import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import StorageIcon from "@mui/icons-material/Storage";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const useAppNavigation = () => {
  const location = useLocation();

  const tabs = useMemo(
    () => [
      {
        path: "/home",
        label: "Home",
        icon: <HomeIcon />,
      },
      {
        path: "/generate-pgp-keys",
        label: "Generate PGP Keys",
        icon: <VpnKeyIcon />,
      },
      {
        path: "/my-pairs-list",
        label: "My Pairs List",
        icon: <ListAltIcon />,
      },
      {
        path: "/secure-email-form",
        label: "Secure Email Form",
        icon: <EmailIcon />,
      },
      {
        path: "/add-new-pair",
        label: "Add New Pair",
        icon: <AddIcon />,
      },
      {
        path: "/dpk-pair-storage",
        label: "DPK Pairs Storage",
        icon: <StorageIcon />,
      },
    ],
    []
  );

  const isActiveTab = (path) => location.pathname === path;

  return {
    tabs,
    isActiveTab,
  };
};
