export type SheetContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type SheetProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};
