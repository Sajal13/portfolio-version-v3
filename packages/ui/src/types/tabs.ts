export type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  idPrefix: string;
};

export type TabsProps = Omit<React.ComponentProps<'div'>, 'onChange'> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export type TabsContentProps = React.ComponentProps<'div'> & { value: string };
