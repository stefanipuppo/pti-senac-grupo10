import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api.config';
import { Genre } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GenresService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  listGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.baseUrl}/genres`);
  }

  createGenre(nomeGenero: string): Observable<Genre> {
    return this.http.post<Genre>(`${this.baseUrl}/genres`, { nomeGenero });
  }
}

