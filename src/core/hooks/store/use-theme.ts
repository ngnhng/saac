"use client";

import { useRootStore } from "@/core/lib/store-context";

export const useTheme = () => {
  const store = useRootStore((store) => store);

  const { theme: state, setTheme } = store;

  return {
    theme: state,
    setTheme,
  };
};
