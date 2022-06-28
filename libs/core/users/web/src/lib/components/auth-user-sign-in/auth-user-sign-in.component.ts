import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, switchMap } from 'rxjs';

import { AuthService } from '@vsolv/core/auth/web';
import { User } from '@vsolv/core/users/domain';

import { AuthUserService, UserService, UserStorageService } from '../../services';

@Component({
  selector: 'vsolv-auth-user-sign-in',
  templateUrl: './auth-user-sign-in.component.html',
  styleUrls: ['./auth-user-sign-in.component.scss'],
})
export class AuthUserSignInComponent {
  static isOpen = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) data: User[],
    private authSvc: AuthService,
    private userSvc: UserService,
    private authUserSvc: AuthUserService,
    private localUser: UserStorageService,
    private dialogRef: MatDialogRef<AuthUserSignInComponent>,
    private snacks: MatSnackBar
  ) {
    this.dialogRef.disableClose = true;
    if (!data || !data.length || data.length === 0) this.close();
    this.profiles = data;
    AuthUserSignInComponent.isOpen = true;
  }

  profiles!: User[];

  lastSignedIn$ = this.authSvc.getAuthId$().pipe(
    switchMap(async authId => {
      if (!authId) return undefined;
      const lastSignedIn = this.localUser.lastSignedInUser();
      if (lastSignedIn && lastSignedIn.authId === authId) {
        const lastUser = await this.userSvc.getOne(lastSignedIn.userId);
        return { displayName: lastUser.displayName, timestamp: lastSignedIn.timestamp };
      } else return undefined;
    })
  );

  async chooseUser(user: User) {
    const authId = await firstValueFrom(this.authSvc.getAuthId$());
    if (authId) {
      if (!(await this.authUserSvc.getOneByUser(user.id))) {
        this.snacks.open('Something went wrong', 'Ok!', { duration: 2500, panelClass: 'mat-warn' });
        this.cancel();
        return;
      }
      this.localUser.setSignedInUser(user.id, authId);
      this.close(user);
    } else {
      this.snacks.open('Something went wrong', 'Ok!', { duration: 2500, panelClass: 'mat-warn' });
      this.cancel();
      return;
    }

    this.close();
  }

  async cancel() {
    await this.authSvc.signOut();
    this.close();
  }

  async createNew() {
    const user = await this.userSvc.createNewUser();
    if (user) {
      this.close(user);
      this.snacks.open('Profile created successfully!', '', { duration: 2500, panelClass: 'mat-primary' });
    } else {
      this.snacks.open('An error occurred creating the profile', 'Ok!', { duration: 2500, panelClass: 'mat-warn' });
    }
  }

  close(user?: User) {
    AuthUserSignInComponent.isOpen = false;
    this.dialogRef.close(user);
  }
}
