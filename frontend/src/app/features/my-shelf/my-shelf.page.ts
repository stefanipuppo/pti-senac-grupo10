import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import type { Book, Disponibilidade, Genre, User, UserShelf } from '../../models';
import { BooksService } from '../../services/books.service';
import { GenresService } from '../../services/genres.service';
import { PlaceholderService } from '../../services/placeholder.service';
import { ShelfService } from '../../services/shelf.service';
import { CurrentUserService } from '../../state/current-user.service';

@Component({
  standalone: true,
  selector: 'app-my-shelf-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-shelf.page.html',
  styleUrl: './my-shelf.page.css'
})
export class MyShelfPageComponent implements OnInit {
  private readonly shelfService = inject(ShelfService);
  private readonly booksService = inject(BooksService);
  private readonly genresService = inject(GenresService);
  private readonly currentUserService = inject(CurrentUserService);
  readonly placeholderService = inject(PlaceholderService);

  // Core data
  entries = signal<UserShelf[]>([]);
  genres = signal<Genre[]>([]);

  // States
  isLoading = signal(true);
  isSaving = signal(false);
  savingEntryId = signal<number | null>(null);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isFormExpanded = signal(false);
  deleteConfirm = signal<UserShelf | null>(null);
  lastDeletedEntry = signal<{ entry: UserShelf; timestamp: number } | null>(null);
  editingEntryId = signal<number | null>(null);
  undoCountdown = signal<number>(0);

  // Alert management
  private messageQueue = signal<Array<{ type: 'error' | 'success'; message: string }>>([]);
  private messageTimeout: ReturnType<typeof setTimeout> | null = null;
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  // Add form
  addTitulo = '';
  addAutor = '';
  addGenreId: number | null = null;
  addDisponibilidade: Disponibilidade = 'colecao';
  addEstadoConservacao = '';

  // Filter & search
  searchTerm = signal('');
  filterDisponibilidade = signal<Disponibilidade | 'todos'>('todos');
  filterGenreId = signal<number | null>(null);
  sortBy = signal<'titulo' | 'autor' | 'recente'>('titulo');

  // Computed data
  filteredEntries = computed(() => {
    let result = this.entries();

    // Search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(
        (e) =>
          e.livro.titulo.toLowerCase().includes(search) ||
          e.livro.autor.toLowerCase().includes(search)
      );
    }

    // Disponibilidade filter
    const disp = this.filterDisponibilidade();
    if (disp !== 'todos') {
      result = result.filter((e) => e.disponibilidade === disp);
    }

    // Genre filter
    const genreId = this.filterGenreId();
    if (genreId !== null) {
      result = result.filter((e) => e.livro.genero?.id === genreId);
    }

    // Sort
    const sort = this.sortBy();
    if (sort === 'titulo') {
      result.sort((a, b) => (a.livro.titulo ?? '').localeCompare(b.livro.titulo ?? ''));
    } else if (sort === 'autor') {
      result.sort((a, b) => (a.livro.autor ?? '').localeCompare(b.livro.autor ?? ''));
    } else if (sort === 'recente') {
      result.reverse();
    }

