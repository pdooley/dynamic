import { Component, Inject, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SIGN_IN } from '../../constants';
import { AuthService } from '../../services';
import { SignInComponent } from '../abstract-sign-in.component';

@Component({
  selector: 'vsolv-sign-in-button',
  templateUrl: './sign-in-button.component.html',
  styleUrls: ['./sign-in-button.component.scss'],
})
export class SignInButtonComponent {
  constructor(
    private authSvc: AuthService,
    @Inject(SIGN_IN) private signInComponent: Type<SignInComponent>,
    private dialog: MatDialog
  ) {}

  isSignedIn$ = this.authSvc.isSignedIn$();

  signIn() {
    this.dialog.open(this.signInComponent);
  }
  signOut() {
    this.authSvc.signOut();
  }
}
