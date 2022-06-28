export type MenuLinkPickerLink = {
  label: string;
  description?: string;
  routerLink?: string;
  color?: 'primary' | 'accent' | 'warn';
} & (
  | {
      imageUrl: string;
      icon?: undefined;
    }
  | {
      imageUrl?: undefined;
      icon?: string;
    }
);
