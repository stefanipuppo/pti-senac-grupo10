import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CurrentUserService } from '../state/current-user.service';

/**
 * Guard that ensures the user is NOT authenticated.
 * Used for public pages like login/registration.
 * If already authenticated, redirects to home.
 */
export const publicGuard: CanActivateFn = () => {
  const currentUserService = inject(CurrentUserService);
  const router = inject(Router);

  if (!currentUserService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/books']).catch(() => {});
  return false;
};
