import type { IconType } from "react-icons";

export type AdminRoute = {
  label: string;
  path: string;
  icon: IconType;
  active?: boolean;
};
