import { useState } from "react";

export const useCopyToClipboard = (initialTooltip = "Copy") => {
  const [tooltip, setTooltip] = useState(initialTooltip);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setTooltip("Copied!");
      setTimeout(() => setTooltip(initialTooltip), 2000);
      return true;
    } catch (err) {
      console.error("Copy failed:", err);
      return false;
    }
  };

  return { tooltip, copyToClipboard };
};
