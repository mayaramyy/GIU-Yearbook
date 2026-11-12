
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

type User = Record<string, unknown>;

interface LoginCredentials {
  email: string;
  password: string;
  remember: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _currentUser = signal<User | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);

  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<User>('/mock-api/login', credentials, {
      withCredentials: true
    }).pipe(
      tap(user => this._currentUser.set(user))
    );
  }

  checkSession(): Observable<User> {
    return this.http.get<User>('/mock-api/me', {
      withCredentials: true
    }).pipe(
      tap(user => this._currentUser.set(user))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>('/mock-api/logout', {}, {
      withCredentials: true
    }).pipe(
      tap(() => this._currentUser.set(null))
    );
  }
}