    return result;
  });

  // Summary stats
  totalBooks = computed(() => this.entries().length);
  booksForTrade = computed(
    () => this.entries().filter((e) => e.disponibilidade === 'para_troca').length
  );
  booksInCollection = computed(
    () => this.entries().filter((e) => e.disponibilidade === 'colecao').length
  );

  // Form validation
  isFormValid(): boolean {
    return (
      this.addTitulo.trim() !== '' &&
      this.addAutor.trim() !== '' &&
      this.addGenreId !== null &&
      this.addEstadoConservacao.trim() !== ''
    );
  }

  ngOnInit(): void {
    const user = this.currentUserService.ensureUserOrRedirect();
    if (!user) {
      this.isLoading.set(false);
      return;
    }

    this.loadData(user);
  }

  private loadData(user: User): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.genresService.listGenres().subscribe({
      next: (genres) => this.genres.set(genres),
      error: () => {
        this.errorMessage.set('Não foi possível carregar os gêneros.');
      }
    });

    this.shelfService.listShelf().subscribe({
      next: (allEntries) => {
        const mine = allEntries.filter((e) => e.usuario.id === user.id);
        this.entries.set(mine);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar sua estante.');
        this.isLoading.set(false);
      }
    });
  }

  toggleFormExpanded(): void {
    this.isFormExpanded.update((v) => !v);
  }

  addToShelf(): void {
    const user = this.currentUserService.ensureUserOrRedirect();
    if (!user || !this.isFormValid() || this.isSaving()) {
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    this.booksService
      .createBook({
        titulo: this.addTitulo,
        autor: this.addAutor,
        genero: { id: this.addGenreId! }
      })
      .subscribe({
        next: (book: Book) => {
          this.shelfService
            .createShelfEntry({
              usuario: { id: user.id },
              livro: { id: book.id },
              disponibilidade: this.addDisponibilidade,
              estadoConservacao: this.addEstadoConservacao
            })
            .subscribe({
              next: () => {
                // Recarrega a estante completa para garantir que todos os dados (livro, gênero) estejam presentes
                this.shelfService.listShelf().subscribe({
                  next: (allEntries) => {
                    const mine = allEntries.filter((e) => e.usuario.id === user.id);
                    this.entries.set(mine);
                  }
                });
                this.showSuccessMessage('✅ Livro adicionado com sucesso!', 3000);
                this.resetAddForm();
                this.isFormExpanded.set(false);
                this.isSaving.set(false);

                // Scroll para a seção de livros
                setTimeout(() => {
                  const booksSection = document.querySelector('section:has(.shelf-grid)');
                  booksSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 200);
              },
              error: () => {
                this.showErrorMessage('Não foi possível adicionar o livro à estante.');
                this.isSaving.set(false);
              }
            });
        },
        error: () => {
          this.showErrorMessage('Não foi possível criar o livro.');
          this.isSaving.set(false);
        }
      });
  }

  private resetAddForm(): void {
    this.addTitulo = '';
    this.addAutor = '';
    this.addGenreId = null;
    this.addDisponibilidade = 'colecao';
    this.addEstadoConservacao = '';
  }

  setDisponibilidade(entry: UserShelf, disponibilidade: Disponibilidade): void {
    if (this.isSaving() || entry.disponibilidade === disponibilidade) {
      return;
    }

    const updated: UserShelf = { ...entry, disponibilidade };
    this.editingEntryId.set(entry.id);
    this.saveEntry(updated);
  }

  saveEstadoConservacao(entry: UserShelf): void {
    if (this.isSaving()) {
      return;
    }

    const updated: UserShelf = { ...entry };
    this.editingEntryId.set(entry.id);
    this.saveEntry(updated);
  }

  private saveEntry(entry: UserShelf): void {
    this.savingEntryId.set(entry.id);
    this.errorMessage.set(null);

    this.shelfService.updateShelfEntry(entry.id, entry).subscribe({
      next: (saved) => {
        this.entries.update((list) => list.map((e) => (e.id === saved.id ? saved : e)));
        this.showSuccessMessage('✅ Alterações salvas!', 2000);
        this.savingEntryId.set(null);
        this.editingEntryId.set(null);
      },
      error: () => {
        this.showErrorMessage('Não foi possível salvar as alterações.');
        this.savingEntryId.set(null);
      }
    });
  }

  showDeleteConfirm(entry: UserShelf): void {
    this.deleteConfirm.set(entry);
  }

  cancelDelete(): void {
    this.deleteConfirm.set(null);
  }

  removeEntry(entry: UserShelf): void {
    if (this.isSaving()) {
      return;
    }
    this.savingEntryId.set(entry.id);
    this.errorMessage.set(null);

    this.shelfService.deleteShelfEntry(entry.id).subscribe({
      next: () => {
        this.entries.update((list) => list.filter((e) => e.id !== entry.id));
        this.lastDeletedEntry.set({ entry, timestamp: Date.now() });
        this.showSuccessMessage('📖 Livro removido', 5000);
        this.deleteConfirm.set(null);
        this.savingEntryId.set(null);

        // Start countdown for undo
        this.startUndoCountdown(5);
      },
      error: () => {
        this.showErrorMessage('Não foi possível remover o livro da estante.');
        this.savingEntryId.set(null);
      }
    });
  }

  private startUndoCountdown(seconds: number): void {
    // Clear any existing interval
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.undoCountdown.set(seconds);

    this.countdownInterval = setInterval(() => {
      const current = this.undoCountdown();
      if (current > 1) {
        this.undoCountdown.set(current - 1);
      } else {
        this.undoCountdown.set(0);
        this.clearUndoCountdown();
        // Auto-clear deleted entry after countdown
        if (this.lastDeletedEntry()) {
          this.lastDeletedEntry.set(null);
        }
      }
    }, 1000);
  }

  private clearUndoCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  undoRemove(): void {
    const lastDeleted = this.lastDeletedEntry();
    if (!lastDeleted) return;

    this.clearUndoCountdown();
    this.savingEntryId.set(lastDeleted.entry.id);
    this.errorMessage.set(null);

    this.shelfService
      .createShelfEntry({
        usuario: lastDeleted.entry.usuario,
        livro: lastDeleted.entry.livro,
        disponibilidade: lastDeleted.entry.disponibilidade,
        estadoConservacao: lastDeleted.entry.estadoConservacao
      })
      .subscribe({
        next: (newEntry) => {
          this.entries.update((list) => [...list, newEntry]);
          this.showSuccessMessage('✅ Livro restaurado!', 2000);
          this.lastDeletedEntry.set(null);
          this.savingEntryId.set(null);
        },
        error: () => {
          this.showErrorMessage('Não foi possível desfazer a remoção.');
          this.savingEntryId.set(null);
        }
      });
  }

  private showSuccessMessage(message: string, duration: number = 2500): void {
    // Clear any existing timeout
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }

    // Clear error message if exists
    this.errorMessage.set(null);

    // Show success message
    this.successMessage.set(message);

    // Auto-clear after duration
    this.messageTimeout = setTimeout(() => {
      this.successMessage.set(null);
      this.messageTimeout = null;
    }, duration);
  }

  private showErrorMessage(message: string, duration: number = 3000): void {
    // Clear any existing timeout
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }

    // Clear success message if exists
    this.successMessage.set(null);

    // Show error message
    this.errorMessage.set(message);

    // Auto-clear after duration
    this.messageTimeout = setTimeout(() => {
      this.errorMessage.set(null);
      this.messageTimeout = null;
    }, duration);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.filterDisponibilidade.set('todos');
    this.filterGenreId.set(null);
    this.sortBy.set('titulo');
  }

  // Event handlers for template
  onDisponibilidadeChange(value: string): void {
    this.filterDisponibilidade.set(value as Disponibilidade | 'todos');
  }

  onGenreChange(value: string): void {
    this.filterGenreId.set(value ? Number(value) : null);
  }

  onSortChange(value: string): void {
    this.sortBy.set(value as 'titulo' | 'autor' | 'recente');
  }
}

