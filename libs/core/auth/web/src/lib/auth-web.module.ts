import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TableModule } from '@vsolv/ui-kit/table';
import { UtilsModule } from '@vsolv/ui-kit/utils';

import { SignInButtonComponent } from './components';
import { AuthIdInterceptor } from './interceptors';
import { AuthService } from './services';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatIconModule, UtilsModule, TableModule],
  declarations: [SignInButtonComponent],
  exports: [SignInButtonComponent],
  providers: [AuthService],
})
export class AuthWebModule {
  static forRoot() {
    return {
      ngModule: AuthWebModule,
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthIdInterceptor, multi: true }],
    };
  }
}
