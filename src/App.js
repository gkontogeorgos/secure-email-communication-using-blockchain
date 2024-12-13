import { Box, useTheme } from "@mui/material";
import { AppConfig, UserSession } from "@stacks/connect";
import Gun from "gun";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmationModal from "./common/components/ConfirmationModal.js";
import { useAppNavigation } from "./common/hooks/useAppNavigation.js";
import { useLogout } from "./common/hooks/useLogout";
import { NavBar } from "./components/Navigation/NavBar.js";
import { SideDrawer } from "./components/Navigation/SideDrawer";
import AppRoutes from "./components/Routes/AppRoutes.js";
import SignIn from "./components/Signin.js";

const gun = Gun(`${window.location.origin}/gun`);
const appConfig = new AppConfig(["store_write"]);
const userSession = new UserSession({ appConfig });

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userData, setUserData] = useState(null); // Move this state here
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { tabs, isActiveTab } = useAppNavigation();
  const {
    isLogoutModalOpen,
    setIsLogoutModalOpen,
    handleSignOutClick,
    handleSignOutConfirm,
  } = useLogout(userSession, setUserData);

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/home");
    }
  }, [location, navigate]);

  return (
    <div className="site-wrapper">
      {!userData ? (
        <SignIn
          userSession={userSession}
          userData={userData}
          setUserData={setUserData}
        />
      ) : (
        <>
          <NavBar
            userData={userData}
            tabs={tabs}
            isActiveTab={isActiveTab}
            onMenuClick={() => setDrawerOpen(true)}
            onSignOutClick={handleSignOutClick}
            theme={theme}
          />
          <SideDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            tabs={tabs}
            isActiveTab={isActiveTab}
          />
          <Box>
            <AppRoutes userSession={userSession} gun={gun} />
          </Box>
          <ConfirmationModal
            open={isLogoutModalOpen}
            title="Confirm Logout"
            confirmButtonText="YES, LOGOUT"
            cancelButtonText="NO, CANCEL"
            message="Are you sure you want to logout? You will be disconnected from your wallet."
            onConfirm={handleSignOutConfirm}
            onClose={() => setIsLogoutModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default App;
