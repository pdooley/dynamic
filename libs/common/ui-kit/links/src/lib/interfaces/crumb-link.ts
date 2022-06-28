export interface CrumbLink {
  label: string;
  tooltip?: string;
  disabled?: boolean;
  icon?: string;
  routerLink?: string;
  children?: Omit<CrumbLink, 'children'>[];
}
