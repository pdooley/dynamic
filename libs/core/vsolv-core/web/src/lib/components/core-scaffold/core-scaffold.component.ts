import { Component } from '@angular/core';
import { map, switchMap } from 'rxjs';

import { AuthService } from '@vsolv/core/auth/web';
import { TenantInfoService } from '@vsolv/core/multi-tenant/web';
import { UserService } from '@vsolv/core/users/web';

@Component({
  selector: 'vsolv-core-scaffold',
  templateUrl: './core-scaffold.component.html',
  styleUrls: ['./core-scaffold.component.scss'],
})
export class CoreScaffoldComponent {
  header$ = this.tenantInfoSvc.tenantInfo$.pipe(map(info => ({ title: `Dashboard - ${info?.name}` })));

  constructor(private tenantInfoSvc: TenantInfoService, private authSvc: AuthService, private userSvc: UserService) {}
  isSignedIn$ = this.authSvc.isSignedIn$();
  currentUser$ = this.isSignedIn$.pipe(
    switchMap(async isSignedIn => {
      return isSignedIn ? await this.userSvc.getSelf() : undefined;
    })
  );
}
