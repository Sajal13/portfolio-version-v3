export type SelectContextValue = {
  value?: string;
  setValue: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  floatingRef: React.RefObject<HTMLElement | null>;
  coords: { top: number; left: number } | null;
  triggerWidth: number | null;
  labelMap: React.RefObject<Map<string, string>>;
  selectedLabel: string | null;
};

export type SelectProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export type SelectItemProps = React.ComponentProps<'div'> & {
  value: string;
  disabled?: boolean;
};
