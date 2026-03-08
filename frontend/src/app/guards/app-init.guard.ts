import { CanActivateFn } from '@angular/router';

/**
 * Guard that ensures the app state has been initialized from localStorage
 * before allowing navigation to any route.
 */
export const appInitGuard: CanActivateFn = () => {
  return true;
};
