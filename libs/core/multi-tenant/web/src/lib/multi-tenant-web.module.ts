import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthWebModule } from '@vsolv/core/auth/web';
import { AppType } from '@vsolv/core/multi-tenant/domain';
import { UsersWebModule } from '@vsolv/core/users/web';
import { BaseLayoutModule } from '@vsolv/ui-kit/base-layout';
import { LinksModule } from '@vsolv/ui-kit/links';
import { TableModule } from '@vsolv/ui-kit/table';
import { UtilsModule } from '@vsolv/ui-kit/utils';

import { TenantsTableComponent } from './components';
import { NewTenantDialog } from './dialogs';
import { REQUIRE_TENANT_ID, TenantIdInterceptor } from './interceptors';
import { TenantsPage } from './pages/tenants-page/tenants.page';
import { TenantInfoService, TenantService } from './services';

@NgModule({
  imports: [
    //Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,

    //Material
    MatButtonModule,

    //Vsolv
    AuthWebModule,
    UsersWebModule,
    BaseLayoutModule,
    LinksModule,
    TableModule,
    UtilsModule,
  ],
  declarations: [TenantsTableComponent, NewTenantDialog, TenantsPage],
  providers: [TenantService],
  exports: [TenantsTableComponent, TenantsPage],
})
export class MultiTenancyPlatformWebModule {
  static forRoot(): ModuleWithProviders<MultiTenancyPlatformWebModule> {
    return {
      ngModule: MultiTenancyPlatformWebModule,
      providers: [],
    };
  }
}

@NgModule({
  imports: [CommonModule],
  providers: [TenantInfoService],
})
export class MultiTenancyTenantWebModule {
  /** Registers the TenantIdInterceptor to handle requests and responses with tenant id */
  static forRoot(requireTenant: boolean): ModuleWithProviders<MultiTenancyTenantWebModule> {
    return {
      ngModule: MultiTenancyTenantWebModule,
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TenantIdInterceptor, multi: true },
        { provide: REQUIRE_TENANT_ID, useValue: requireTenant },
      ],
    };
  }
}

export function getMultiTenantProviders(appType: AppType, requireTenant: boolean) {
  switch (appType) {
    case AppType.PLATFORM:
      return MultiTenancyPlatformWebModule.forRoot().providers;
    case AppType.TENANT:
      return MultiTenancyTenantWebModule.forRoot(requireTenant).providers;

    default:
      return [];
  }
}
