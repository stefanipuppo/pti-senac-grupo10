import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import type { Genre } from '../../models';
import { BooksService, type AvailableBook, type AvailableBookOwner } from '../../services/books.service';
import { GenresService } from '../../services/genres.service';
import { InterestsService } from '../../services/interests.service';
import { PlaceholderService } from '../../services/placeholder.service';
import { CurrentUserService } from '../../state/current-user.service';

@Component({
  standalone: true,
  selector: 'app-book-search-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-search.page.html',
  styleUrl: './book-search.page.css'
})
export class BookSearchPageComponent implements OnInit, OnDestroy {
  private readonly booksService = inject(BooksService);
  private readonly genresService = inject(GenresService);
  private readonly currentUserService = inject(CurrentUserService);
  private readonly interestsService = inject(InterestsService);
  readonly placeholderService = inject(PlaceholderService);

  titulo = '';
  autor = '';
  genreId: number | null = null;
  sortBy = 'titulo'; // titulo, autor, genero, relevancia

  genres = signal<Genre[]>([]);
  results = signal<AvailableBook[]>([]);
  // Mapeia shelfId -> interestId para permitir desregistrar
  registeredInterests = signal<Map<number, number>>(new Map());

  currentPage = signal(0);
  pageSize = signal(10);
  totalPages = signal(0);
  pageInfo = signal<{ pageNumber: number; pageSize: number; totalElements: number; totalPages: number; last: boolean } | null>(null);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  private readonly destroy$ = new Subject<void>();
  readonly textSearch$ = new Subject<void>();

  ngOnInit(): void {
    this.genresService.listGenres().subscribe({
      next: (genres) => this.genres.set(genres)
    });

    const currentUser = this.currentUserService.currentUser();
    if (currentUser) {
      this.interestsService.getInterestsByUser(currentUser.id).subscribe({
        next: (interests) => {
          const map = new Map<number, number>();
          for (const i of interests) {
            if (i.shelf?.id != null) map.set(i.shelf.id, i.id);
          }
          this.registeredInterests.set(map);
        }
      });
    }

    // Debounce para campos de texto
    this.textSearch$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.search());

    this.search();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTextChange(): void {
    this.textSearch$.next();
  }

  onGenreChange(): void {
    this.search();
  }

  search(): void {
    this.currentPage.set(0);
    this.loadResults();
  }

  loadResults(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const filters: { titulo?: string; autor?: string; genre?: number } = {};
    if (this.titulo) {
      filters.titulo = this.titulo;
    }
    if (this.autor) {
      filters.autor = this.autor;
    }
    if (this.genreId != null) {
      filters.genre = this.genreId;
    }

    const currentUser = this.currentUserService.currentUser();

    this.booksService.listAvailableBooksWithPagination(
      filters,
      currentUser?.id,
      this.currentPage(),
      this.pageSize(),
      this.sortBy
    ).subscribe({
      next: (response: any) => {
        // Handle both paginated and non-paginated responses
        if (response.content) {
          // Paginated response
          this.results.set(response.content);
          this.pageInfo.set({
            pageNumber: response.pageNumber,
            pageSize: response.pageSize,
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            last: response.last
          });
        } else if (Array.isArray(response)) {
          // Non-paginated response (backward compatible)
          this.results.set(response);
          this.pageInfo.set(null);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível buscar livros.');
        this.isLoading.set(false);
      }
    });
  }

  nextPage(): void {
    if (this.pageInfo() && !this.pageInfo()!.last) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadResults();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadResults();
    }
  }

  changeSortBy(newSort: string): void {
    this.sortBy = newSort;
    this.search();
  }

  expressInterest(book: AvailableBook, owner: AvailableBookOwner): void {
    const user = this.currentUserService.ensureUserOrRedirect();
    if (!user) {
      return;
    }

    if (owner.ownerId === user.id) {
      return;
    }

    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.interestsService.createInterest(owner.shelfId, user.id).subscribe({
      next: (interest) => {
        const map = new Map(this.registeredInterests());
        map.set(owner.shelfId, interest.id);
        this.registeredInterests.set(map);

        const message = `✓ Seu interesse foi registrado! O proprietário será notificado.`;
        this.successMessage.set(message);

        // Auto-clear success message after 4 seconds
        setTimeout(() => {
          if (this.successMessage() === message) {
            this.successMessage.set(null);
          }
        }, 4000);
      },
      error: (err) => {
        if (err?.status === 400) {
          this.errorMessage.set('⚠️ Você já expressou interesse neste livro.');
        } else {
          this.errorMessage.set('❌ Erro ao registrar interesse. Tente novamente.');
        }

        // Auto-clear error message after 5 seconds
        setTimeout(() => {
          this.errorMessage.set(null);
        }, 5000);
      }
    });
  }

  removeInterest(owner: AvailableBookOwner): void {
    const interestId = this.registeredInterests().get(owner.shelfId);
    if (interestId == null) return;

    this.interestsService.deleteInterest(interestId).subscribe({
      next: () => {
        const map = new Map(this.registeredInterests());
        map.delete(owner.shelfId);
        this.registeredInterests.set(map);

        const message = '↩ Interesse removido.';
        this.successMessage.set(message);
        setTimeout(() => {
          if (this.successMessage() === message) this.successMessage.set(null);
        }, 3000);
      },
      error: () => {
        this.errorMessage.set('❌ Erro ao remover interesse. Tente novamente.');
        setTimeout(() => this.errorMessage.set(null), 5000);
      }
    });
  }

  hasExpressedInterest(owner: AvailableBookOwner): boolean {
    return this.registeredInterests().has(owner.shelfId);
  }
}

