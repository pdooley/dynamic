import { Component, Input } from '@angular/core';
//delete me
import { User } from '@vsolv/core/users/domain';
import { TableDataSource } from '@vsolv/ui-kit/table';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { UserService } from '../../services';
import { TABLE_COLS, TABLE_ROW_ACTIONS } from './data';

@Component({
  selector: 'vsolv-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent {
  @Input() view: 'default' | 'compact' = 'default';

  constructor(private userSvc: UserService) {}

  refresh$ = new BehaviorSubject(null);

  dataSource$ = this.refresh$.pipe(
    switchMap(() => this.userSvc.paginate()),
    map(data => {
      const dataSource = new TableDataSource<User>(data?.items || []);
      // if (dataSource.paginator){
      //   dataSource.paginator.p;
      // }
      dataSource.columns = TABLE_COLS;
      dataSource.actions = TABLE_ROW_ACTIONS;
      return dataSource;
    })
  );
}
