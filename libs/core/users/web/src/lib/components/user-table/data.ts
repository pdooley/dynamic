import { User } from '@vsolv/core/users/domain';
import { ColumnType, TableColumn, TableRowAction } from '@vsolv/ui-kit/table';
import { of } from 'rxjs';

export const TABLE_ROW_ACTIONS: TableRowAction<User>[] = [
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

export const TABLE_COLS: TableColumn<User>[] = [
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
        matIcon: 'person_outline',
      }),
  },
  {
    id: 'name',
    type: ColumnType.Text,
    header: 'Name',
    fitContent: false,
    hidden: false,
    text: item => ({
      primary: item.displayName || '',
    }),
  },
  {
    id: 'email',
    type: ColumnType.Text,
    header: 'email',
    fitContent: false,
    hidden: false,
    text: item => ({
      primary: item.email || '',
    }),
  },
  {
    id: 'phoneNumber',
    type: ColumnType.Text,
    header: 'Phone Number',
    fitContent: false,
    hidden: false,
    text: item => ({
      primary: item.phoneNumber || '',
    }),
  },
];
