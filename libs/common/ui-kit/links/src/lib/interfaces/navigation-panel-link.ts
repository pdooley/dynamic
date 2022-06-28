export type NavigationPanelLink = {
  label: string;
  tooltip?: string;
  disabled?: boolean;
  icon?: string;
  color?: 'primary' | 'accent' | 'warn';
} & (
  | {
      routerLink?: string;
      external?: boolean;
      children?: undefined;
    }
  | {
      routerLink?: undefined;
      external?: false;
      children?: Omit<NavigationPanelLink, 'children'>[];
    }
);
