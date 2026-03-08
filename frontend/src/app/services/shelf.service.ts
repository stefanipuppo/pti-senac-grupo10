import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api.config';
import { Disponibilidade, UserShelf } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ShelfService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  listShelf(): Observable<UserShelf[]> {
    return this.http.get<UserShelf[]>(`${this.baseUrl}/shelf`);
  }

  createShelfEntry(payload: {
    usuario: { id: number };
    livro: { id: number };
    disponibilidade: Disponibilidade;
    estadoConservacao: string;
  }): Observable<UserShelf> {
    return this.http.post<UserShelf>(`${this.baseUrl}/shelf`, payload);
  }

  updateShelfEntry(id: number, entry: UserShelf): Observable<UserShelf> {
    return this.http.put<UserShelf>(`${this.baseUrl}/shelf/${id}`, entry);
  }

  deleteShelfEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/shelf/${id}`);
  }
}

