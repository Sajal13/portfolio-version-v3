export type AlertDialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type AlertDialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};
