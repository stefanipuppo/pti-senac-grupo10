package com.example.bookexchange.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.bookexchange.model.Book;
import com.example.bookexchange.model.Genre;
import com.example.bookexchange.repository.BookRepository;
import com.example.bookexchange.repository.GenreRepository;

@Service
public class BookService {

    private final BookRepository repo;
    private final GenreRepository genreRepo;

    public BookService(BookRepository repo, GenreRepository genreRepo) {
        this.repo = repo;
        this.genreRepo = genreRepo;
    }

    public List<Book> findAll() {
        return repo.findAll();
    }

    public Book findById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Book save(Book book) {

        // Verifica e carrega o gênero completo (se veio só o ID)
        if (book.getGenero() != null && book.getGenero().getId() != null) {
            Genre genero = genreRepo.findById(book.getGenero().getId())
                .orElseThrow(() -> new RuntimeException("Gênero não encontrado: " + book.getGenero().getId()));
            book.setGenero(genero);
        }

        // Verifica duplicação por título + autor
        var existing = repo.findByTituloAndAutor(book.getTitulo(), book.getAutor());
        if (existing.isPresent()) {
            return existing.get();
        }

        return repo.save(book);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    // Busca com filtros
    public List<Book> search(String titulo, String autor, Long genreId) {

        if (titulo != null && autor != null) {
            return repo.findByTituloContainingIgnoreCaseAndAutorContainingIgnoreCase(titulo, autor);
        }

        if (titulo != null) {
            return repo.findByTituloContainingIgnoreCase(titulo);
        }

        if (autor != null) {
            return repo.findByAutorContainingIgnoreCase(autor);
        }

        if (genreId != null) {
            return repo.findByGeneroId(genreId);
        }

        return repo.findAll();
    }
}