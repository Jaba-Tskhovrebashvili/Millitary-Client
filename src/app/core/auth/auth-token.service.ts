import { Injectable, signal } from '@angular/core';

interface JwtPayload {
  Id?: string;
  exp?: number;
  [claim: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  private readonly storageKey = 'ms_access_token';
  private readonly _token = signal<string | null>(this.readStorage());

  readonly token = this._token.asReadonly();

  set(token: string): void {
    this._token.set(token);
    try {
      localStorage.setItem(this.storageKey, token);
    } catch {
    }
  }

  clear(): void {
    this._token.set(null);
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
    }
  }

  isAuthenticated(): boolean {
    const payload = this.payload();
    if (!payload) return false;
    return !payload.exp || payload.exp * 1000 > Date.now();
  }

  adminId(): number | null {
    const id = Number(this.payload()?.Id);
    return Number.isFinite(id) && id > 0 ? id : null;
  }

  private payload(): JwtPayload | null {
    const token = this._token();
    if (!token) return null;
    try {
      const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(part)
          .split('')
          .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join(''),
      );
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }

  private readStorage(): string | null {
    try {
      return localStorage.getItem(this.storageKey);
    } catch {
      return null;
    }
  }
}
