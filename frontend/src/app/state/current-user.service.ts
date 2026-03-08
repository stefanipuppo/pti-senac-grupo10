import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import type { User } from '../models';

const STORAGE_KEY = 'bookexchange_current_user';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private readonly router = inject(Router);
  private readonly userSignal = signal<User | null>(this.loadFromStorage());
  private readonly initializedSignal = signal(true);

  readonly isLoggedIn = computed(() => this.userSignal() !== null);

  private loadFromStorage(): User | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }

      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  private saveToStorage(user: User | null): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      if (user) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors.
    }
  }

  currentUser(): User | null {
    return this.userSignal();
  }

  setCurrentUser(user: User): void {
    this.userSignal.set(user);
    this.saveToStorage(user);
  }

  clearCurrentUser(): void {
    this.userSignal.set(null);
    this.saveToStorage(null);
  }

  ensureUserOrRedirect(): User | null {
    const user = this.userSignal();
    if (!user) {
      this.router.navigate(['/onboarding']).catch(() => {});
    }

    return user;
  }

  isInitialized(): boolean {
    return this.initializedSignal();
  }
}

