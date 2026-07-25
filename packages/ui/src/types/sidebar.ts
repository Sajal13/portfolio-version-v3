export type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isMobile: boolean;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
};

export type SidebarProviderProps = React.ComponentProps<'div'> & {
  defaultOpen?: boolean;
};
