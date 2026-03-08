import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import type { User } from '../../models';
import { AuthService } from '../../services/auth.service';
import { CurrentUserService } from '../../state/current-user.service';

const RETURN_URL_KEY = 'bookexchange_return_url';

@Component({
  standalone: true,
  selector: 'app-onboarding-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './onboarding.page.html',
  styleUrl: './onboarding.page.css'
})
export class OnboardingPageComponent {
  private readonly authService = inject(AuthService);
  private readonly currentUserService = inject(CurrentUserService);
  private readonly router = inject(Router);

  nome = '';
  email = '';
  cidade = '';
  senha = '';
  confirmarSenha = '';

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  submit(): void {
    if (
      !this.nome ||
      !this.email ||
      !this.cidade ||
      !this.senha ||
      this.senha.length < 6 ||
      this.senha !== this.confirmarSenha ||
      this.isSubmitting()
    ) {
      if (!this.senha || this.senha.length < 6) {
        this.errorMessage.set('A senha deve ter pelo menos 6 caracteres.');
      } else if (this.senha !== this.confirmarSenha) {
        this.errorMessage.set('As senhas não conferem.');
      }
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.authService
      .loginOrRegister({
        nome: this.nome,
        email: this.email,
        cidade: this.cidade,
        senha: this.senha
      })
      .subscribe({
        next: (user: User) => {
          this.currentUserService.setCurrentUser(user);
          const returnUrl = sessionStorage.getItem(RETURN_URL_KEY) || '/books';
          sessionStorage.removeItem(RETURN_URL_KEY);
          this.router.navigateByUrl(returnUrl).catch(() => {});
          this.isSubmitting.set(false);
        },
        error: (err) => {
          if (err?.status === 401) {
            this.errorMessage.set('E-mail ou senha inválidos.');
          } else {
            this.errorMessage.set('Não foi possível entrar. Tente novamente.');
          }
          this.isSubmitting.set(false);
        }
      });
  }
}

