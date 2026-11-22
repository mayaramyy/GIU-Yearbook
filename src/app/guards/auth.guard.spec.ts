import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, UrlTree } from '@angular/router';

import { AuthService, User } from '../services/auth.service';
import { authGuard } from './auth.guard';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';

describe('authGuard', () => {
  const maya: User = {
    studentId: 1,
    name: 'Maya Hassan'
  };

  const fakeAuth = {
    currentUser: signal<User | null>(null),
    checkSession: vi.fn(),
  };

  function runGuard() {
    return TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );
  }

  beforeEach(() => {
    fakeAuth.currentUser.set(null);
    fakeAuth.checkSession.mockReset();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: fakeAuth }
      ],
    });
  });

  it('lets a signed-in user in without asking the server', () => {
    fakeAuth.currentUser.set(maya);

    expect(runGuard()).toBe(true);
    expect(fakeAuth.checkSession).not.toHaveBeenCalled();
  });

  it('lets the user in when the cookie is still valid after a reload', async () => {
    fakeAuth.checkSession.mockReturnValue(of(maya));

    const result = await firstValueFrom(runGuard() as any);

    expect(result).toBe(true);
  });

  it('sends the visitor to /login when the server says 401', async () => {
    fakeAuth.checkSession.mockReturnValue(
      throwError(() => new Error('401'))
    );

    const result: boolean | UrlTree = await firstValueFrom(
  runGuard() as Observable<boolean | UrlTree>
);

    expect(result).toBeInstanceOf(UrlTree);
    expect(result.toString()).toBe('/login');
  });
});