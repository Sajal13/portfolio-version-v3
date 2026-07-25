"use client";

import {
  createContext,
  PropsWithChildren,
  use,
  useEffect,
  useState
} from "react";

interface RootContextProps {
  isSidebarCollapsed: boolean;
  handleToggleNavbar: () => void;
}

export const RootContext = createContext({} as RootContextProps);

const RootProvider = ({ children }: PropsWithChildren) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleToggleNavbar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const state = localStorage.getItem("navbarState");
    if (state !== null) {
      setIsSidebarCollapsed(JSON.parse(state));
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("navbarState", JSON.stringify(isSidebarCollapsed));
    }
  }, [isSidebarCollapsed, mounted]);

  // ← never return null — render children immediately
  return (
    <RootContext.Provider value={{ isSidebarCollapsed, handleToggleNavbar }}>
      {children}
    </RootContext.Provider>
  );
};

export const useRootContext = () => use(RootContext);

export default RootProvider;
