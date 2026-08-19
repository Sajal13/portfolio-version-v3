const DetailRow = ({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-secondary-300 mb-1">
      {label}
    </p>
    <div className="text-sm text-secondary-100">{children}</div>
  </div>
);

export { DetailRow };
