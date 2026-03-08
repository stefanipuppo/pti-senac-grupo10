import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api.config';
import type { User } from '../models';

export interface RegisterOrLoginPayload {
  nome: string;
  email: string;
  cidade: string;
  senha: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  loginOrRegister(payload: RegisterOrLoginPayload): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/auth/register-or-login`, payload);
  }
}

