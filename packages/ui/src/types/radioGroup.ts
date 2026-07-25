export type RadioGroupContextValue = {
  name: string;
  value?: string;
  setValue: (value: string) => void;
};

export type RadioGroupProps = Omit<React.ComponentProps<'div'>, 'onChange'> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
};

export type RadioGroupItemProps = Omit<
  React.ComponentProps<'input'>,
  'type' | 'size' | 'onChange'
> & {
  value: string;
};
