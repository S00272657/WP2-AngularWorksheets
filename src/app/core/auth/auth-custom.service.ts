import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginUserDto, RegisterUserDto, User } from '../models/user';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthCustomService {

 private readonly apiUrl = "http://localhost:3000/api/v1"

  private http = inject(HttpClient);
  private router = inject(Router);

  // private, writable state: only this service can change it
  private readonly _token = signal<string | null>(null);
  private readonly _currentUser = signal<User | null>(null);

  // public, read-only state for components to use
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);

  private expiryTimer?: ReturnType<typeof setTimeout>;

  get token(): string | null {
    return this._token();
  }

  addUser(user: RegisterUserDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  login(userCredentials: LoginUserDto): Observable<User> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, userCredentials )
      .pipe(
        tap(res => {
          this._token.set(res.token);
          this._currentUser.set(res.user);
          this.startExpiryTimer(res.token);
        }),
        map(res => res.user)
      );
  }

  logout(): void {
    clearTimeout(this.expiryTimer);
    this._token.set(null);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

// This reads the payload in the token and sets a timer based on the expiry

  private startExpiryTimer(token: string): void {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    const msLeft = payload.exp * 1000 - Date.now();

    clearTimeout(this.expiryTimer);
    this.expiryTimer = setTimeout(() => this.logout(), msLeft);
  }

}
