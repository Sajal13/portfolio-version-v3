export type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type DialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

export type DialogContentProps = React.ComponentProps<'div'> & {
  showClose?: boolean;
};
