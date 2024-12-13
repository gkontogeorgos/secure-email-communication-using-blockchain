import { useEffect, useState } from "react";

export const useAuth = (userSession) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleSignIn = async () => {
      if (userSession.isSignInPending()) {
        setLoading(true);
        const data = await userSession.handlePendingSignIn();
        setUserData(data);
        setLoading(false);
      } else if (userSession.isUserSignedIn()) {
        const data = userSession.loadUserData();
        setUserData(data);
      }
    };

    handleSignIn();
  }, [userSession]);

  return { userData, loading, setLoading };
};
