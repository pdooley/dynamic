import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TenantService } from '../../services';

@Component({
  selector: 'poc-new-tenant',
  templateUrl: './new-tenant.dialog.html',
  styleUrls: ['./new-tenant.dialog.scss'],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class NewTenantDialog {
  constructor(
    private tenantSvc: TenantService,
    private formBuilder: FormBuilder,
    private snacks: MatSnackBar,
    private dialog: MatDialogRef<NewTenantDialog>
  ) {}

  form = this.formBuilder.group({
    name: ['', Validators.required],
  });

  async submit() {
    if (!this.form.valid) {
      this.snacks.open('Form is not filled out accurately', 'Ok!', { duration: 2500, panelClass: 'mat-warn' });
      return;
    }
    const name = this.form.value.name;
    const tenant = await this.tenantSvc.create(name);
    if (tenant) {
      this.snacks.open('Tenant created!', 'Ok!', { duration: 2500, panelClass: 'mat-primary' });
    } else this.snacks.open('Something went wrong!', 'Ok!', { duration: 2500, panelClass: 'mat-warn' });
    this.dialog.close();
  }
}
