import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CurrentUserService } from '../../state/current-user.service';

@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css'
})
export class HomePageComponent {
  protected readonly currentUserService = inject(CurrentUserService);

  get isLoggedIn(): boolean {
    return this.currentUserService.isLoggedIn();
  }
}

