import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TableModule } from '@vsolv/ui-kit/table';
import { UtilsModule } from '@vsolv/ui-kit/utils';

import { AuthTableComponent, AuthUserSignInComponent, UserProfilesTableComponent } from './components';
import { UserNameComponent } from './components/user-name/user-name.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { UserIdInterceptor } from './interceptors';
import { AuthUserService, UserStorageService } from './services';
import { UserService } from './services/user.service';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatIconModule, UtilsModule, TableModule],
  providers: [AuthUserService, UserService, UserStorageService],
  declarations: [
    UserTableComponent,
    AuthUserSignInComponent,
    AuthTableComponent,
    UserProfilesTableComponent,
    UserNameComponent,
  ],
  exports: [UserTableComponent, AuthUserSignInComponent, AuthTableComponent, UserNameComponent],
})
export class UsersWebModule {
  static forRoot() {
    return {
      ngModule: UsersWebModule,
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: UserIdInterceptor, multi: true }],
    };
  }
}
