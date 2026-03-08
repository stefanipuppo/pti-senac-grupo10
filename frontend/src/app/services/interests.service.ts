import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api.config';

export interface BookInterest {
  id: number;
  solicitante: any;
  dono: any;
  livro: any;
  shelf: any;
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class InterestsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  createInterest(shelfId: number, solicitanteId: number): Observable<BookInterest> {
    return this.http.post<BookInterest>(`${this.baseUrl}/interests`, { shelfId, solicitanteId });
  }

  getInterestsByUser(userId: number): Observable<BookInterest[]> {
    return this.http.get<BookInterest[]>(`${this.baseUrl}/interests/user/${userId}`);
  }

  deleteInterest(interestId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/interests/${interestId}`);
  }
}

