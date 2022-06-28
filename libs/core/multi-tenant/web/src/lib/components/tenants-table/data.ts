import { Tenant } from '@vsolv/core/multi-tenant/domain';
import { ColumnType, TableColumn, TableRowAction } from '@vsolv/ui-kit/table';
import { of } from 'rxjs';

export const TABLE_ROW_ACTIONS: TableRowAction<Tenant>[] = [
  // {
  //   name: 'update',
  //   matIcon: 'edit',
  //   handler: item => console.log('update action', item),
  // },
  // {
  //   name: 'delete',
  //   matIcon: 'delete',
  //   color: 'warn',
  //   handler: item => console.log('delete action', item),
  // },
  {
    name: '',
    matIcon: '',
    handler: () => console.log(),
  },
];

export const TABLE_COLS: TableColumn<Tenant>[] = [
  {
    id: 'icon',
    type: ColumnType.Icon,
    header: null,
    fitContent: false,
    hidden: false,
    tooltip: item => item.id.toString(),
    clipboard: item => item.id.toString(),
    icon: () =>
      of({
        matIcon: 'domain',
      }),
  },
  {
    id: 'name',
    type: ColumnType.Text,
    header: 'Name',
    fitContent: false,
    hidden: false,
    text: item => ({
      primary: item.name,
    }),
  },
  {
    id: 'domain',
    type: ColumnType.Text,
    header: 'Domain',
    fitContent: false,
    hidden: false,
    text: item => ({
      primary: item.domain,
    }),
  },
  {
    id: 'connection',
    type: ColumnType.Text,
    header: 'Connection',
    fitContent: false,
    hidden: false,
    text: item => ({
      primary: (item.connection.database as string) || '?',
    }),
  },
];
