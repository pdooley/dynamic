import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, map, of } from 'rxjs';

import { User } from '@vsolv/core/users/domain';
import { PropertyListener } from '@vsolv/dev-kit/rx';
import { ColumnType, TableColumn, TableDataSource, TableRowAction } from '@vsolv/ui-kit/table';

import { UserService } from '../../services';

@Component({
  selector: 'vsolv-user-profiles-table',
  templateUrl: './user-profiles-table.component.html',
  styleUrls: ['./user-profiles-table.component.scss'],
})
export class UserProfilesTableComponent {
  @Input() view: 'default' | 'compact' = 'default';
  @PropertyListener('data') data$ = new BehaviorSubject<User[]>([]);
  @Input() data!: User[];
  @Output() selected = new EventEmitter();

  constructor(private userSvc: UserService) {}

  refresh$ = new BehaviorSubject(null);

  dataSource$ = this.data$.pipe(
    map(data => {
      const dataSource = new TableDataSource<User>(data);
      dataSource.columns = this.TABLE_COLS;
      dataSource.actions = this.TABLE_ROW_ACTIONS;
      return dataSource;
    })
  );
  TABLE_ROW_ACTIONS: TableRowAction<User>[] = [
    {
      name: 'chooseUser',
      matIcon: '',
      handler: item => this.chooseUser(item),
    },
  ];
  TABLE_COLS: TableColumn<User>[] = [
    {
      id: 'icon',
      type: ColumnType.Icon,
      header: null,
      fitContent: false,
      hidden: false,
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
      click: item => this.chooseUser(item),
    },
    {
      id: 'email',
      type: ColumnType.Text,
      header: 'Contact',
      fitContent: false,
      hidden: false,
      text: item => ({
        primary: item.email || '',
      }),
      click: item => this.chooseUser(item),
    },
  ];

  chooseUser(user: User) {
    this.selected.emit(user);
  }
}
