import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api.config';
import { Book } from '../models';

export interface BookFilters {
  titulo?: string;
  autor?: string;
  genre?: number;
}

export interface AvailableBookOwner {
  shelfId: number;
  ownerId: number;
  ownerName: string;
  cidade: string;
  disponibilidade: string;
  estadoConservacao: string;
}

export interface AvailableBook {
  bookId: number;
  titulo: string;
  autor: string;
  genero: string | null;
  owners: AvailableBookOwner[];
}

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  listBooks(filters?: BookFilters): Observable<Book[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.titulo) {
        params = params.set('titulo', filters.titulo);
      }

      if (filters.autor) {
        params = params.set('autor', filters.autor);
      }

      if (filters.genre != null) {
        params = params.set('genre', String(filters.genre));
      }
    }

    return this.http.get<Book[]>(`${this.baseUrl}/books`, { params });
  }

  listAvailableBooks(filters: BookFilters = {}, excludeUserId?: number): Observable<AvailableBook[]> {
    let params = new HttpParams();

    if (filters.titulo) {
      params = params.set('titulo', filters.titulo);
    }

    if (filters.autor) {
      params = params.set('autor', filters.autor);
    }

    if (filters.genre != null) {
      params = params.set('genre', String(filters.genre));
    }

    if (excludeUserId != null) {
      params = params.set('excludeUserId', String(excludeUserId));
    }

    return this.http.get<AvailableBook[]>(`${this.baseUrl}/books/available`, { params });
  }

  listAvailableBooksWithPagination(
    filters: BookFilters = {},
    excludeUserId?: number,
    page: number = 0,
    size: number = 10,
    sort: string = 'titulo'
  ): Observable<any> {
    let params = new HttpParams();

    if (filters.titulo) {
      params = params.set('titulo', filters.titulo);
    }

    if (filters.autor) {
      params = params.set('autor', filters.autor);
    }

    if (filters.genre != null) {
      params = params.set('genre', String(filters.genre));
    }

    if (excludeUserId != null) {
      params = params.set('excludeUserId', String(excludeUserId));
    }

    params = params.set('page', String(page));
    params = params.set('size', String(size));
    params = params.set('sort', sort);

    return this.http.get<any>(`${this.baseUrl}/books/available`, { params });
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/books/${id}`);
  }

  createBook(payload: { titulo: string; autor: string; genero: { id: number } }): Observable<Book> {
    return this.http.post<Book>(`${this.baseUrl}/books`, payload);
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.baseUrl}/books/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/books/${id}`);
  }
}

