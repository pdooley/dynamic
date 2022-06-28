import { AuthUser } from '@vsolv/core/auth/domain';
import { ColumnType, TableColumn, TableRowAction } from '@vsolv/ui-kit/table';
import { of } from 'rxjs';

export const TABLE_ROW_ACTIONS: TableRowAction<AuthUser>[] = [
  {
    name: '',
    matIcon: '',
    handler: () => console.log(),
  },
];

export const TABLE_COLS: TableColumn<AuthUser>[] = [
  {
    id: 'icon',
    type: ColumnType.Icon,
    header: null,
    fitContent: false,
    hidden: false,
    icon: () =>
      of({
        matIcon: 'key',
      }),
  },
  {
    id: 'tenantId',
    type: ColumnType.Text,
    header: 'Tenant',
    fitContent: false,
    hidden: false,
    text: item => ({
      primary: item.tenantId || '',
    }),
    clipboard: item => item.tenantId?.toString() || '',
  },
  {
    id: 'authId',
    type: ColumnType.Text,
    header: 'Authorization',
    fitContent: false,
    hidden: false,
    text: item => ({
      primary: item.authId || '',
    }),
    clipboard: item => item.authId.toString(),
  },
  {
    id: 'userId',
    type: ColumnType.Text,
    header: 'User',
    fitContent: false,
    hidden: false,
    text: item => ({
      primary: item.userId || '',
    }),
    clipboard: item => item.userId.toString(),
  },
];
