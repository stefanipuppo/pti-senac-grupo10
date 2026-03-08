import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { CurrentUserService } from './state/current-user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly currentUserService = inject(CurrentUserService);
  private readonly router = inject(Router);

  readonly currentUser = this.currentUserService.currentUser.bind(this.currentUserService);
  readonly isLoggedIn = this.currentUserService.isLoggedIn;

  logout(): void {
    this.currentUserService.clearCurrentUser();
    this.router.navigate(['/books']).catch(() => {});
  }
}
