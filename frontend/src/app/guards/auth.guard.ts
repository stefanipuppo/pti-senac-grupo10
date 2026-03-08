import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CurrentUserService } from '../state/current-user.service';

const RETURN_URL_KEY = 'bookexchange_return_url';

/**
 * Guard that ensures the user is authenticated.
 * Saves the attempted URL so onboarding can redirect back after login.
 * If not authenticated, redirects to /onboarding.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const currentUserService = inject(CurrentUserService);
  const router = inject(Router);

  if (currentUserService.isLoggedIn()) {
    return true;
  }

  sessionStorage.setItem(RETURN_URL_KEY, state.url);
  router.navigate(['/onboarding']).catch(() => {});
  return false;
};
