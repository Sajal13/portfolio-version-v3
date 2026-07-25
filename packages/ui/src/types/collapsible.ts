export type CollapsibleContextValue = {
  open: boolean;
  toggle: () => void;
  disabled?: boolean;
};

export type CollapsibleProps = React.ComponentProps<'div'> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
};
