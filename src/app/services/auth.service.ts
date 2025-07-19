import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('auth', 'true');
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('auth');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('auth') === 'true';
  }
}
