import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { DowntimeInterceptor } from './interceptors';

@NgModule({
  imports: [CommonModule, MatSnackBarModule],
})
export class DowntimeWebModule {
  static forRoot(): ModuleWithProviders<DowntimeWebModule> {
    return {
      ngModule: DowntimeWebModule,
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: DowntimeInterceptor, multi: true }],
    };
  }
}
