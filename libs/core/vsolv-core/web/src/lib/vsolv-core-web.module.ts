import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { MatDialogModule } from '@angular/material/dialog';
import { firebase } from 'keys/firebase-web-key-vsolv-dev';

import { AuthWebModule } from '@vsolv/core/auth/web';
import { DowntimeWebModule } from '@vsolv/core/downtime/web';
import { AppType } from '@vsolv/core/multi-tenant/domain';
import { getMultiTenantProviders } from '@vsolv/core/multi-tenant/web';
import { UsersWebModule } from '@vsolv/core/users/web';
import { ApiInterceptorModule } from '@vsolv/dev-kit/ngx';
import { FirebaseWebModule } from '@vsolv/packages/firebase/web';
import { ProofOfConceptCountFeatureModule } from '@vsolv/poc/count/web';
import { BaseLayoutModule } from '@vsolv/ui-kit/base-layout';
import { LinksModule } from '@vsolv/ui-kit/links';
import { UtilsModule } from '@vsolv/ui-kit/utils';

import { CoreScaffoldComponent } from './components';

@NgModule({
  imports: [
    //Angular
    CommonModule,

    //Material
    MatDialogModule,

    //Core
    AngularFireModule.initializeApp(firebase),
    FirebaseWebModule,
    ApiInterceptorModule,
    AuthWebModule,
    UsersWebModule,
    // VectorSolv
    BaseLayoutModule,
    LinksModule,
    UtilsModule,
    ProofOfConceptCountFeatureModule,
  ],
  declarations: [CoreScaffoldComponent],
  exports: [CoreScaffoldComponent],
})
export class VSolvCoreWebModule {
  static forRoot(appType: AppType, apiBaseUrl: string) {
    return {
      ngModule: VSolvCoreWebModule,
      providers: [
        ...(ApiInterceptorModule.forRoot(apiBaseUrl).providers || []),
        ...(AuthWebModule.forRoot().providers || []),
        ...(getMultiTenantProviders(appType) || []),
        ...(DowntimeWebModule.forRoot().providers || []),
        ...(UsersWebModule.forRoot().providers || []),
      ],
    };
  }
}
