package com.example.bookexchange.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookexchange.model.Genre;

public interface GenreRepository extends JpaRepository<Genre, Long> {
    Optional<Genre> findByNomeGenero(String nomeGenero);
}