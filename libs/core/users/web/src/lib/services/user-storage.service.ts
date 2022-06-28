import { Injectable } from '@angular/core';

export const USER_STORAGE_KEY = 'VSOLV_SIGNED_IN';

export interface SessionUser {
  authId: string;
  userId: string;
}
export interface LastSignInUser {
  authId: string;
  userId: string;
  timestamp: Date;
}
@Injectable({
  providedIn: 'root',
})
export class UserStorageService {
  getSignedInUser(authId: string): SessionUser | undefined {
    const sessionItem = sessionStorage.getItem(USER_STORAGE_KEY);
    if (sessionItem) {
      const item = JSON.parse(sessionItem);
      if (item.authId === authId) return item;
    }
    return undefined;
  }
  setSignedInUser(userId: string, authId: string) {
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ authId, userId }));
    this.setLastSignedInUser(userId, authId);
  }
  clearSignedInUser() {
    sessionStorage.removeItem(USER_STORAGE_KEY);
  }
  lastSignedInUser(): LastSignInUser | undefined {
    const localItem = localStorage.getItem(USER_STORAGE_KEY);
    if (localItem) {
      const item = JSON.parse(localItem);
      item.timestamp = new Date(item.timestamp);
      return item;
    }
    return undefined;
  }
  private setLastSignedInUser(userId: string, authId: string) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ authId, userId, timestamp: new Date() }));
  }
}
