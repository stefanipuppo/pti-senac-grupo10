import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { User } from '../../models';
import { BookInterest, InterestsService } from '../../services/interests.service';
import { CurrentUserService } from '../../state/current-user.service';

@Component({
  selector: 'app-my-interests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-interests.page.html',
  styleUrls: ['./my-interests.page.css']
})
export class MyInterestsPage implements OnInit {
  private readonly interestsService = inject(InterestsService);
  private readonly currentUserService = inject(CurrentUserService);

  interests = signal<BookInterest[]>([]);
  isLoading = signal(true);
  isSaving = signal(false);
  showNotImplementedModal = signal(false);
  deleteConfirm = signal<BookInterest | null>(null);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  private messageTimeout: ReturnType<typeof setTimeout> | null = null;

  currentUser = computed(() => this.currentUserService.currentUser());

  ngOnInit(): void {
    const userId = this.currentUser()?.id;
    if (userId) {
      this.loadInterests(userId);
    }
  }

  private loadInterests(userId: number): void {
    this.interestsService.getInterestsByUser(userId).subscribe({
      next: (data) => {
        this.interests.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.showErrorMessage('Não foi possível carregar os interesses.');
        this.isLoading.set(false);
      }
    });
  }

  getDisplayName(user: User | null): string {
    if (!user) return 'Usuário desconhecido';
    return user.nome || user.email;
  }

  showNotImplemented(): void {
    this.showNotImplementedModal.set(true);
  }

  closeNotImplementedModal(): void {
    this.showNotImplementedModal.set(false);
  }

  showDeleteConfirm(interest: BookInterest): void {
    this.deleteConfirm.set(interest);
  }

  cancelDelete(): void {
    this.deleteConfirm.set(null);
  }

  removeInterest(interest: BookInterest): void {
    if (this.isSaving()) return;
    this.isSaving.set(true);

    this.interestsService.deleteInterest(interest.id).subscribe({
      next: () => {
        this.interests.update((list) => list.filter((i) => i.id !== interest.id));
        this.deleteConfirm.set(null);
        this.isSaving.set(false);
        this.showSuccessMessage('✅ Interesse removido.');
      },
      error: () => {
        this.deleteConfirm.set(null);
        this.isSaving.set(false);
        this.showErrorMessage('Não foi possível remover o interesse.');
      }
    });
  }

  private showSuccessMessage(message: string, duration = 3000): void {
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
    this.errorMessage.set(null);
    this.successMessage.set(message);
    this.messageTimeout = setTimeout(() => this.successMessage.set(null), duration);
  }

  private showErrorMessage(message: string, duration = 3000): void {
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
    this.successMessage.set(null);
    this.errorMessage.set(message);
    this.messageTimeout = setTimeout(() => this.errorMessage.set(null), duration);
  }
}
