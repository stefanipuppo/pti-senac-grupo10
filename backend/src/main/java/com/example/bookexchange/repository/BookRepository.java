package com.example.bookexchange.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookexchange.model.Book;

public interface BookRepository extends JpaRepository<Book, Long> {

    Optional<Book> findByTituloAndAutor(String titulo, String autor);

    List<Book> findByTituloContainingIgnoreCase(String titulo);

    List<Book> findByAutorContainingIgnoreCase(String autor);

    List<Book> findByGeneroId(Long generoId);

    List<Book> findByTituloContainingIgnoreCaseAndAutorContainingIgnoreCase(String titulo, String autor);
}