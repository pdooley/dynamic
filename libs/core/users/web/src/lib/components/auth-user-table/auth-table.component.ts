import { Component, Input } from '@angular/core';
import { BehaviorSubject, map, switchMap } from 'rxjs';

import { AuthUser } from '@vsolv/core/auth/domain';
import { TableDataSource } from '@vsolv/ui-kit/table';

import { AuthUserService } from '../../services';
import { TABLE_COLS, TABLE_ROW_ACTIONS } from './data';

@Component({
  selector: 'vsolv-auth-table',
  templateUrl: './auth-table.component.html',
  styleUrls: ['./auth-table.component.scss'],
})
export class AuthTableComponent {
  @Input() view: 'default' | 'compact' = 'default';

  constructor(private userSvc: AuthUserService) {}

  refresh$ = new BehaviorSubject(null);

  dataSource$ = this.refresh$.pipe(
    switchMap(() => this.userSvc.paginate()),
    map(data => {
      const dataSource = new TableDataSource<AuthUser>(data.items);
      dataSource.columns = TABLE_COLS;
      dataSource.actions = TABLE_ROW_ACTIONS;
      return dataSource;
    })
  );
}
