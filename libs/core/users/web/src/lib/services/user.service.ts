import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '@vsolv/core/auth/web';
import { User } from '@vsolv/core/users/domain';
import { PaginationQueryResponse } from '@vsolv/dev-kit/nest';

import { AuthUserSignInComponent } from '../components';
import { AuthUserService } from './auth-user.service';
import { LastSignInUser, UserStorageService } from './user-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private authSvc: AuthService,
    private userStorageSvc: UserStorageService,
    private dialog: MatDialog,
    private authUserSvc: AuthUserService
  ) {}

  async getSelf(): Promise<User | undefined> {
    const authId = await firstValueFrom(this.authSvc.getAuthId$());
    if (authId) {
      //retrieve current user if applicable
      let user = await this.getCurrentUser(authId);
      if (user) return user;
      //retrieve last user if applicable
      user = await this.getLastSignedInUser(authId, this.userStorageSvc.lastSignedInUser());
      if (user) return user;
      //if no current or last user, retrieve profiles associated with auth
      const users = (await this.authUserSvc.getUsersForAuth()) || [];
      if (users.length > 1) {
        //multiple profiles exist for auth, prompt for selection
        const profileDialog = this.dialog.open(AuthUserSignInComponent, { data: users });
        const selectedUser = await firstValueFrom(profileDialog.afterClosed());
        //a profile was selected, sign them in
        if (selectedUser) {
          this.userStorageSvc.setSignedInUser(selectedUser.id, authId);
          return selectedUser;
        }
      } else if (users.length === 1) {
        //only one user profile exists for auth, sign in that profile
        this.userStorageSvc.setSignedInUser(users[0].id, authId);
        return users[0];
      }
      //somehow no users exist under the auth, ensure one
      user = await this.ensureUser();
      return user;
    }
    return undefined;
  }
  private async getCurrentUser(authId: string) {
    //if currentId, retrieve the corresponding user
    const currentId = this.userStorageSvc.getSignedInUser(authId);
    if (currentId) return await this.getOne(currentId.userId);
    return undefined;
  }
  private async getLastSignedInUser(authId: string, lastId?: LastSignInUser) {
    //if last signed in id is the same auth, retrieve that user and sign them in
    if (lastId && lastId.authId === authId) {
      const user = await this.getOne(lastId.userId);
      if (user) this.userStorageSvc.setSignedInUser(user?.id, lastId.authId);
      return user;
    }
    return undefined;
  }

  async getOne(userId: string) {
    return firstValueFrom(this.http.get<User>(`/api/users/${userId}`));
  }
  async paginate() {
    return firstValueFrom(this.http.get<PaginationQueryResponse<User>>(`/api/users/paginate`));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createNewUser(dto?: any) {
    //TODO: dto
    return firstValueFrom(this.http.post<User>(`/api/users`, dto));
  }

  async ensureUser() {
    const user = await firstValueFrom(this.http.post<User>(`/api/users/ensure`, {}));
    if (user) {
      const auth = await firstValueFrom(this.authSvc.getAuthId$());
      if (auth) this.userStorageSvc.setSignedInUser(user.id, auth);
    }
    return user;
  }
}
