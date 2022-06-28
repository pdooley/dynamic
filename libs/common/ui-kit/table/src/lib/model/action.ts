export interface TableRowAction<T> {
  name: string;
  color?: 'primary' | 'accent' | 'warn';
  disabled?: boolean;
  matIcon?: string;
  tooltip?: string;
  handler: (row: T) => void;
}
