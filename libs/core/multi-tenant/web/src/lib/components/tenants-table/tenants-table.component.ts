import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, firstValueFrom, map, switchMap } from 'rxjs';

import { Tenant } from '@vsolv/core/multi-tenant/domain';
import { TableDataSource } from '@vsolv/ui-kit/table';

import { NewTenantDialog } from '../../dialogs';
import { TenantService } from '../../services';
import { TABLE_COLS, TABLE_ROW_ACTIONS } from './data';

@Component({
  selector: 'poc-tenants-table',
  templateUrl: './tenants-table.component.html',
  styleUrls: ['./tenants-table.component.scss'],
})
export class TenantsTableComponent {
  @Input() view: 'default' | 'compact' = 'default';

  constructor(private dialog: MatDialog, private tenantSvc: TenantService) {}

  refresh$ = new BehaviorSubject(null);

  dataSource$ = this.refresh$.pipe(
    switchMap(() => this.tenantSvc.paginate()),
    map(data => {
      const dataSource = new TableDataSource<Tenant>(data.items);
      // if (dataSource.paginator){
      //   dataSource.paginator.p;
      // }
      dataSource.columns = TABLE_COLS;
      dataSource.actions = TABLE_ROW_ACTIONS;
      return dataSource;
    })
  );

  async create() {
    const dialog = this.dialog.open(NewTenantDialog);
    await firstValueFrom(dialog.afterClosed());
    this.refresh$.next(null);
  }
}
