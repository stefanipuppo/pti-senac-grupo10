export interface User {
  id: number;
  nome: string;
  email: string;
  cidade: string;
}

export interface Genre {
  id: number;
  nomeGenero: string;
}

export interface Book {
  id: number;
  titulo: string;
  autor: string;
  genero: Genre | null;
}

export type Disponibilidade = 'colecao' | 'para_troca';

export interface UserShelf {
  id: number;
  usuario: User;
  livro: Book;
  disponibilidade: Disponibilidade;
  estadoConservacao: string;
}

