import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsersService } from '../../services/users.service';
import { GenresService } from '../../services/genres.service';
import { BooksService } from '../../services/books.service';
import type { User, Genre, Book } from '../../models';

@Component({
  standalone: true,
  selector: 'app-admin-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.page.html',
  styleUrl: './admin.page.css'
})
export class AdminPageComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly genresService = inject(GenresService);
  private readonly booksService = inject(BooksService);

  users = signal<User[]>([]);
  genres = signal<Genre[]>([]);
  books = signal<Book[]>([]);

  newGenreName = '';

  ngOnInit(): void {
    this.loadUsers();
    this.loadGenres();
    this.loadBooks();
  }

  private loadUsers(): void {
    this.usersService.listUsers().subscribe({
      next: (users) => this.users.set(users)
    });
  }

  private loadGenres(): void {
    this.genresService.listGenres().subscribe({
      next: (genres) => this.genres.set(genres)
    });
  }

  private loadBooks(): void {
    this.booksService.listBooks().subscribe({
      next: (books) => this.books.set(books)
    });
  }

  addGenre(): void {
    if (!this.newGenreName.trim()) {
      return;
    }

    this.genresService.createGenre(this.newGenreName.trim()).subscribe({
      next: (genre) => {
        this.genres.update((list) => [...list, genre]);
        this.newGenreName = '';
      }
    });
  }
}

