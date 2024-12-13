import { useEffect, useState } from "react";

export const usePairs = (gun) => {
  const [pairs, setPairs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!gun) return;

    setIsLoading(true);
    const pairsRef = gun.get("pairs");

    const subscription = pairsRef.map().on((data, id) => {
      if (data) {
        setPairs((prevPairs) => {
          const existingPairIndex = prevPairs.findIndex((p) => p.id === id);
          const newPair = {
            id,
            email_address: data.email_address,
            public_key: data.public_key,
            timestamp: data.timestamp,
          };

          if (existingPairIndex >= 0) {
            return prevPairs.map((p) => (p.id === id ? newPair : p));
          }
          return [...prevPairs, newPair];
        });
      }
    });

    setIsLoading(false);

    return () => {
      subscription.off();
    };
  }, [gun]);

  return { pairs, setPairs, isLoading };
};
