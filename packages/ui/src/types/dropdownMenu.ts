import { FloatingAlign, FloatingSide } from './overlay';

export type DropdownMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  floatingRef: React.RefObject<HTMLElement | null>;
  coords: { top: number; left: number } | null;
};

export type DropdownMenuProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: FloatingSide;
  align?: FloatingAlign;
};

export type DropdownMenuItemProps = React.ComponentProps<'div'> & {
  disabled?: boolean;
  onSelect?: () => void;
};
