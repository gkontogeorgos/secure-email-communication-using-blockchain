import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLogout = (userSession, setUserData) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleSignOutConfirm = () => {
    setIsLogoutModalOpen(false);
    setUserData(null);
    navigate("/");
    userSession.signUserOut();
  };

  return {
    isLogoutModalOpen,
    setIsLogoutModalOpen,
    handleSignOutClick,
    handleSignOutConfirm,
  };
};
