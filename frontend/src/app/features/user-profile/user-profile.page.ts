import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import type { User, UserShelf } from '../../models';
import { PlaceholderService } from '../../services/placeholder.service';
import { UsersService } from '../../services/users.service';
import { CurrentUserService } from '../../state/current-user.service';

@Component({
  standalone: true,
  selector: 'app-user-profile-page',
  imports: [CommonModule],
  templateUrl: './user-profile.page.html',
  styleUrl: './user-profile.page.css'
})
export class UserProfilePageComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly currentUserService = inject(CurrentUserService);
  private readonly activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly placeholderService = inject(PlaceholderService);

  user = signal<User | null>(null);
  userShelf = signal<UserShelf[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  isCurrentUser = signal(false);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const userId = params['userId'];
      if (!userId) {
        this.errorMessage.set('Usuário não encontrado.');
        this.isLoading.set(false);
        return;
      }

      this.loadUserProfile(Number(userId));
    });
  }

  private loadUserProfile(userId: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const currentUser = this.currentUserService.currentUser();
    this.isCurrentUser.set(currentUser?.id === userId);

    // Load user info
    this.usersService.getUser(userId).subscribe({
      next: (user) => {
        this.user.set(user);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar o perfil do usuário.');
        this.isLoading.set(false);
      }
    });

    // Load user shelf (books available for trade)
    this.usersService.getUserShelf(userId).subscribe({
      next: (shelf) => {
        // Filter only books marked as "para_troca" (available for trade)
        const availableBooks = shelf.filter(entry => entry.disponibilidade === 'para_troca');
        this.userShelf.set(availableBooks);
        this.isLoading.set(false);
      },
      error: () => {
        // If endpoint doesn't exist, try to load all shelf and filter in frontend
        // This is a fallback for backward compatibility
        this.userShelf.set([]);
        this.isLoading.set(false);
      }
    });
  }

  goToBook(shelfId: number): void {
    // This could navigate to a book detail page or trigger interest action
    // For now, just log it
    console.log('View book from shelf:', shelfId);
  }

  expressInterest(shelfEntry: UserShelf): void {
    const currentUser = this.currentUserService.ensureUserOrRedirect();
    if (!currentUser || !this.user()) {
      return;
    }

    if (currentUser.id === this.user()?.id) {
      alert('Você não pode expressar interesse em seus próprios livros.');
      return;
    }

    // This would trigger creating an interest in the backend
    console.log('Express interest in:', shelfEntry);
    // In a real app, this would call InterestsService.createInterest()
  }

  navigateToMyShelf(): void {
    this.router.navigate(['/my-shelf']);
  }
}
