import { Routes } from '@angular/router';

import { AdminPageComponent } from './features/admin/admin.page';
import { BookSearchPageComponent } from './features/book-search/book-search.page';
import { MyInterestsPage } from './features/my-interests/my-interests.page';
import { MyShelfPageComponent } from './features/my-shelf/my-shelf.page';
import { OnboardingPageComponent } from './features/onboarding/onboarding.page';
import { UserProfilePageComponent } from './features/user-profile/user-profile.page';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'books',
    pathMatch: 'full'
  },
  {
    path: 'onboarding',
    component: OnboardingPageComponent,
    canActivate: [publicGuard]
  },
  {
    path: 'my-shelf',
    component: MyShelfPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'my-interests',
    component: MyInterestsPage,
    canActivate: [authGuard]
  },
  {
    path: 'books',
    component: BookSearchPageComponent
  },
  {
    path: 'profile/:userId',
    component: UserProfilePageComponent
  },
  {
    path: 'admin',
    component: AdminPageComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'books'
  }
];

