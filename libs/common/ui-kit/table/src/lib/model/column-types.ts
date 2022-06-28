import { Params, QueryParamsHandling } from '@angular/router';
import { Observable } from 'rxjs';

export type ColumnConfigValue<T, V> = V | Promise<V> | Observable<V> | ((item: T) => V | Promise<V> | Observable<V>);

export type ColumnConfigArrayValue<T, V> =
  | V[]
  | Promise<V[]>
  | Observable<V[]>
  | ((item: T) => V[] | Promise<V[]> | Observable<V[]>);

export type ColumnConfigValueOrArrayValue<T, V> = ColumnConfigValue<T, V> | ColumnConfigArrayValue<T, V>;

export enum ColumnType {
  Text = 'text',
  Icon = 'icon',
  IconButton = 'iconButton',
  Custom = 'custom',
  Chip = 'chip',
  Link = 'link',
}

interface BaseColumn<T> {
  id: string;
  type: ColumnType;
  header: string | null;
  fitContent: boolean;
  hidden: boolean;
  stickyEnd?: boolean;
  showOnHoverOnly?: boolean;
  click?: (row: T, event: Event) => void;
  tooltip?: (row: T) => string;
  clipboard?: (row: T) => string;
}

interface TextColumn<T> extends BaseColumn<T> {
  type: ColumnType.Text;
  text?: ColumnConfigValueOrArrayValue<
    T,
    {
      primary: string;
      secondary?: string;
    }
  >;
}

interface ChipColumn<T> extends BaseColumn<T> {
  type: ColumnType.Chip;
  chip?: ColumnConfigValueOrArrayValue<
    T,
    {
      text: string;
    }
  >;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CustomColumn<T, V = any> extends BaseColumn<T> {
  type: ColumnType.Custom;
  custom?: ColumnConfigValueOrArrayValue<T, V>;
}

interface IconColumn<T> extends BaseColumn<T> {
  type: ColumnType.Icon;
  icon?: ColumnConfigValueOrArrayValue<
    T,
    {
      matIcon: string;
    }
  >;
}

interface IconButtonColumn<T> extends BaseColumn<T> {
  type: ColumnType.IconButton;
  iconButton?: ColumnConfigValueOrArrayValue<
    T,
    {
      matIcon: string;
      action?: (value: T) => void;
    }
  >;
}

interface LinkColumn<T> extends BaseColumn<T> {
  type: ColumnType.Link;
  link?: ColumnConfigValueOrArrayValue<
    T,
    {
      text: string;
      routerLink: string;
      queryParams?: Params | null;
      queryParamsHandling?: QueryParamsHandling | null;
    }
  >;
}

export type TableColumn<T> =
  | TextColumn<T>
  | IconColumn<T>
  | IconButtonColumn<T>
  | LinkColumn<T>
  | ChipColumn<T>
  | CustomColumn<T>;
