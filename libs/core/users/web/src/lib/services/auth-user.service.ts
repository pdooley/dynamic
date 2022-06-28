import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthUser } from '@vsolv/core/auth/domain';
import { User } from '@vsolv/core/users/domain';
import { PaginationQueryResponse } from '@vsolv/dev-kit/nest';

@Injectable({
  providedIn: 'root',
})
export class AuthUserService {
  constructor(private http: HttpClient) {}

  async paginate() {
    return firstValueFrom(this.http.get<PaginationQueryResponse<AuthUser>>(`/api/auth-user/paginate`));
  }
  async getOneByUser(userId: string) {
    return firstValueFrom(this.http.get<AuthUser>(`/api/auth-user/${userId}`));
  }
  async getUsersForAuth() {
    return firstValueFrom(this.http.get<User[]>(`/api/auth-user`));
  }
}
